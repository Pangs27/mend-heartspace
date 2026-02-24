
-- Table 1: mend_user_memory
CREATE TABLE public.mend_user_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  memory_type text NOT NULL CHECK (memory_type IN ('preference', 'recurring_theme', 'trigger', 'coping_pattern', 'relationship_context', 'goal', 'boundary')),
  content text NOT NULL,
  confidence numeric DEFAULT 0.5,
  evidence_count integer DEFAULT 1,
  first_seen_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  safety_level text DEFAULT 'normal' CHECK (safety_level IN ('normal', 'sensitive', 'crisis_related')),
  source text DEFAULT 'chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mend_user_memory_user_id ON public.mend_user_memory (user_id);
CREATE INDEX idx_mend_user_memory_status ON public.mend_user_memory (status);
CREATE INDEX idx_mend_user_memory_last_seen ON public.mend_user_memory (last_seen_at);

ALTER TABLE public.mend_user_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memories" ON public.mend_user_memory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memories" ON public.mend_user_memory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories" ON public.mend_user_memory FOR UPDATE USING (auth.uid() = user_id);
-- Service role can also insert/update via edge functions (bypasses RLS)

-- Table 2: mend_memory_evidence
CREATE TABLE public.mend_memory_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id uuid NOT NULL REFERENCES public.mend_user_memory(id) ON DELETE CASCADE,
  message_id uuid REFERENCES public.mend_messages(id) ON DELETE CASCADE,
  snippet text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.mend_memory_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evidence" ON public.mend_memory_evidence FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.mend_user_memory m WHERE m.id = memory_id AND m.user_id = auth.uid()));
CREATE POLICY "Users can insert own evidence" ON public.mend_memory_evidence FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.mend_user_memory m WHERE m.id = memory_id AND m.user_id = auth.uid()));

-- Table 3: mend_weekly_insights
CREATE TABLE public.mend_weekly_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  week_end date NOT NULL,
  dominant_emotions jsonb,
  top_triggers jsonb,
  time_bucket_peaks jsonb,
  volatility_score integer,
  narrative text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.mend_weekly_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights" ON public.mend_weekly_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON public.mend_weekly_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON public.mend_weekly_insights FOR UPDATE USING (auth.uid() = user_id);
