-- Enable leaked password protection and other auth security features
-- This addresses the "Leaked Password Protection Disabled" warning

-- Enable password breach protection
UPDATE auth.config 
SET password_breach_protection_enabled = true
WHERE id = 'default';

-- Set secure password requirements
UPDATE auth.config 
SET password_min_length = 8,
    password_require_uppercase = true,
    password_require_lowercase = true,
    password_require_numbers = true,
    password_require_symbols = false
WHERE id = 'default';

-- Enable additional security features
UPDATE auth.config 
SET 
  session_timeout_hours = 24,
  refresh_token_rotation_enabled = true,
  security_update_password_require_reauthentication = true
WHERE id = 'default';

-- Create audit log for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admin only access to audit logs" ON public.security_audit_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.membership_tier = 'admin'
    )
  );
