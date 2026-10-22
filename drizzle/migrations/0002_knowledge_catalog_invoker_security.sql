REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

GRANT SELECT (id, title, slug, description, category, resource_type, cover_storage_key, duration, download_enabled, access_button_text, published_at, status) ON public.resources TO anon;
CREATE POLICY "Anonymous reads safe published catalog columns" ON public.resources FOR SELECT TO anon
USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now()
AND ((resource_type = 'video' AND (file_storage_key IS NOT NULL OR video_url IS NOT NULL)) OR (resource_type <> 'video' AND file_storage_key IS NOT NULL AND download_enabled)));

CREATE OR REPLACE VIEW public.public_resources WITH (security_invoker = true) AS
SELECT id, title, slug, description, category, resource_type, cover_storage_key, duration, download_enabled, access_button_text, published_at
FROM public.resources WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= now();
GRANT SELECT ON public.public_resources TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.record_resource_access(p_resource uuid, p_name text, p_email text, p_phone text, p_privacy text, p_consent boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE lead_uuid uuid; access_uuid uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.resources WHERE id = p_resource AND status = 'published' AND published_at <= now() AND ((resource_type = 'video' AND (file_storage_key IS NOT NULL OR video_url IS NOT NULL)) OR (resource_type <> 'video' AND file_storage_key IS NOT NULL AND download_enabled))) THEN RAISE EXCEPTION 'Resource unavailable'; END IF;
  INSERT INTO public.leads (full_name, email, phone, privacy_notice_version, marketing_consent)
  VALUES (p_name, lower(trim(p_email)), nullif(p_phone, ''), p_privacy, p_consent)
  ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, phone = COALESCE(EXCLUDED.phone, public.leads.phone), privacy_notice_version = EXCLUDED.privacy_notice_version, marketing_consent = EXCLUDED.marketing_consent
  RETURNING id INTO lead_uuid;
  SELECT id INTO access_uuid FROM public.resource_accesses WHERE lead_id = lead_uuid AND resource_id = p_resource AND requested_at > now() - interval '2 minutes' ORDER BY requested_at DESC LIMIT 1;
  IF access_uuid IS NULL THEN INSERT INTO public.resource_accesses (lead_id, resource_id) VALUES (lead_uuid, p_resource) RETURNING id INTO access_uuid; END IF;
  RETURN access_uuid;
END;
$$;
REVOKE ALL ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_resource_access(uuid, text, text, text, text, boolean) TO service_role;