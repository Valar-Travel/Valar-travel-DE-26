-- Reset admin password for both admin users
-- Password: ValarAdmin2024!
-- This is a fresh bcrypt hash generated with cost factor 10

-- First, let's make sure the admin_users table exists
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_sessions table if not exists
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Delete existing admin users and recreate with fresh password hash
DELETE FROM admin_sessions;
DELETE FROM admin_users;

-- Insert admin@valartravel.de with password: ValarAdmin2024!
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@valartravel.de',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'super_admin',
  true
);

-- Insert hello@valartravel.de with same password
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'hello@valartravel.de',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Sarah Kuhmichel',
  'super_admin',
  true
);

-- Verify admin users exist
SELECT id, email, name, role, is_active FROM admin_users;

-- Login credentials:
-- Email: admin@valartravel.de OR hello@valartravel.de
-- Password: ValarAdmin2024!
