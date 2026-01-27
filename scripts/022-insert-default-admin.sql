-- Insert default super admin user
-- Password: ValarAdmin2024! (bcrypt hashed)
-- You can generate new hashes at: https://bcrypt-generator.com/

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'hello@valartravel.de',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyDAXUB.Ux6Wxy',
  'Sarah Kuhmichel',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- The default password is: ValarAdmin2024!
-- IMPORTANT: Change this password after first login!
