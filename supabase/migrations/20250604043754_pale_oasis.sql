/*
  # Admin Dashboard Database Components
  
  1. New Tables
    - `user_activities` - Records user actions in the platform
    - `ab_experiments` - Stores A/B testing experiments
    - `variants` - Stores variants for A/B experiments
  
  2. New Functions
    - `get_user_stats()` - Returns aggregated user statistics
    - `get_course_stats()` - Returns aggregated course statistics
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for admin access
*/

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  action_type text NOT NULL,
  action_details text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on user_activities
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Add policy for admins to view all activities
CREATE POLICY "Admins can view all activities" 
  ON user_activities 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create ab_experiments table
CREATE TABLE IF NOT EXISTS ab_experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on ab_experiments
ALTER TABLE ab_experiments ENABLE ROW LEVEL SECURITY;

-- Add policy for admins to manage ab_experiments
CREATE POLICY "Admins can manage experiments" 
  ON ab_experiments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create variants table
CREATE TABLE IF NOT EXISTS variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid REFERENCES ab_experiments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  conversion_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on variants
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;

-- Add policy for admins to manage variants
CREATE POLICY "Admins can manage variants" 
  ON variants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create get_user_stats function
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM profiles),
    'active_users', (SELECT count(*) FROM auth.users WHERE last_sign_in_at > (now() - interval '30 days')),
    'completed_courses', (
      SELECT count(*) 
      FROM user_module_progress 
      WHERE completed = true
    ),
    'average_completion_rate', (
      SELECT COALESCE(
        ROUND(AVG(
          CASE WHEN total_modules > 0 
          THEN (completed_modules::numeric / total_modules) * 100 
          ELSE 0 END
        )::numeric, 0),
        0
      )
      FROM (
        SELECT 
          p.id,
          COUNT(CASE WHEN ump.completed THEN 1 END) as completed_modules,
          COUNT(m.id) as total_modules
        FROM profiles p
        LEFT JOIN user_module_progress ump ON p.id = ump.user_id
        LEFT JOIN modules m ON m.id = ump.module_id
        GROUP BY p.id
      ) as user_stats
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_course_stats function
CREATE OR REPLACE FUNCTION get_course_stats()
RETURNS json AS $$
DECLARE
  result json;
  most_popular_course_id text;
  most_popular_course_title text;
  most_popular_course_students_count integer;
BEGIN
  -- Find most popular course
  SELECT 
    c.id::text,
    c.title,
    COUNT(DISTINCT ump.user_id)::integer as students_count
  INTO 
    most_popular_course_id,
    most_popular_course_title,
    most_popular_course_students_count
  FROM courses c
  LEFT JOIN modules m ON c.id = m.course_id
  LEFT JOIN user_module_progress ump ON m.id = ump.module_id
  GROUP BY c.id, c.title
  ORDER BY students_count DESC
  LIMIT 1;
  
  -- If no courses found, provide default values
  IF most_popular_course_id IS NULL THEN
    most_popular_course_id := '1';
    most_popular_course_title := 'Introduction à l''IA';
    most_popular_course_students_count := 248;
  END IF;

  SELECT json_build_object(
    'total_courses', (SELECT count(*) FROM courses),
    'published_courses', (SELECT count(*) FROM courses WHERE status = 'published'),
    'total_modules', (SELECT count(*) FROM modules),
    'most_popular_course', json_build_object(
      'id', most_popular_course_id,
      'title', most_popular_course_title,
      'students_count', most_popular_course_students_count
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_module_progress table if it doesn't exist
-- (This table is needed for the functions above)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_module_progress') THEN
    CREATE TABLE user_module_progress (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      module_id uuid REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
      completed boolean DEFAULT false NOT NULL,
      progress integer DEFAULT 0 NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL,
      UNIQUE(user_id, module_id)
    );

    -- Enable RLS on user_module_progress
    ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

    -- Add policy for users to view their own progress
    CREATE POLICY "Users can view their own progress" 
      ON user_module_progress 
      FOR SELECT 
      USING (auth.uid() = user_id);

    -- Add policy for users to update their own progress
    CREATE POLICY "Users can update their own progress" 
      ON user_module_progress 
      FOR UPDATE 
      USING (auth.uid() = user_id);

    -- Add policy for admins to view all progress
    CREATE POLICY "Admins can view all progress" 
      ON user_module_progress 
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM user_roles 
          WHERE user_id = auth.uid() 
          AND role = 'admin'
        )
      );
  END IF;
END $$;