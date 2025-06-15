# Supabase Quick Reference

Quick commands for common Supabase operations in the Health Coach AI application.

## 🚀 Most Common Operations

### Delete a User (Recommended Method)

```sql
SELECT cleanup_user_by_email('user@example.com');
```

### Find a User

```sql
SELECT u.id, u.email, u.created_at, p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

### List All Users

```sql
SELECT u.email, p.first_name, p.last_name, p.role, u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### Clean Up Test Users

```sql
SELECT cleanup_user_by_email(email)
FROM auth.users
WHERE email LIKE '%test%'
   OR email LIKE '%playwright%'
   OR email LIKE '%example.com';
```

### Check Database Health

```sql
SELECT
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM coach) as coaches,
  (SELECT COUNT(*) FROM client) as clients;
```

## 🔧 Manual Cleanup (If Function Unavailable)

### Step-by-Step User Deletion

```sql
-- 1. Get user ID
SELECT id FROM auth.users WHERE email = 'user@example.com';

-- 2. Delete in order (replace USER_ID with actual ID)
DELETE FROM coach WHERE user_id = 'USER_ID';
DELETE FROM client WHERE user_id = 'USER_ID';
DELETE FROM profiles WHERE id = 'USER_ID';
DELETE FROM auth.users WHERE id = 'USER_ID';
```

## 🚨 Emergency Commands

### Find Orphaned Records

```sql
-- Orphaned profiles (no auth.users record)
SELECT COUNT(*) FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Orphaned coaches (no profiles record)
SELECT COUNT(*) FROM coach c
LEFT JOIN profiles p ON c.user_id = p.id
WHERE p.id IS NULL;
```

### Clean Up Orphaned Records

```sql
-- Remove orphaned profiles
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Remove orphaned coaches
DELETE FROM coach
WHERE user_id NOT IN (SELECT id FROM profiles);

-- Remove orphaned clients
DELETE FROM client
WHERE user_id NOT IN (SELECT id FROM profiles);
```

## 📊 Useful Queries

### User Activity Summary

```sql
SELECT
  DATE(u.created_at) as signup_date,
  COUNT(*) as new_users,
  COUNT(p.id) as completed_profiles,
  COUNT(c.id) as coaches,
  COUNT(cl.id) as clients
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN coach c ON p.id = c.user_id
LEFT JOIN client cl ON p.id = cl.user_id
GROUP BY DATE(u.created_at)
ORDER BY signup_date DESC;
```

### Recent Signups

```sql
SELECT u.email, u.created_at, p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '7 days'
ORDER BY u.created_at DESC;
```

### Users Without Profiles

```sql
SELECT u.email, u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
```

## ⚠️ Safety Reminders

- **Always backup before bulk operations**
- **Test queries on staging first**
- **Use the automated cleanup function when possible**
- **Follow the deletion order: coach/client → profiles → auth.users**
- **Verify email addresses before deletion**

## 🔗 Related Documentation

- [Full Supabase Operations Guide](./README.md)
- [Database Schema Documentation](./README.md#database-schema-overview)
- [Troubleshooting Guide](./README.md#troubleshooting)
