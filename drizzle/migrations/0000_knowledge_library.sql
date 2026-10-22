CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.resource_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.resource_type AS ENUM ('pdf', 'video', 'other');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users read their own roles" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE
  current_email text;
  confirmed timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN public.has_role(auth.uid(), 'admin');
  END IF;
  SELECT lower(email), email_confirmed_at INTO current_email, confirmed FROM auth.users WHERE id = auth.uid();
  IF current_email = 'juan.hdz0429@gmail.com' AND confirmed IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 600),
  category text NOT NULL CHECK (category IN ('Inteligencia artificial','Marketing digital','Ventas','Emprendimiento','Productividad','Innovación empresarial')),
  resource_type public.resource_type NOT NULL,
  cover_storage_key text,
  file_storage_key text,
  video_url text CHECK (video_url IS NULL OR video_url ~ '^https://'),
  duration text CHECK (duration IS NULL OR char_length(duration) <= 60),
  status public.resource_status NOT NULL DEFAULT 'draft',
  download_enabled boolean NOT NULL DEFAULT true,
  access_button_text text NOT NULL DEFAULT 'Descargar mi recurso' CHECK (char_length(access_button_text) BETWEEN 3 AND 60),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX resources_public_idx ON public.resources(status, published_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage resources" ON public.resources FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL UNIQUE CHECK (email = lower(email) AND char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{10,15}$'),
  privacy_notice_version text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.resource_accesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  requested_at timestamptz NOT NULL DEFAULT now(),
  access_status text NOT NULL DEFAULT 'granted' CHECK (access_status IN ('granted','failed'))
);
CREATE INDEX resource_accesses_resource_idx ON public.resource_accesses(resource_id, requested_at DESC);
CREATE INDEX resource_accesses_lead_idx ON public.resource_accesses(lead_id, requested_at DESC);
GRANT SELECT ON public.resource_accesses TO authenticated;
GRANT ALL ON public.resource_accesses TO service_role;
ALTER TABLE public.resource_accesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read resource accesses" ON public.resource_accesses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.request_limits (
  key_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0
);
GRANT ALL ON public.request_limits TO service_role;
ALTER TABLE public.request_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage knowledge files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id IN ('knowledge-files','knowledge-covers') AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id IN ('knowledge-files','knowledge-covers') AND public.has_role(auth.uid(), 'admin'));