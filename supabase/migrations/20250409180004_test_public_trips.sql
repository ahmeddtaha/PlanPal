/*
  # Test Public Trips Functionality

  1. Changes
    - Add test data
    - Verify RLS policies
*/

-- Insert a test public trip if none exists
INSERT INTO public.trips (
  id,
  user_id,
  destination_id,
  privacy_type,
  start_date,
  end_date,
  budget_level,
  is_public
)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  id,
  'France',
  'public',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '7 days',
  'balanced',
  true
FROM auth.users
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Verify the test trip is accessible
SELECT 
  t.id,
  t.destination_id,
  t.start_date,
  t.end_date,
  p.full_name as creator_name,
  COUNT(tp.id) as participant_count
FROM public.trips t
LEFT JOIN public.profiles p ON t.user_id = p.id
LEFT JOIN public.trip_participants tp ON t.id = tp.trip_id
WHERE t.is_public = true
GROUP BY t.id, t.destination_id, t.start_date, t.end_date, p.full_name;

-- List all RLS policies for verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 