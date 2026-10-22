CREATE VIEW public.public_resources AS
SELECT id, title, slug, description, category, resource_type, cover_storage_key, duration, download_enabled, access_button_text, published_at
FROM public.resources WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= now()
AND ((resource_type = 'video' AND (file_storage_key IS NOT NULL OR video_url IS NOT NULL)) OR (resource_type <> 'video' AND file_storage_key IS NOT NULL AND download_enabled));
GRANT SELECT ON public.public_resources TO anon, authenticated, service_role;

CREATE TABLE public.knowledge_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  privacy_notice_url text CHECK (privacy_notice_url IS NULL OR privacy_notice_url ~ '^https://'),
  privacy_notice_version text NOT NULL DEFAULT 'pending',
  max_file_mb integer NOT NULL DEFAULT 50 CHECK (max_file_mb BETWEEN 1 AND 50),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.knowledge_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.knowledge_settings TO authenticated;
GRANT ALL ON public.knowledge_settings TO service_role;
ALTER TABLE public.knowledge_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public privacy configuration" ON public.knowledge_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage knowledge settings" ON public.knowledge_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Read published resource covers" ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'knowledge-covers' AND EXISTS (SELECT 1 FROM public.public_resources r WHERE r.cover_storage_key = name));

CREATE OR REPLACE FUNCTION public.consume_resource_limit(p_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  INSERT INTO public.request_limits (key_hash, attempts) VALUES (p_hash, 1)
  ON CONFLICT (key_hash) DO UPDATE SET
    attempts = CASE WHEN public.request_limits.window_start < now() - interval '10 minutes' THEN 1 ELSE public.request_limits.attempts + 1 END,
    window_start = CASE WHEN public.request_limits.window_start < now() - interval '10 minutes' THEN now() ELSE public.request_limits.window_start END
  RETURNING attempts INTO n;
  RETURN n <= 10;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_resource_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_resource_limit(text) TO service_role;

CREATE OR REPLACE FUNCTION public.record_resource_access(p_resource uuid, p_name text, p_email text, p_phone text, p_privacy text, p_consent boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE lead_uuid uuid; access_uuid uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.public_resources WHERE id = p_resource) THEN RAISE EXCEPTION 'Resource unavailable'; END IF;
  INSERT INTO public.leads (full_name, email, phone, privacy_notice_version, marketing_consent)
  VALUES (p_name, lower(trim(p_email)), nullif(p_phone, ''), p_privacy, p_consent)
  ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, phone = COALESCE(EXCLUDED.phone, public.leads.phone), privacy_notice_version = EXCLUDED.privacy_notice_version, marketing_consent = EXCLUDED.marketing_consent
  RETURNING id INTO lead_uuid;
  SELECT id INTO access_uuid FROM public.resource_accesses WHERE lead_id = lead_uuid AND resource_id = p_resource AND requested_at > now() - interval '2 minutes' ORDER BY requested_at DESC LIMIT 1;
  IF access_uuid IS NULL THEN
    INSERT INTO public.resource_accesses (lead_id, resource_id) VALUES (lead_uuid, p_resource) RETURNING id INTO access_uuid;
  END IF;
  RETURN access_uuid;
END;
$$;
REVOKE ALL ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) TO service_role;

CREATE OR REPLACE FUNCTION public.knowledge_metrics(p_from timestamptz, p_to timestamptz, p_resource uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 RETURN jsonb_build_object(
 'published', (SELECT count(*) FROM public.public_resources),
 'new_leads', (SELECT count(*) FROM public.leads l WHERE l.created_at >= p_from AND l.created_at <= p_to AND (p_resource IS NULL OR EXISTS (SELECT 1 FROM public.resource_accesses a WHERE a.lead_id = l.id AND a.resource_id = p_resource))),
 'requests', (SELECT count(*) FROM public.resource_accesses WHERE requested_at >= p_from AND requested_at <= p_to AND (p_resource IS NULL OR resource_id = p_resource)),
 'top_resources', COALESCE((SELECT jsonb_agg(t) FROM (SELECT r.title, count(*) AS requests FROM public.resource_accesses a JOIN public.resources r ON r.id = a.resource_id WHERE a.requested_at >= p_from AND a.requested_at <= p_to AND (p_resource IS NULL OR a.resource_id = p_resource) GROUP BY r.id ORDER BY count(*) DESC LIMIT 5) t), '[]'::jsonb)
 );
END;
$$;
REVOKE ALL ON FUNCTION public.knowledge_metrics(timestamptz, timestamptz, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.knowledge_metrics(timestamptz, timestamptz, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.knowledge_lead_export(p_from timestamptz, p_to timestamptz, p_resource uuid DEFAULT NULL)
RETURNS TABLE (access_id uuid, full_name text, email text, phone text, marketing_consent boolean, privacy_notice_version text, requested_at timestamptz, resource_title text)
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 RETURN QUERY SELECT a.id, l.full_name, l.email, l.phone, l.marketing_consent, l.privacy_notice_version, a.requested_at, r.title
 FROM public.resource_accesses a JOIN public.leads l ON l.id = a.lead_id JOIN public.resources r ON r.id = a.resource_id
 WHERE a.requested_at >= p_from AND a.requested_at <= p_to AND (p_resource IS NULL OR a.resource_id = p_resource)
 ORDER BY a.requested_at DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.knowledge_lead_export(timestamptz, timestamptz, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.knowledge_lead_export(timestamptz, timestamptz, uuid) TO authenticated;