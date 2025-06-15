# Supabase CLI Scripts

This directory contains ready-to-use SQL scripts for common Supabase operations in the Health Coach AI application.

## 📁 Available Scripts

### 🧹 User Management Scripts

#### `cleanup-user.sql`

**Purpose:** Safely remove a single user and all associated data  
**Usage:**

1. Open the script in your SQL editor
2. Replace `'USER_EMAIL_HERE'` with the actual email address
3. Run the verification query first to confirm the user exists
4. Uncomment and run either the automated or manual cleanup section
5. Run the verification queries to confirm deletion

**Features:**

- Step-by-step guided process
- Verification before and after deletion
- Both automated and manual cleanup options
- Proper deletion order to avoid foreign key errors

#### `bulk-cleanup.sql`

**Purpose:** Remove multiple test users based on email patterns  
**Usage:**

1. Run the preview queries first to see which users will be deleted
2. Review the count of users to be deleted
3. Uncomment the appropriate cleanup section (automated or manual)
4. Run verification queries to confirm cleanup

**⚠️ Warning:** This script can delete many users at once. Always preview first!

**Default Patterns Detected:**

- `%test%` - Test users
- `%playwright%` - Playwright test users
- `%example.com` - Example domain users
- `%staging%` - Staging environment users
- `%dev%` - Development users

### 📊 Monitoring Scripts

#### `database-health-check.sql`

**Purpose:** Comprehensive database health and integrity analysis  
**Usage:** Run the entire script to get a complete health report

**Report Sections:**

- **Database Overview** - Basic user counts and statistics
- **Registration Trends** - Recent signup activity (last 30 days)
- **Profile Completion Analysis** - User onboarding completion rates
- **Data Integrity Issues** - Orphaned records and inconsistencies
- **Recent Activity** - New users in the last 7 days
- **Test Data Detection** - Identifies test users in the database
- **Storage Analysis** - Record counts per table
- **Health Recommendations** - Overall database status

## 🚀 How to Use These Scripts

### Method 1: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the script content
4. Modify any placeholder values (like email addresses)
5. Execute the script

### Method 2: Local SQL Client

1. Connect to your Supabase database using your preferred SQL client
2. Open the script file
3. Modify placeholder values as needed
4. Execute the script

### Method 3: Command Line (psql)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run a script file
\i /path/to/script.sql

# Or copy-paste the script content directly
```

## 🔧 Script Customization

### Modifying Email Patterns

To change which users are considered "test users" in the bulk cleanup script, modify these patterns:

```sql
WHERE u.email LIKE '%test%'
   OR u.email LIKE '%playwright%'
   OR u.email LIKE '%example.com'
   OR u.email LIKE '%staging%'
   OR u.email LIKE '%dev%'
```

### Adding Custom Cleanup Logic

You can extend the cleanup scripts to handle additional tables or custom business logic:

```sql
-- Example: Add cleanup for a custom table
DELETE FROM custom_table WHERE user_id = 'USER_ID_HERE';
```

### Modifying Health Check Criteria

The health check script can be customized to check for specific business rules:

```sql
-- Example: Check for users without required profile fields
SELECT
  'Incomplete Profiles' as issue,
  COUNT(*) as count,
  'Profiles missing required fields' as description
FROM profiles
WHERE first_name IS NULL OR last_name IS NULL;
```

## ⚠️ Safety Guidelines

### Before Running Any Script:

1. **Backup your data** - Always have a recent backup
2. **Test on staging first** - Never run untested scripts on production
3. **Review the script** - Understand what each query does
4. **Check dependencies** - Ensure the cleanup function exists if using automated cleanup
5. **Verify results** - Always run verification queries after cleanup

### Production Considerations:

- Run scripts during low-traffic periods
- Monitor for any application errors after cleanup
- Keep logs of all cleanup operations
- Consider implementing soft deletes for important data

### Emergency Recovery:

If you accidentally delete important data:

1. Stop all application traffic immediately
2. Restore from your most recent backup
3. Review what went wrong
4. Implement additional safeguards

## 🔗 Related Documentation

- [Main Supabase Operations Guide](../README.md)
- [Quick Reference Guide](../QUICK_REFERENCE.md)
- [Database Schema Documentation](../README.md#database-schema-overview)

## 📞 Support

If you encounter issues with these scripts:

1. Check the main documentation for troubleshooting tips
2. Verify your database schema matches the expected structure
3. Test queries individually to isolate problems
4. Contact the development team with specific error messages

---

**Last Updated:** 2025-06-09  
**Maintainer:** Health Coach AI Development Team
