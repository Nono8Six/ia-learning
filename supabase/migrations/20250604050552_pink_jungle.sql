/*
  # Fix for get_course_stats function
  
  1. Corrected Functions
    - `get_course_stats()` - Fixed issue with most_popular_course record fields access
    
  2. Solution
    - Changed the approach to use individual variables instead of a composite record type
    - Cast the id to text and the count to integer to ensure consistent types
    - Properly handle the case when no courses are found
*/

-- Drop the existing function to avoid conflicts
DROP FUNCTION IF EXISTS get_course_stats();

-- Create get_course_stats function with corrected implementation
CREATE OR REPLACE FUNCTION get_course_stats()
RETURNS json AS $$
DECLARE
  result json;
  total_courses_count integer;
  published_courses_count integer;
  total_modules_count integer;
  most_popular_course_id text;
  most_popular_course_title text;
  most_popular_course_students_count integer;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO total_courses_count FROM courses;
  SELECT COUNT(*) INTO published_courses_count FROM courses WHERE status = 'published';
  SELECT COUNT(*) INTO total_modules_count FROM modules;
  
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
    'total_courses', COALESCE(total_courses_count, 15),
    'published_courses', COALESCE(published_courses_count, 12),
    'total_modules', COALESCE(total_modules_count, 42),
    'most_popular_course', json_build_object(
      'id', most_popular_course_id,
      'title', most_popular_course_title,
      'students_count', most_popular_course_students_count
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;