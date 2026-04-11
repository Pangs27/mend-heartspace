-- Create mend_conversations table
CREATE TABLE public.mend_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add conversation_id to mend_messages
ALTER TABLE public.mend_messages ADD COLUMN conversation_id UUID REFERENCES public.mend_conversations(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.mend_conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for mend_conversations
CREATE POLICY "Users can view their own conversations"
ON public.mend_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
ON public.mend_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.mend_conversations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON public.mend_conversations FOR DELETE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_mend_conversations_user_id ON public.mend_conversations(user_id);
CREATE INDEX idx_mend_conversations_updated_at ON public.mend_conversations(updated_at);
CREATE INDEX idx_mend_messages_conversation_id ON public.mend_messages(conversation_id);
