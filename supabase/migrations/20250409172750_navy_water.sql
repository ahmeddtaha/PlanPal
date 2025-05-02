/*
  # Add trip participants table

  1. New Tables
    - `trip_participants`
      - `id` (uuid, primary key)
      - `trip_id` (uuid, references trips)
      - `user_id` (uuid, references auth.users)
      - `joined_at` (timestamp)

  2. Constraints
    - Primary key on id
    - Foreign keys to trips and users tables
    - Unique constraint on trip_id and user_id combination

  3. Security
    - Enable RLS
    - Add policies for:
      - Users can join public trips
      - Users can leave trips they joined
      - Users can view participants of joined trips
*/

-- Create trip participants table
CREATE TABLE IF NOT EXISTS public.trip_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  CONSTRAINT trip_participants_trip_id_user_id_key UNIQUE (trip_id, user_id)
);

-- Enable RLS
ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can join public trips"
  ON public.trip_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_participants.trip_id
      AND trips.is_public = true
    ))
    AND (user_id = auth.uid())
  );

CREATE POLICY "Users can leave trips they joined"
  ON public.trip_participants
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view participants of joined trips"
  ON public.trip_participants
  FOR SELECT
  TO authenticated
  USING (
    (EXISTS (
      SELECT 1 FROM public.trip_participants my_participation
      WHERE my_participation.trip_id = trip_participants.trip_id
      AND my_participation.user_id = auth.uid()
    ))
    OR
    (EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_participants.trip_id
      AND trips.user_id = auth.uid()
    ))
  );