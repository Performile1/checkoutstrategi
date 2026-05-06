-- Setup Admin User
-- Run this in Supabase SQL Editor to create the admin user

-- First, check if the user exists
-- If not, you need to create the user through Supabase Auth Dashboard or API

-- After creating the user via Supabase Auth, run this to set the admin role:

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'rickard@wigrund.se';

-- Verify the admin role was set
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'rickard@wigrund.se';
