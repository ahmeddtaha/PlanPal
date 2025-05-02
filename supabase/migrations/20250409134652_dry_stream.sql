/*
  # Create trips table with proper auth schema setup

  1. Schema Setup
    - Create auth schema if it doesn't exist
    - Create users table for Supabase Auth

  2. New Tables
    - `trips`
      - `id` (uuid, primary key): Unique identifier for each trip
      - `user_id` (uuid): Reference to the auth.users table
      - `destination_id` (text): The selected destination country
      - `privacy_type` (text): Either 'private' or 'public'
      - `trip_type` (text): 'solo', 'friends', or 'family' for private trips
      - `start_date` (date): Trip start date
      - `end_date` (date): Trip end date
      - `culture_preference` (text): Selected cultural activity preference
      - `nature_preference` (text): Selected nature and wellness preference
      - `food_preference` (text): Selected food experience preference
      - `entertainment_preference` (text): Selected entertainment preference
      - `budget_level` (text): Selected budget level
      - `created_at` (timestamptz): Record creation timestamp
      - `updated_at` (timestamptz): Record update timestamp
      - `is_public` (boolean): Quick access flag for public trips

  3. Security
    - Enable RLS on trips table
    - Add policies for CRUD operations
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid NOT NULL PRIMARY KEY,
  email text
);

-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  destination_id text NOT NULL,
  privacy_type text NOT NULL,
  trip_type text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  culture_preference text,
  nature_preference text,
  food_preference text,
  entertainment_preference text,
  budget_level text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_public boolean DEFAULT false,

  -- Add constraints
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_trip_type CHECK (
    trip_type = ANY (ARRAY['solo', 'friends', 'family'])
  ),
  CONSTRAINT valid_privacy_type CHECK (
    privacy_type = ANY (ARRAY['private', 'public'])
  ),
  CONSTRAINT valid_budget_level CHECK (
    budget_level = ANY (ARRAY['basic', 'balanced', 'luxury'])
  )
);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create own trips"
  ON public.trips
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own trips and public trips"
  ON public.trips
  FOR SELECT
  TO authenticated
  USING ((user_id = auth.uid()) OR (is_public = true));

CREATE POLICY "Users can update own trips"
  ON public.trips
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own trips"
  ON public.trips
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());