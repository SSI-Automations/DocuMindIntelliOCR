-- Supabase Database Health Check Script
-- This script provides a comprehensive overview of database health and integrity

-- ===== BASIC STATISTICS =====
SELECT 'DATABASE OVERVIEW' as section;

SELECT 
  'Total Users' as metric,
  COUNT(*) as count,
  'Users in auth.users table' as description
FROM auth.users

UNION ALL

SELECT 
  'Completed Profiles' as metric,
  COUNT(*) as count,
  'Users who completed onboarding' as description
FROM profiles

UNION ALL

SELECT 
  'Active Coaches' as metric,
  COUNT(*) as count,
  'Users with coach role' as description
FROM coach

UNION ALL

SELECT 
  'Active Clients' as metric,
  COUNT(*) as count,
  'Users with client role' as description
FROM client;

-- ===== USER REGISTRATION TRENDS =====
SELECT 'REGISTRATION TRENDS (Last 30 Days)' as section;

SELECT 
  DATE(created_at) as signup_date,
  COUNT(*) as new_signups,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_emails
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY signup_date DESC
LIMIT 10;

-- ===== PROFILE COMPLETION RATES =====
SELECT 'PROFILE COMPLETION ANALYSIS' as section;

SELECT 
  'Users with Auth Only' as status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM auth.users), 2) as percentage
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
  'Users with Profiles' as status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM auth.users), 2) as percentage
FROM profiles

UNION ALL

SELECT 
  'Users with Role Assignment' as status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM auth.users), 2) as percentage
FROM profiles p
WHERE EXISTS (SELECT 1 FROM coach c WHERE c.user_id = p.id)
   OR EXISTS (SELECT 1 FROM client cl WHERE cl.user_id = p.id);

-- ===== DATA INTEGRITY CHECKS =====
SELECT 'DATA INTEGRITY ISSUES' as section;

-- Check for orphaned profiles
SELECT 
  'Orphaned Profiles' as issue,
  COUNT(*) as count,
  'Profiles without corresponding auth.users record' as description
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL

UNION ALL

-- Check for orphaned coaches
SELECT 
  'Orphaned Coaches' as issue,
  COUNT(*) as count,
  'Coach records without corresponding profiles' as description
FROM coach c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE p.id IS NULL

UNION ALL

-- Check for orphaned clients
SELECT 
  'Orphaned Clients' as issue,
  COUNT(*) as count,
  'Client records without corresponding profiles' as description
FROM client cl
LEFT JOIN profiles p ON cl.user_id = p.id
WHERE p.id IS NULL

UNION ALL

-- Check for users with multiple roles
SELECT 
  'Users with Multiple Roles' as issue,
  COUNT(*) as count,
  'Users assigned to both coach and client tables' as description
FROM profiles p
WHERE EXISTS (SELECT 1 FROM coach c WHERE c.user_id = p.id)
  AND EXISTS (SELECT 1 FROM client cl WHERE cl.user_id = p.id)

UNION ALL

-- Check for email mismatches
SELECT 
  'Email Mismatches' as issue,
  COUNT(*) as count,
  'Profiles with different email than auth.users' as description
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email != u.email;

-- ===== RECENT ACTIVITY =====
SELECT 'RECENT ACTIVITY (Last 7 Days)' as section;

SELECT 
  u.email,
  u.created_at as signup_time,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.role,
  CASE 
    WHEN c.id IS NOT NULL THEN 'Coach Profile Created'
    WHEN cl.id IS NOT NULL THEN 'Client Profile Created'
    WHEN p.id IS NOT NULL THEN 'Basic Profile Only'
    ELSE 'No Profile'
  END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN coach c ON p.id = c.user_id
LEFT JOIN client cl ON p.id = cl.user_id
WHERE u.created_at > NOW() - INTERVAL '7 days'
ORDER BY u.created_at DESC;

-- ===== TEST DATA DETECTION =====
SELECT 'TEST DATA DETECTION' as section;

SELECT 
  'Test Users Detected' as category,
  COUNT(*) as count,
  'Users with test-related email patterns' as description
FROM auth.users 
WHERE email LIKE '%test%' 
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com'
   OR email LIKE '%staging%'
   OR email LIKE '%dev%'
   OR email LIKE '%demo%';

-- List test users if any exist
SELECT 
  'TEST USERS FOUND' as section,
  u.email,
  u.created_at,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email LIKE '%test%' 
   OR u.email LIKE '%playwright%'
   OR u.email LIKE '%example.com'
   OR u.email LIKE '%staging%'
   OR u.email LIKE '%dev%'
   OR u.email LIKE '%demo%'
ORDER BY u.created_at DESC;

-- ===== STORAGE ANALYSIS =====
SELECT 'STORAGE ANALYSIS' as section;

-- Estimate table sizes (approximate)
SELECT 
  'auth.users' as table_name,
  COUNT(*) as record_count,
  'Authentication records' as description
FROM auth.users

UNION ALL

SELECT 
  'profiles' as table_name,
  COUNT(*) as record_count,
  'User profile records' as description
FROM profiles

UNION ALL

SELECT 
  'coach' as table_name,
  COUNT(*) as record_count,
  'Coach-specific records' as description
FROM coach

UNION ALL

SELECT 
  'client' as table_name,
  COUNT(*) as record_count,
  'Client-specific records' as description
FROM client;

-- ===== RECOMMENDATIONS =====
SELECT 'HEALTH CHECK COMPLETE' as section;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM profiles p LEFT JOIN auth.users u ON p.id = u.id WHERE u.id IS NULL) > 0
    THEN 'WARNING: Orphaned records detected. Run cleanup scripts.'
    WHEN (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%example%') > 0
    THEN 'INFO: Test users detected. Consider cleanup if in production.'
    ELSE 'HEALTHY: No major issues detected.'
  END as overall_status,
  NOW() as check_timestamp; 