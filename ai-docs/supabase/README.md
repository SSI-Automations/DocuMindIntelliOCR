# Supabase Operations Guide

This guide provides comprehensive instructions for managing Supabase operations, user cleanup, and data management for the Health Coach AI application.

## 📋 Table of Contents

- [Database Schema Overview](#database-schema-overview)
- [User Management](#user-management)
- [Data Cleanup Procedures](#data-cleanup-procedures)
- [Automated Cleanup Scripts](#automated-cleanup-scripts)
- [Manual Cleanup Procedures](#manual-cleanup-procedures)
- [Testing and Development](#testing-and-development)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🗄️ Database Schema Overview

### Core Tables Structure

```
auth.users (Supabase Auth)
    ↓ (1:1 relationship)
profiles (Custom user profiles)
    ↓ (1:many relationship)
├── coach (Coach-specific data)
└── client (Client-specific data)
```

### Table Relationships

| Table        | Primary Key | Foreign Key               | Description                   |
| ------------ | ----------- | ------------------------- | ----------------------------- |
| `auth.users` | `id`        | -                         | Supabase authentication table |
| `profiles`   | `id`        | `id` → `auth.users.id`    | User profile information      |
| `coach`      | `id`        | `user_id` → `profiles.id` | Coach-specific data           |
| `client`     | `id`        | `user_id` → `profiles.id` | Client-specific data          |

### Key Fields

**auth.users:**

- `id` (UUID) - Primary key
- `email` (TEXT) - User email address
- `created_at` (TIMESTAMP) - Account creation time
- `email_confirmed_at` (TIMESTAMP) - Email confirmation time

**profiles:**

- `id` (UUID) - Same as auth.users.id
- `email` (TEXT) - User email (duplicated for convenience)
- `first_name` (TEXT) - User's first name
- `last_name` (TEXT) - User's last name
- `role` (TEXT) - User role ('coach' or 'client')

## 👥 User Management

### Finding Users

#### Search by Email

```sql
-- Find user across all tables
SELECT
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  p.first_name,
  p.last_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

#### Search by User ID

```sql
-- Find all records for a specific user ID
SELECT
  'auth.users' as table_name,
  id::text as record_id,
  email,
  created_at
FROM auth.users
WHERE id = 'USER_ID_HERE'

UNION ALL

SELECT
  'profiles' as table_name,
  id::text as record_id,
  email,
  created_at
FROM profiles
WHERE id = 'USER_ID_HERE'

UNION ALL

SELECT
  'coach' as table_name,
  id::text as record_id,
  (SELECT email FROM profiles WHERE id = user_id) as email,
  created_at
FROM coach
WHERE user_id = 'USER_ID_HERE'

UNION ALL

SELECT
  'client' as table_name,
  id::text as record_id,
  (SELECT email FROM profiles WHERE id = user_id) as email,
  created_at
FROM client
WHERE user_id = 'USER_ID_HERE';
```

### User Lifecycle

1. **User Registration** → Record created in `auth.users`
2. **Profile Creation** → Record created in `profiles` (during onboarding)
3. **Role Assignment** → Record created in `coach` or `client` table
4. **User Deletion** → Records removed in reverse order

## 🧹 Data Cleanup Procedures

### ⚠️ Critical Deletion Order

**Always delete in this exact order to avoid foreign key constraint errors:**

1. **Role-specific tables** (`coach`, `client`)
2. **Profile table** (`profiles`)
3. **Auth table** (`auth.users`)

### Automated Cleanup (Recommended)

We've created a PostgreSQL function for safe user cleanup:

```sql
-- Remove user and all associated data
SELECT cleanup_user_by_email('user@example.com');
```

**Response Format:**

```json
{
  "success": true,
  "message": "User successfully removed from all tables",
  "email": "user@example.com",
  "user_id": "uuid-here",
  "records_removed": {
    "coach": 1,
    "client": 0,
    "profiles": 1,
    "auth_users": 1
  }
}
```

### Manual Cleanup Procedure

If you need more control or the automated function isn't available:

```sql
-- Step 1: Get the user ID
SELECT id FROM auth.users WHERE email = 'user@example.com';

-- Step 2: Delete in proper order (replace USER_ID_HERE with actual ID)
DELETE FROM coach WHERE user_id = 'USER_ID_HERE';
DELETE FROM client WHERE user_id = 'USER_ID_HERE';
DELETE FROM profiles WHERE id = 'USER_ID_HERE';
DELETE FROM auth.users WHERE id = 'USER_ID_HERE';
```

### Bulk Cleanup

For multiple users:

```sql
-- Clean up multiple test users
DO $$
DECLARE
    test_emails TEXT[] := ARRAY[
        'test1@example.com',
        'test2@example.com',
        'playwright-test@example.com'
    ];
    email_addr TEXT;
    result JSON;
BEGIN
    FOREACH email_addr IN ARRAY test_emails
    LOOP
        SELECT cleanup_user_by_email(email_addr) INTO result;
        RAISE NOTICE 'Cleanup result for %: %', email_addr, result;
    END LOOP;
END $$;
```

## 🤖 Automated Cleanup Scripts

### Creating the Cleanup Function

If the cleanup function doesn't exist, create it:

```sql
CREATE OR REPLACE FUNCTION cleanup_user_by_email(user_email TEXT)
RETURNS JSON AS $$
DECLARE
  user_id UUID;
  result JSON;
  coach_count INTEGER;
  client_count INTEGER;
  profile_count INTEGER;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;

  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User not found',
      'email', user_email
    );
  END IF;

  -- Count records before deletion
  SELECT COUNT(*) INTO coach_count FROM coach WHERE user_id = user_id;
  SELECT COUNT(*) INTO client_count FROM client WHERE user_id = user_id;
  SELECT COUNT(*) INTO profile_count FROM profiles WHERE id = user_id;

  -- Delete in proper order (reverse foreign key dependency)
  DELETE FROM coach WHERE user_id = user_id;
  DELETE FROM client WHERE user_id = user_id;
  DELETE FROM profiles WHERE id = user_id;
  DELETE FROM auth.users WHERE id = user_id;

  -- Return cleanup summary
  RETURN json_build_object(
    'success', true,
    'message', 'User successfully removed from all tables',
    'email', user_email,
    'user_id', user_id,
    'records_removed', json_build_object(
      'coach', coach_count,
      'client', client_count,
      'profiles', profile_count,
      'auth_users', 1
    )
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', 'Error during cleanup: ' || SQLERRM,
    'email', user_email
  );
END;
$$ LANGUAGE plpgsql;
```

### Test User Cleanup Script

For cleaning up test users created during development:

```sql
-- Clean up all test users (be careful with this!)
SELECT cleanup_user_by_email(email)
FROM auth.users
WHERE email LIKE '%test%'
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com';
```

## 🧪 Testing and Development

### Creating Test Users

```sql
-- Create a test user with full profile
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Get the created user ID
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'test@example.com'
)
INSERT INTO profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT id, 'test@example.com', 'Test', 'User', 'coach', NOW(), NOW()
FROM new_user;
```

### Test Data Verification

```sql
-- Verify test user creation
SELECT
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.first_name,
  p.last_name,
  p.role,
  CASE
    WHEN c.id IS NOT NULL THEN 'Has coach record'
    WHEN cl.id IS NOT NULL THEN 'Has client record'
    ELSE 'No role record'
  END as role_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN coach c ON p.id = c.user_id
LEFT JOIN client cl ON p.id = cl.user_id
WHERE u.email LIKE '%test%';
```

## 🔧 Troubleshooting

### Common Issues

#### Foreign Key Constraint Errors

**Problem:** Trying to delete from `profiles` before deleting from `coach`/`client`
**Solution:** Always follow the deletion order: `coach/client` → `profiles` → `auth.users`

#### User Not Found

**Problem:** User exists in `auth.users` but not in `profiles`
**Solution:** This is normal for users who haven't completed onboarding

#### Orphaned Records

**Problem:** Records in `profiles` without corresponding `auth.users` record
**Solution:**

```sql
-- Find orphaned profiles
SELECT p.* FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Clean up orphaned profiles
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);
```

### Diagnostic Queries

#### Check Database Integrity

```sql
-- Check for orphaned records
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
```

#### User Count Summary

```sql
-- Get user count summary
SELECT
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM coach) as total_coaches,
  (SELECT COUNT(*) FROM client) as total_clients;
```

## ✅ Best Practices

### Development

- Always use the automated cleanup function for consistency
- Create test users with recognizable email patterns (e.g., `test-*@example.com`)
- Clean up test data regularly to avoid database bloat
- Use transactions when performing manual multi-table operations

### Production

- Never delete users directly in production without proper backup
- Always verify user data before deletion
- Use soft deletes for important user data when possible
- Log all user deletion operations for audit purposes

### Security

- Limit access to user deletion functions to authorized personnel only
- Always verify the user email before deletion
- Consider implementing a "deleted_users" audit table for compliance

### Monitoring

- Regularly check for orphaned records
- Monitor user creation and deletion patterns
- Set up alerts for unusual deletion activity

## 📞 Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify your database schema matches the expected structure
3. Test with the diagnostic queries provided
4. Contact the development team with specific error messages and context

---

**Last Updated:** 2025-06-09  
**Version:** 1.0  
**Maintainer:** Health Coach AI Development Team
