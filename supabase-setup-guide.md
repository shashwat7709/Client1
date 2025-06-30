# Supabase Database Setup Guide for Antique Marketplace

## Overview
This guide provides step-by-step instructions to set up the complete Supabase database for your antique marketplace application.

## Prerequisites
- Supabase account and project
- Access to Supabase SQL Editor
- Environment variables configured

## Step 1: Environment Variables Setup

Add these environment variables to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Database Schema Setup

### Option A: Complete Setup (Recommended)
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the entire content of `supabase-migrations.sql`
4. Click "Run" to execute all commands

### Option B: Incremental Setup
If you prefer to set up tables one by one, use the individual sections from `supabase-schema.sql`.

## Step 3: Additional Functions Setup

After the main schema is set up, run the additional functions:

1. Copy and paste the content of `supabase-functions.sql`
2. Execute in the SQL Editor

## Step 4: Verify Setup

Run these queries to verify your setup:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check if policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Step 5: Test Admin Login

1. The default admin credentials are:
   - Email: `admin@antiquemarket.com`
   - Password: `admin123`

2. Test the login function:
```sql
SELECT verify_admin_password('admin@antiquemarket.com', 'admin123');
```

## Step 6: Sample Data Verification

Check if sample data was inserted:

```sql
-- Check products
SELECT COUNT(*) FROM products;

-- Check admin offers
SELECT COUNT(*) FROM admin_offers;

-- Check admin users
SELECT COUNT(*) FROM admin_users;
```

## Database Structure Summary

### Tables Created:
1. **products** - Main product catalog
2. **submissions** - User submissions for selling
3. **antique_submissions** - Alternative submissions table
4. **user_registrations** - User registration data
5. **cart_items** - Shopping cart functionality
6. **user_offer** - User offers on products
7. **contact_messages** - Contact form submissions
8. **admin_offers** - Admin-created promotions
9. **newsletter_subscribers** - Newsletter subscriptions
10. **admin_users** - Admin user accounts

### Functions Created:
1. **verify_admin_password** - Admin authentication
2. **get_cart_total** - Calculate cart total
3. **cleanup_expired_cart_items** - Clean up old cart items
4. **get_product_stats** - Product statistics
5. **search_products** - Full-text product search
6. **get_products_by_category** - Category-based product listing
7. **get_dashboard_stats** - Dashboard statistics
8. **get_recent_activity** - Recent activity feed
9. **get_user_activity_summary** - User activity summary
10. **generate_monthly_report** - Monthly business reports
11. **backup_important_data** - Data backup utility
12. **is_valid_email** - Email validation
13. **is_valid_indian_phone** - Indian phone validation
14. **format_indian_price** - Price formatting
15. **get_product_recommendations** - Product recommendations
16. **track_user_engagement** - User engagement tracking

### RLS Policies:
- **Public read access** to active products
- **Admin full access** to all tables
- **User-specific access** to their own data
- **Session-based access** for cart items
- **Public insert access** for contact forms and offers

## Security Features

### Row Level Security (RLS):
- All tables have RLS enabled
- Policies ensure data isolation
- Admin users have full access
- Regular users can only access their own data

### Data Validation:
- Check constraints on prices (non-negative)
- Status validation for all status fields
- Email format validation
- Phone number validation (Indian format)

### Authentication:
- Admin authentication via custom function
- Anonymous user support for registrations
- Session-based cart management

## Performance Optimizations

### Indexes:
- Category-based indexes for products
- Status-based indexes for filtering
- Timestamp indexes for sorting
- Foreign key indexes for joins

### Functions:
- Optimized queries with proper joins
- Pagination support for large datasets
- Full-text search capabilities
- Efficient statistics calculation

## Maintenance Tasks

### Regular Cleanup:
```sql
-- Clean up expired cart items (run weekly)
SELECT cleanup_expired_cart_items();

-- Backup important data (run daily)
SELECT * FROM backup_important_data();
```

### Monitoring Queries:
```sql
-- Check database health
SELECT * FROM get_dashboard_stats();

-- Monitor recent activity
SELECT * FROM get_recent_activity(20);
```

## Troubleshooting

### Common Issues:

1. **RLS Policy Errors**
   - Ensure policies are created correctly
   - Check user authentication status
   - Verify admin user exists

2. **Function Errors**
   - Check if extensions are enabled
   - Verify function parameters
   - Ensure proper permissions

3. **Performance Issues**
   - Check if indexes are created
   - Monitor query execution plans
   - Optimize slow queries

### Debug Queries:
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check function permissions
SELECT routine_name, routine_type, security_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check table constraints
SELECT table_name, constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_schema = 'public';
```

## Next Steps

1. **Test the Application**: Ensure all features work with the new database
2. **Monitor Performance**: Watch for any performance issues
3. **Backup Strategy**: Set up regular backups
4. **Security Review**: Review and adjust RLS policies as needed
5. **Scale Planning**: Plan for future growth and scaling

## Support

If you encounter any issues:
1. Check the Supabase logs
2. Verify all SQL commands executed successfully
3. Test individual functions and policies
4. Review the troubleshooting section above

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security) 