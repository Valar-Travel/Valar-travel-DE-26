-- Add admin user for admin@valartravel.de
-- Password: ValarAdmin2024! (bcrypt hashed)

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@valartravel.de',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyDAXUB.Ux6Wxy',
  'Admin',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Verify the admin user was created
SELECT id, email, name, role, is_active FROM admin_users WHERE email = 'admin@valartravel.de';

-- The default password is: ValarAdmin2024!
-- IMPORTANT: Change this password after first login!
