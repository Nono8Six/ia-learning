/*
  # Fix ambiguous column reference in is_admin function
  
  1. Updates
    - Fix the is_admin function to properly qualify the user_id column reference
    - Prevents the "column reference 'user_id' is ambiguous" error
  
  2. Changes
    - Modified the WHERE clause to explicitly reference user_roles.user_id instead of just user_id
*/

-- Drop and recreate the is_admin function with proper column qualification
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;