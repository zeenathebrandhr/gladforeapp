# Supabase Setup Instructions for Gladfore

## Step 1: Run SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-setup.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

This will create:
- All database tables (users, farmers, orders, payments)
- Indexes for performance
- Row-Level Security (RLS) policies
- Triggers for automatic user profile creation

## Step 2: Configure Authentication

### Enable Email Provider
1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email templates if needed

### Enable Phone Provider (for Farmers)
1. Go to **Authentication** > **Providers**
2. Enable **Phone** provider
3. You'll need to configure an SMS provider (Twilio, MessageBird, etc.)
4. Add your SMS provider credentials

**For MVP Testing:** You can use Supabase's test phone numbers or skip phone auth and use email for farmers temporarily.

## Step 3: Create Test Users

### Create Admin User
```sql
-- Run in Supabase SQL Editor
-- First, sign up via Supabase Auth UI or API with email: admin@gladfore.com
-- Then update the role:
UPDATE users 
SET role = 'admin', name = 'Admin User', agent_id = 'ADMIN001'
WHERE email = 'admin@gladfore.com';
```

### Create Agent User
```sql
-- Sign up via Supabase Auth UI or API with email: agent@gladfore.com
-- Then update the role:
UPDATE users 
SET role = 'agent', name = 'Agent User', agent_id = 'AGENT001'
WHERE email = 'agent@gladfore.com';
```

### Create Test Farmers
```sql
-- Insert test farmers directly
INSERT INTO farmers (name, phone, national_id) VALUES
('John Kamau', '+254700000001', '12345678'),
('Mary Wanjiku', '+254700000002', '87654321'),
('Peter Ochieng', '+254700000003', '11223344');
```

## Step 4: Verify RLS Policies

Test that Row-Level Security is working:

1. Log in as Admin → Should see all data
2. Log in as Agent → Should see farmers and orders
3. Log in as Farmer → Should only see own orders

## Step 5: Test the Application

### Login Credentials for Testing

**Admin:**
- Email: admin@gladfore.com
- Password: (set during signup)

**Agent:**
- Email: agent@gladfore.com
- Password: (set during signup)

**Farmer:**
- Phone: +254700000001 (or use email temporarily)

## Common Issues

### Issue: RLS prevents access
**Solution:** Check that the user's role is correctly set in the `users` table

### Issue: Phone auth not working
**Solution:** For MVP, you can temporarily allow farmers to log in with email instead of phone

### Issue: Cannot create orders
**Solution:** Make sure the agent has linked farmers first (set `agent_id` in farmers table)

## Database Schema Overview

```
users (extends auth.users)
├── id (UUID, FK to auth.users)
├── email
├── role ('admin' | 'agent' | 'farmer')
├── name
├── phone
└── agent_id

farmers
├── id (UUID)
├── name
├── phone (unique)
├── national_id (unique)
└── agent_id (FK to users)

orders
├── id (UUID)
├── farmer_id (FK to farmers)
├── agent_id (FK to users)
├── product_name
├── quantity, unit_price
├── total_cost, down_payment, remaining_balance
├── status ('pending' | 'approved' | 'rejected')
└── approved_at, approved_by

payments
├── id (UUID)
├── order_id (FK to orders)
├── amount
├── due_date, paid_date
└── status ('pending' | 'paid' | 'overdue')
```

## Next Steps

After completing Supabase setup:
1. Test user authentication (login/signup)
2. Test admin CSV upload
3. Test agent order creation
4. Test farmer order viewing
5. Verify RLS policies are enforcing correct access
