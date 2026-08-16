-- 1. Signup: role-aware, idempotent profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_role text; v_name text;
BEGIN
  v_role := NULLIF(NEW.raw_user_meta_data->>'role', '');
  IF v_role NOT IN ('creator','brand') OR v_role IS NULL THEN v_role := 'creator'; END IF;
  v_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name',''), NULLIF(NEW.raw_user_meta_data->>'full_name',''), split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, v_name, v_role)
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'brand' THEN
    INSERT INTO public.brand_profiles (profile_id, company_name)
    VALUES (NEW.id, v_name) ON CONFLICT (profile_id) DO NOTHING;
  ELSE
    INSERT INTO public.creator_profiles (profile_id)
    VALUES (NEW.id) ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;

-- 2. Collaboration deliverables
CREATE TABLE IF NOT EXISTS public.collaboration_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id uuid NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending','submitted','approved','revision_requested'])),
  submission_note text,
  submission_link text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.collaboration_deliverables TO authenticated;
GRANT ALL ON public.collaboration_deliverables TO service_role;

ALTER TABLE public.collaboration_deliverables ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.in_collaboration(_collaboration_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM public.collaborations c WHERE c.id = _collaboration_id AND (c.creator_id = auth.uid() OR c.brand_id = auth.uid())); $$;

CREATE POLICY deliverables_participant_read ON public.collaboration_deliverables
  FOR SELECT TO authenticated USING (public.in_collaboration(collaboration_id));

CREATE POLICY deliverables_participant_update ON public.collaboration_deliverables
  FOR UPDATE TO authenticated USING (public.in_collaboration(collaboration_id))
  WITH CHECK (public.in_collaboration(collaboration_id));

CREATE POLICY deliverables_brand_insert ON public.collaboration_deliverables
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.collaborations c WHERE c.id = collaboration_id AND c.brand_id = auth.uid()));

CREATE TRIGGER collaboration_deliverables_updated
  BEFORE UPDATE ON public.collaboration_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS collaboration_deliverables_collab_idx ON public.collaboration_deliverables (collaboration_id, sort_order);

-- 3. accept_application also seeds deliverables
CREATE OR REPLACE FUNCTION public.accept_application(_application_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_app public.applications; v_campaign public.campaigns; v_collab_id UUID; v_conv_id UUID;
BEGIN
  SELECT * INTO v_app FROM public.applications WHERE id = _application_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;
  SELECT * INTO v_campaign FROM public.campaigns WHERE id = v_app.campaign_id;
  IF v_campaign.brand_id <> auth.uid() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  IF v_app.status IN ('withdrawn','rejected') THEN RAISE EXCEPTION 'Application is no longer active'; END IF;

  UPDATE public.applications SET status = 'accepted' WHERE id = _application_id;

  INSERT INTO public.collaborations (campaign_id, creator_id, brand_id, status, start_date, end_date, agreed_budget, deliverables)
  VALUES (v_campaign.id, v_app.creator_id, v_campaign.brand_id, 'active', v_campaign.campaign_start_date, v_campaign.campaign_end_date, COALESCE(v_app.proposed_rate, v_campaign.budget), v_campaign.deliverables)
  ON CONFLICT (campaign_id, creator_id) DO UPDATE SET status = 'active'
  RETURNING id INTO v_collab_id;

  INSERT INTO public.collaboration_deliverables (collaboration_id, title, sort_order)
  SELECT v_collab_id, d.title, d.ord
  FROM unnest(COALESCE(NULLIF(v_campaign.deliverables, '{}'), ARRAY['Campaign content'])) WITH ORDINALITY AS d(title, ord)
  WHERE NOT EXISTS (SELECT 1 FROM public.collaboration_deliverables x WHERE x.collaboration_id = v_collab_id);

  INSERT INTO public.conversations (campaign_id, brand_id, creator_id)
  VALUES (v_campaign.id, v_campaign.brand_id, v_app.creator_id)
  ON CONFLICT (campaign_id, brand_id, creator_id) DO UPDATE SET last_message_at = now()
  RETURNING id INTO v_conv_id;

  RETURN v_collab_id;
END; $function$;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS campaigns_status_created_idx ON public.campaigns (status, created_at DESC);
CREATE INDEX IF NOT EXISTS campaigns_brand_idx ON public.campaigns (brand_id, created_at DESC);
CREATE INDEX IF NOT EXISTS campaigns_category_idx ON public.campaigns (category);
CREATE INDEX IF NOT EXISTS applications_campaign_idx ON public.applications (campaign_id, status);
CREATE INDEX IF NOT EXISTS applications_creator_idx ON public.applications (creator_id, applied_at DESC);
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON public.messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS collaborations_participants_idx ON public.collaborations (creator_id, brand_id);
CREATE INDEX IF NOT EXISTS saved_campaigns_creator_idx ON public.saved_campaigns (creator_id);