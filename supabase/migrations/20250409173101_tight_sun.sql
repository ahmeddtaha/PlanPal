/*
  # Add relationship between trip_participants and profiles

  1. Changes
    - Add foreign key relationship between trip_participants and profiles through auth.users
    - Update RLS policies to include profile information access

  2. Security
    - Maintain existing RLS policies
    - Add policy for accessing profile information of trip participants
*/

-- First ensure the trip_participants table exists
CREATE TABLE IF NOT EXISTS public.trip_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  CONSTRAINT trip_participants_trip_id_user_id_key UNIQUE (trip_id, user_id)
);

-- Enable RLS if not already enabled
ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view profiles of trip participants" ON public.profiles;

-- Add policy to allow reading profiles of trip participants
CREATE POLICY "Users can view profiles of trip participants"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_participants
      WHERE trip_participants.user_id = profiles.id
      AND EXISTS (
        SELECT 1 FROM public.trip_participants my_participation
        WHERE my_participation.trip_id = trip_participants.trip_id
        AND my_participation.user_id = auth.uid()
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE (
        -- User is the trip creator
        trips.user_id = auth.uid()
        OR
        -- Trip is public
        trips.is_public = true
      )
      AND EXISTS (
        SELECT 1 FROM public.trip_participants
        WHERE trip_participants.trip_id = trips.id
        AND trip_participants.user_id = profiles.id
      )
    )
  );