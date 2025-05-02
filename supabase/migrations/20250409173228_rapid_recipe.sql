/*
  # Fix Profile Relationships

  1. Changes
    - Check for and conditionally add foreign key constraints
    - Ensure proper relationships between profiles and other tables

  2. Security
    - No changes to existing RLS policies
*/

DO $$ 
BEGIN
  -- Check if the constraint exists before adding it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'trip_participants_user_id_fkey_profiles'
    AND table_name = 'trip_participants'
  ) THEN
    -- Add foreign key constraint between trip_participants and profiles
    ALTER TABLE trip_participants
    ADD CONSTRAINT trip_participants_user_id_fkey_profiles
    FOREIGN KEY (user_id) REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;

  -- Check if the constraint exists before adding it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'trips_user_id_fkey_profiles'
    AND table_name = 'trips'
  ) THEN
    -- Add foreign key constraint between trips and profiles for creator
    ALTER TABLE trips
    ADD CONSTRAINT trips_user_id_fkey_profiles
    FOREIGN KEY (user_id) REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;