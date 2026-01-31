-- Create mend_messages table for chat persistence
CREATE TABLE public.mend_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mend_signals table for emotion extraction
CREATE TABLE public.mend_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.mend_messages(id) ON DELETE CASCADE,
  primary_emotion TEXT NOT NULL,
  secondary_emotion TEXT,
  intensity TEXT NOT NULL,
  context TEXT NOT NULL,
  time_bucket TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.mend_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mend_signals ENABLE ROW LEVEL SECURITY;

-- RLS policies for mend_messages
CREATE POLICY "Users can view their own messages"
ON public.mend_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
ON public.mend_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for mend_signals
CREATE POLICY "Users can view their own signals"
ON public.mend_signals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own signals"
ON public.mend_signals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_mend_messages_user_id ON public.mend_messages(user_id);
CREATE INDEX idx_mend_messages_created_at ON public.mend_messages(created_at);
CREATE INDEX idx_mend_signals_user_id ON public.mend_signals(user_id);
CREATE INDEX idx_mend_signals_message_id ON public.mend_signals(message_id);