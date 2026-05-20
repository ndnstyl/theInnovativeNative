-- ============================================================================
-- 028 SEARCH — Full-text search indexes and functions
-- ============================================================================

-- Ensure search vectors exist on key tables
-- profiles.search_vector already exists from unified schema
-- posts already have search_vector from community feed

-- Create FTS index on posts if not exists
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING gin(search_vector);

-- Create FTS index on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(search_vector);

-- Unified search function: searches posts, members, courses, events
CREATE OR REPLACE FUNCTION global_search(
  p_query text,
  p_type text DEFAULT 'all',
  p_limit integer DEFAULT 20
)
RETURNS TABLE(
  result_type text,
  result_id text,
  title text,
  snippet text,
  url text,
  rank real
)
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
DECLARE
  v_tsquery tsquery;
BEGIN
  v_tsquery := plainto_tsquery('english', p_query);

  IF p_type = 'all' OR p_type = 'post' THEN
    RETURN QUERY
    SELECT 'post'::text,
           p.id::text,
           COALESCE(p.title, left(p.body, 60))::text,
           ts_headline('english', p.body, v_tsquery, 'MaxWords=30, MinWords=10')::text,
           ('/community/posts/' || p.id)::text,
           ts_rank(p.search_vector, v_tsquery)
    FROM posts p
    WHERE p.search_vector @@ v_tsquery
      AND p.deleted_at IS NULL
    ORDER BY ts_rank(p.search_vector, v_tsquery) DESC
    LIMIT p_limit;
  END IF;

  IF p_type = 'all' OR p_type = 'member' THEN
    RETURN QUERY
    SELECT 'member'::text,
           pr.id::text,
           pr.display_name::text,
           COALESCE(pr.bio, '')::text,
           ('/members/' || COALESCE(pr.username, pr.id))::text,
           ts_rank(pr.search_vector, v_tsquery)
    FROM profiles pr
    WHERE pr.search_vector @@ v_tsquery
    ORDER BY ts_rank(pr.search_vector, v_tsquery) DESC
    LIMIT p_limit;
  END IF;

  IF p_type = 'all' OR p_type = 'course' THEN
    RETURN QUERY
    SELECT 'course'::text,
           c.id::text,
           c.title::text,
           COALESCE(c.description, '')::text,
           ('/classroom/' || c.id)::text,
           1.0::real
    FROM courses c
    WHERE c.published = true
      AND (c.title ILIKE '%' || p_query || '%' OR c.description ILIKE '%' || p_query || '%')
    LIMIT p_limit;
  END IF;

  IF p_type = 'all' OR p_type = 'event' THEN
    RETURN QUERY
    SELECT 'event'::text,
           e.id::text,
           e.title::text,
           COALESCE(e.description, '')::text,
           ('/community/calendar/' || e.id)::text,
           1.0::real
    FROM events e
    WHERE e.deleted_at IS NULL
      AND e.status != 'cancelled'
      AND (e.title ILIKE '%' || p_query || '%' OR e.description ILIKE '%' || p_query || '%')
    LIMIT p_limit;
  END IF;
END;
$$;

-- ============================================================================
-- MIGRATION COMPLETE
-- Indexes: posts FTS, profiles FTS
-- Functions: global_search (multi-entity full-text search)
-- ============================================================================
