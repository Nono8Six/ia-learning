/*
  # RGPD Requests Management

  1. New Table
    - `rgpd_requests` - Stores GDPR related requests from users
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to profiles.id, nullable)
      - `user_name` (text)
      - `email` (text)
      - `request_type` (request_type enum)
      - `status` (request_status enum)
      - `message` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on the table
    - Admins can manage all requests
    - Users can view and insert their own requests
*/

-- Create enums for request type and status
CREATE TYPE rgpd_request_type AS ENUM ('access', 'deletion', 'rectification');
CREATE TYPE rgpd_request_status AS ENUM ('pending', 'processing', 'completed', 'rejected');

-- Create table
CREATE TABLE IF NOT EXISTS rgpd_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  request_type rgpd_request_type NOT NULL,
  status rgpd_request_status NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE rgpd_requests ENABLE ROW LEVEL SECURITY;

-- Policy: admins can manage everything
CREATE POLICY "Admins manage RGPD requests"
  ON rgpd_requests
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Policy: users can view their own requests
CREATE POLICY "Users view own RGPD requests"
  ON rgpd_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: users can create requests for themselves
CREATE POLICY "Users insert RGPD requests"
  ON rgpd_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

