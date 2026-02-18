
-- Create conversation_state table for rolling session snapshots
CREATE TABLE public.conversation_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  themes TEXT[] NOT NULL DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- One snapshot per user (latest conversation context)
CREATE UNIQUE INDEX idx_conversation_state_user ON public.conversation_state (user_id);

-- Enable RLS
ALTER TABLE public.conversation_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversation state"
ON public.conversation_state FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversation state"
ON public.conversation_state FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversation state"
ON public.conversation_state FOR UPDATE
USING (auth.uid() = user_id);
