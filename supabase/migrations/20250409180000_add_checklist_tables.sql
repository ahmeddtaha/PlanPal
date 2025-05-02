/*
  # Add checklist tables

  1. New Tables
    - `checklist_categories`
      - `id` (uuid, primary key)
      - `name` (text): e.g., 'Electronics', 'Documents', etc.
      - `created_at` (timestamp)
    
    - `checklist_items`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references checklist_categories)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `checked` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for users to manage their checklist items
*/

-- Create checklist categories table
CREATE TABLE IF NOT EXISTS public.checklist_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create checklist items table
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.checklist_categories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checklist_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_categories
CREATE POLICY "Everyone can read checklist categories"
  ON public.checklist_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for checklist_items
CREATE POLICY "Users can create their own checklist items"
  ON public.checklist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own checklist items"
  ON public.checklist_items
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own checklist items"
  ON public.checklist_items
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own checklist items"
  ON public.checklist_items
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default categories
INSERT INTO public.checklist_categories (name) VALUES
  ('Documents'),
  ('Clothing'),
  ('Toiletries'),
  ('Electronics')
ON CONFLICT (name) DO NOTHING; 