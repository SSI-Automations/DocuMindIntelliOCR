-- Supabase Bulk Test User Cleanup Script
-- This script removes all test users based on email patterns
-- USE WITH CAUTION - This will permanently delete users!

-- Step 1: Preview users that will be deleted
SELECT 
  u.email,
  u.created_at,
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
WHERE u.email LIKE '%test%' 
   OR u.email LIKE '%playwright%'
   OR u.email LIKE '%example.com'
   OR u.email LIKE '%staging%'
   OR u.email LIKE '%dev%'
ORDER BY u.created_at DESC;

-- Step 2: Count users to be deleted
SELECT 
  'Total test users to be deleted:' as message,
  COUNT(*) as count
FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com'
   OR email LIKE '%staging%'
   OR email LIKE '%dev%';

-- Step 3: Bulk cleanup using the automated function
-- Uncomment the block below to execute the cleanup

/*
DO $$
DECLARE
    user_email TEXT;
    result JSON;
    total_deleted INTEGER := 0;
BEGIN
    -- Loop through all test users and delete them
    FOR user_email IN 
        SELECT email FROM auth.users 
        WHERE email LIKE '%test%' 
           OR email LIKE '%playwright%'
           OR email LIKE '%example.com'
           OR email LIKE '%staging%'
           OR email LIKE '%dev%'
    LOOP
        SELECT cleanup_user_by_email(user_email) INTO result;
        
        -- Check if deletion was successful
        IF (result->>'success')::boolean THEN
            total_deleted := total_deleted + 1;
            RAISE NOTICE 'Successfully deleted: %', user_email;
        ELSE
            RAISE NOTICE 'Failed to delete %: %', user_email, result->>'message';
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Bulk cleanup completed. Total users deleted: %', total_deleted;
END $$;
*/

-- Alternative Step 3: Manual bulk cleanup (if automated function is not available)
-- Uncomment the block below to execute manual cleanup

/*
-- Delete in proper order to avoid foreign key constraints
DELETE FROM coach 
WHERE user_id IN (
    SELECT p.id FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email LIKE '%test%' 
       OR u.email LIKE '%playwright%'
       OR u.email LIKE '%example.com'
       OR u.email LIKE '%staging%'
       OR u.email LIKE '%dev%'
);

DELETE FROM client 
WHERE user_id IN (
    SELECT p.id FROM profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE u.email LIKE '%test%' 
       OR u.email LIKE '%playwright%'
       OR u.email LIKE '%example.com'
       OR u.email LIKE '%staging%'
       OR u.email LIKE '%dev%'
);

DELETE FROM profiles 
WHERE id IN (
    SELECT u.id FROM auth.users u
    WHERE u.email LIKE '%test%' 
       OR u.email LIKE '%playwright%'
       OR u.email LIKE '%example.com'
       OR u.email LIKE '%staging%'
       OR u.email LIKE '%dev%'
);

DELETE FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com'
   OR email LIKE '%staging%'
   OR email LIKE '%dev%';
*/

-- Step 4: Verify cleanup completed
SELECT 
  'Verification: No test users should remain' as status;

SELECT COUNT(*) as remaining_test_users
FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com'
   OR email LIKE '%staging%'
   OR email LIKE '%dev%';

-- Step 5: Check for orphaned records after cleanup
SELECT 
  'Orphaned profiles' as issue,
  COUNT(*) as count
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL

UNION ALL

SELECT 
  'Orphaned coaches' as issue,
  COUNT(*) as count
FROM coach c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
  'Orphaned clients' as issue,
  COUNT(*) as count
FROM client cl
LEFT JOIN profiles p ON cl.user_id = p.id
WHERE p.id IS NULL; 