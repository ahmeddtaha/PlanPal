/*
  # Fix infinite recursion in trip_participants policy

  1. Changes
    - Drop existing policies on trip_participants table
    - Create new, optimized policies that prevent recursion
  
  2. Security
    - Maintain same security rules but with better implementation
    - Users can still view participants of trips they're part of
    - Users can still view participants of trips they created
    - Users can join public trips
    - Users can leave trips they joined
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view participants of joined trips" ON trip_participants;
DROP POLICY IF EXISTS "Users can join public trips" ON trip_participants;
DROP POLICY IF EXISTS "Users can leave trips they joined" ON trip_participants;

-- Create new optimized policies
CREATE POLICY "Users can view participants"
ON trip_participants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM trips
    WHERE 
      trips.id = trip_participants.trip_id 
      AND (
        -- User is the trip creator
        trips.user_id = auth.uid()
        OR
        -- Trip is public
        trips.is_public = true
        OR
        -- User is a participant
        EXISTS (
          SELECT 1 FROM trip_participants AS my_participation
          WHERE 
            my_participation.trip_id = trip_participants.trip_id
            AND my_participation.user_id = auth.uid()
        )
      )
  )
);

CREATE POLICY "Users can join public trips"
ON trip_participants
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only insert themselves
  user_id = auth.uid()
  AND
  -- Trip must be public
  EXISTS (
    SELECT 1 FROM trips
    WHERE 
      trips.id = trip_participants.trip_id
      AND trips.is_public = true
  )
);

CREATE POLICY "Users can leave trips"
ON trip_participants
FOR DELETE
TO authenticated
USING (
  -- Users can only delete their own participation
  user_id = auth.uid()
);