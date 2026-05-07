-- Setup Admin User
-- Run this in Supabase SQL Editor to update the admin user email

-- Update the admin user email
UPDATE auth.users
SET email = 'rickard@wigrund.se',
    raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'din@email.se';

-- Verify the admin role was set
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'rickard@wigrund.se';
