-- Supabase User Cleanup Script
-- Usage: Replace 'USER_EMAIL_HERE' with the actual email address
-- This script safely removes a user and all associated data

-- Step 1: Verify the user exists and get their information
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  p.first_name,
  p.last_name,
  p.role,
  CASE 
    WHEN c.id IS NOT NULL THEN 'Coach'
    WHEN cl.id IS NOT NULL THEN 'Client'
    ELSE 'No role assigned'
  END as user_type
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN coach c ON p.id = c.user_id
LEFT JOIN client cl ON p.id = cl.user_id
WHERE u.email = 'USER_EMAIL_HERE';

-- Step 2: Use the automated cleanup function (recommended)
-- Uncomment the line below and replace the email
-- SELECT cleanup_user_by_email('USER_EMAIL_HERE');

-- Alternative Step 2: Manual cleanup (if automated function is not available)
-- Uncomment the block below and replace USER_ID_HERE with the actual UUID from Step 1

/*
-- Get the user ID first
-- SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE';

-- Delete in proper order to avoid foreign key constraints
DELETE FROM coach WHERE user_id = 'USER_ID_HERE';
DELETE FROM client WHERE user_id = 'USER_ID_HERE';
DELETE FROM profiles WHERE id = 'USER_ID_HERE';
DELETE FROM auth.users WHERE id = 'USER_ID_HERE';
*/

-- Step 3: Verify the user has been completely removed
SELECT 
  'Verification: User should not appear in any results below' as status;

SELECT 'auth.users' as table_name, COUNT(*) as remaining_records
FROM auth.users WHERE email = 'USER_EMAIL_HERE'
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as remaining_records
FROM profiles WHERE email = 'USER_EMAIL_HERE'
UNION ALL
SELECT 'coach' as table_name, COUNT(*) as remaining_records
FROM coach c
JOIN profiles p ON c.user_id = p.id
WHERE p.email = 'USER_EMAIL_HERE'
UNION ALL
SELECT 'client' as table_name, COUNT(*) as remaining_records
FROM client cl
JOIN profiles p ON cl.user_id = p.id
WHERE p.email = 'USER_EMAIL_HERE'; 