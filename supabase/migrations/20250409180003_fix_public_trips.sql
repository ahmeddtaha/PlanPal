/*
  # Fix Public Trips Functionality

  1. Changes
    - Ensure profiles table exists
    - Fix foreign key relationships
    - Update RLS policies for public trips
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading profiles of public trip participants
CREATE POLICY "Users can view profiles of public trip participants"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.is_public = true
      AND (
        trips.user_id = profiles.id
        OR EXISTS (
          SELECT 1 FROM public.trip_participants
          WHERE trip_participants.trip_id = trips.id
          AND trip_participants.user_id = profiles.id
        )
      )
    )
  );

-- Update trips table RLS policy to allow reading public trips
DROP POLICY IF EXISTS "Users can read own trips and public trips" ON public.trips;
CREATE POLICY "Users can read public trips"
  ON public.trips
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Update trip_participants table RLS policy
DROP POLICY IF EXISTS "Users can view participants" ON public.trip_participants;
CREATE POLICY "Users can view public trip participants"
  ON public.trip_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_participants.trip_id
      AND trips.is_public = true
    )
  ); 