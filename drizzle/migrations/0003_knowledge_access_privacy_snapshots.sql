ALTER TABLE public.resource_accesses ADD COLUMN submitted_name text, ADD COLUMN submitted_phone text, ADD COLUMN privacy_notice_version text, ADD COLUMN marketing_consent boolean NOT NULL DEFAULT false;
UPDATE public.resource_accesses a SET submitted_name = l.full_name, submitted_phone = l.phone, privacy_notice_version = l.privacy_notice_version, marketing_consent = l.marketing_consent FROM public.leads l WHERE l.id = a.lead_id;

CREATE OR REPLACE FUNCTION public.record_resource_access(p_resource uuid, p_name text, p_email text, p_phone text, p_privacy text, p_consent boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE lead_uuid uuid; access_uuid uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.resources WHERE id = p_resource AND status = 'published' AND published_at <= now() AND ((resource_type = 'video' AND (file_storage_key IS NOT NULL OR video_url IS NOT NULL)) OR (resource_type <> 'video' AND file_storage_key IS NOT NULL AND download_enabled))) THEN RAISE EXCEPTION 'Resource unavailable'; END IF;
  INSERT INTO public.leads (full_name, email, phone, privacy_notice_version, marketing_consent) VALUES (p_name, lower(trim(p_email)), nullif(p_phone, ''), p_privacy, p_consent) ON CONFLICT (email) DO NOTHING;
  SELECT id INTO lead_uuid FROM public.leads WHERE email = lower(trim(p_email)) FOR UPDATE;
  SELECT id INTO access_uuid FROM public.resource_accesses WHERE lead_id = lead_uuid AND resource_id = p_resource AND requested_at > now() - interval '2 minutes' ORDER BY requested_at DESC LIMIT 1;
  IF access_uuid IS NULL THEN INSERT INTO public.resource_accesses (lead_id, resource_id, submitted_name, submitted_phone, privacy_notice_version, marketing_consent) VALUES (lead_uuid, p_resource, p_name, nullif(p_phone, ''), p_privacy, p_consent) RETURNING id INTO access_uuid; END IF;
  RETURN access_uuid;
END;
$$;
REVOKE ALL ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) TO service_role;

CREATE OR REPLACE FUNCTION public.knowledge_lead_export(p_from timestamptz, p_to timestamptz, p_resource uuid DEFAULT NULL)
RETURNS TABLE (access_id uuid, full_name text, email text, phone text, marketing_consent boolean, privacy_notice_version text, requested_at timestamptz, resource_title text)
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 RETURN QUERY SELECT a.id, COALESCE(a.submitted_name, l.full_name), l.email, a.submitted_phone, a.marketing_consent, COALESCE(a.privacy_notice_version, l.privacy_notice_version), a.requested_at, r.title FROM public.resource_accesses a JOIN public.leads l ON l.id = a.lead_id JOIN public.resources r ON r.id = a.resource_id WHERE a.requested_at >= p_from AND a.requested_at <= p_to AND (p_resource IS NULL OR a.resource_id = p_resource) ORDER BY a.requested_at DESC, a.id;
END;
$$;
REVOKE ALL ON FUNCTION public.knowledge_lead_export(timestamptz, timestamptz, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.knowledge_lead_export(timestamptz, timestamptz, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.knowledge_metrics(p_from timestamptz, p_to timestamptz, p_resource uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 RETURN jsonb_build_object('published', (SELECT count(*) FROM public.public_resources), 'new_leads', (SELECT count(*) FROM public.leads l WHERE l.created_at >= p_from AND l.created_at <= p_to AND (p_resource IS NULL OR EXISTS (SELECT 1 FROM public.resource_accesses a WHERE a.lead_id = l.id AND a.resource_id = p_resource AND a.requested_at >= p_from AND a.requested_at <= p_to))), 'requests', (SELECT count(*) FROM public.resource_accesses WHERE requested_at >= p_from AND requested_at <= p_to AND (p_resource IS NULL OR resource_id = p_resource)), 'top_resources', COALESCE((SELECT jsonb_agg(t) FROM (SELECT r.title, count(*) AS requests FROM public.resource_accesses a JOIN public.resources r ON r.id = a.resource_id WHERE a.requested_at >= p_from AND a.requested_at <= p_to AND (p_resource IS NULL OR a.resource_id = p_resource) GROUP BY r.id ORDER BY count(*) DESC LIMIT 5) t), '[]'::jsonb));
END;
$$;
REVOKE ALL ON FUNCTION public.knowledge_metrics(timestamptz, timestamptz, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.knowledge_metrics(timestamptz, timestamptz, uuid) TO authenticated;