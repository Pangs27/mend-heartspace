
-- Circles table
CREATE TABLE public.circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view circles"
  ON public.circles FOR SELECT
  TO authenticated
  USING (true);

-- Circle posts table
CREATE TABLE public.circle_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alias text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  support_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view posts"
  ON public.circle_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.circle_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Post replies table
CREATE TABLE public.post_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.circle_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alias text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view replies"
  ON public.post_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.post_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Seed circles
INSERT INTO public.circles (name, description) VALUES
  ('Breakups and Moving On', 'A space to talk about endings, healing, and what comes next.'),
  ('Academic Pressure', 'For moments of stress around exams, deadlines, and expectations.'),
  ('Work Pressure', 'Conversations about workload and finding balance.'),
  ('Loneliness and Connection', 'When you feel alone or are trying to build deeper relationships.'),
  ('Anxious Thoughts', 'For moments when your mind feels restless or overwhelmed.'),
  ('Family Dynamics', 'Navigating expectations, conflict, and changing roles.');
