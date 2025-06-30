-- =====================================================
-- ADDITIONAL SUPABASE FUNCTIONS AND UTILITIES
-- =====================================================

-- Function to search products with full-text search
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    images JSONB,
    subject TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.images,
        p.subject,
        p.status,
        p.created_at,
        ts_rank(
            to_tsvector('english', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.subject, '')),
            plainto_tsquery('english', search_term)
        ) as relevance
    FROM products p
    WHERE p.status = 'active'
    AND (
        to_tsvector('english', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.subject, '')) @@ plainto_tsquery('english', search_term)
        OR p.title ILIKE '%' || search_term || '%'
        OR p.description ILIKE '%' || search_term || '%'
        OR p.category ILIKE '%' || search_term || '%'
    )
    ORDER BY relevance DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get products by category with pagination
CREATE OR REPLACE FUNCTION get_products_by_category(
    category_param TEXT,
    page_size INTEGER DEFAULT 10,
    page_number INTEGER DEFAULT 1
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    images JSONB,
    subject TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.images,
        p.subject,
        p.status,
        p.created_at,
        COUNT(*) OVER() as total_count
    FROM products p
    WHERE p.status = 'active'
    AND (category_param IS NULL OR p.category = category_param)
    ORDER BY p.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(
    total_products INTEGER,
    active_products INTEGER,
    sold_products INTEGER,
    total_value DECIMAL(10,2),
    total_submissions INTEGER,
    pending_submissions INTEGER,
    total_offers INTEGER,
    pending_offers INTEGER,
    total_contacts INTEGER,
    unread_contacts INTEGER,
    total_subscribers INTEGER,
    verified_subscribers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM products)::INTEGER as total_products,
        (SELECT COUNT(*) FROM products WHERE status = 'active')::INTEGER as active_products,
        (SELECT COUNT(*) FROM products WHERE status = 'sold')::INTEGER as sold_products,
        COALESCE((SELECT SUM(price) FROM products WHERE status = 'active'), 0) as total_value,
        (SELECT COUNT(*) FROM submissions)::INTEGER as total_submissions,
        (SELECT COUNT(*) FROM submissions WHERE status = 'pending')::INTEGER as pending_submissions,
        (SELECT COUNT(*) FROM user_offer)::INTEGER as total_offers,
        (SELECT COUNT(*) FROM user_offer WHERE status = 'pending')::INTEGER as pending_offers,
        (SELECT COUNT(*) FROM contact_messages)::INTEGER as total_contacts,
        (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread')::INTEGER as unread_contacts,
        (SELECT COUNT(*) FROM newsletter_subscribers)::INTEGER as total_subscribers,
        (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_verified = TRUE)::INTEGER as verified_subscribers;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    activity_type TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    (SELECT 
        'product' as activity_type,
        title,
        description,
        created_at,
        status
    FROM products
    ORDER BY created_at DESC
    LIMIT limit_count)
    
    UNION ALL
    
    (SELECT 
        'submission' as activity_type,
        item_title as title,
        description,
        created_at,
        status
    FROM submissions
    ORDER BY created_at DESC
    LIMIT limit_count)
    
    UNION ALL
    
    (SELECT 
        'offer' as activity_type,
        'Offer on ' || p.title as title,
        uo.message as description,
        uo.created_at,
        uo.status
    FROM user_offer uo
    JOIN products p ON uo.product_id = p.id
    ORDER BY uo.created_at DESC
    LIMIT limit_count)
    
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_id_param UUID)
RETURNS TABLE(
    total_submissions INTEGER,
    approved_submissions INTEGER,
    total_offers INTEGER,
    accepted_offers INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM submissions WHERE user_id = user_id_param)::INTEGER as total_submissions,
        (SELECT COUNT(*) FROM submissions WHERE user_id = user_id_param AND status = 'approved')::INTEGER as approved_submissions,
        (SELECT COUNT(*) FROM user_offer WHERE email = (SELECT email FROM user_registrations WHERE user_id = user_id_param LIMIT 1))::INTEGER as total_offers,
        (SELECT COUNT(*) FROM user_offer WHERE email = (SELECT email FROM user_registrations WHERE user_id = user_id_param LIMIT 1) AND status = 'accepted')::INTEGER as accepted_offers,
        GREATEST(
            COALESCE((SELECT MAX(created_at) FROM submissions WHERE user_id = user_id_param), '1970-01-01'::timestamp),
            COALESCE((SELECT MAX(created_at) FROM user_registrations WHERE user_id = user_id_param), '1970-01-01'::timestamp)
        ) as last_activity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate monthly report
CREATE OR REPLACE FUNCTION generate_monthly_report(report_month INTEGER, report_year INTEGER)
RETURNS TABLE(
    month_name TEXT,
    total_products_added INTEGER,
    total_products_sold INTEGER,
    total_revenue DECIMAL(10,2),
    total_submissions INTEGER,
    approved_submissions INTEGER,
    total_offers INTEGER,
    accepted_offers INTEGER,
    total_contacts INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE(report_year || '-' || report_month || '-01'), 'Month YYYY') as month_name,
        (SELECT COUNT(*) FROM products 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year)::INTEGER as total_products_added,
        (SELECT COUNT(*) FROM products 
         WHERE EXTRACT(MONTH FROM updated_at) = report_month 
         AND EXTRACT(YEAR FROM updated_at) = report_year 
         AND status = 'sold')::INTEGER as total_products_sold,
        COALESCE((SELECT SUM(price) FROM products 
                  WHERE EXTRACT(MONTH FROM updated_at) = report_month 
                  AND EXTRACT(YEAR FROM updated_at) = report_year 
                  AND status = 'sold'), 0) as total_revenue,
        (SELECT COUNT(*) FROM submissions 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year)::INTEGER as total_submissions,
        (SELECT COUNT(*) FROM submissions 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year 
         AND status = 'approved')::INTEGER as approved_submissions,
        (SELECT COUNT(*) FROM user_offer 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year)::INTEGER as total_offers,
        (SELECT COUNT(*) FROM user_offer 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year 
         AND status = 'accepted')::INTEGER as accepted_offers,
        (SELECT COUNT(*) FROM contact_messages 
         WHERE EXTRACT(MONTH FROM created_at) = report_month 
         AND EXTRACT(YEAR FROM created_at) = report_year)::INTEGER as total_contacts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to backup important data
CREATE OR REPLACE FUNCTION backup_important_data()
RETURNS TABLE(
    table_name TEXT,
    record_count BIGINT,
    backup_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'products' as table_name,
        (SELECT COUNT(*) FROM products) as record_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'submissions' as table_name,
        (SELECT COUNT(*) FROM submissions) as record_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'user_offer' as table_name,
        (SELECT COUNT(*) FROM user_offer) as record_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'contact_messages' as table_name,
        (SELECT COUNT(*) FROM contact_messages) as record_count,
        NOW() as backup_timestamp
    UNION ALL
    SELECT 
        'newsletter_subscribers' as table_name,
        (SELECT COUNT(*) FROM newsletter_subscribers) as record_count,
        NOW() as backup_timestamp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate phone number format (Indian format)
CREATE OR REPLACE FUNCTION is_valid_indian_phone(phone_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Remove all non-digit characters
    phone_number := regexp_replace(phone_number, '[^0-9]', '', 'g');
    
    -- Check if it's a valid Indian phone number (10 digits starting with 6-9)
    RETURN phone_number ~ '^[6-9][0-9]{9}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to format price in Indian currency
CREATE OR REPLACE FUNCTION format_indian_price(amount DECIMAL)
RETURNS TEXT AS $$
BEGIN
    RETURN '₹' || TO_CHAR(amount, 'FM999,999,999.00');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get product recommendations based on category
CREATE OR REPLACE FUNCTION get_product_recommendations(product_id_param UUID, limit_count INTEGER DEFAULT 4)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    images JSONB,
    subject TEXT,
    similarity_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.images,
        p.subject,
        CASE 
            WHEN p.category = (SELECT category FROM products WHERE id = product_id_param) THEN 1.0
            ELSE 0.5
        END as similarity_score
    FROM products p
    WHERE p.id != product_id_param
    AND p.status = 'active'
    ORDER BY similarity_score DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track user engagement
CREATE OR REPLACE FUNCTION track_user_engagement(
    user_id_param UUID,
    action_type TEXT,
    target_id UUID DEFAULT NULL,
    metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    engagement_id UUID;
BEGIN
    -- Create engagement tracking table if it doesn't exist
    CREATE TABLE IF NOT EXISTS user_engagement (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL,
        target_id UUID,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Insert engagement record
    INSERT INTO user_engagement (user_id, action_type, target_id, metadata)
    VALUES (user_id_param, action_type, target_id, metadata)
    RETURNING id INTO engagement_id;
    
    RETURN engagement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for functions
COMMENT ON FUNCTION search_products IS 'Search products using full-text search with relevance scoring';
COMMENT ON FUNCTION get_products_by_category IS 'Get products by category with pagination support';
COMMENT ON FUNCTION get_dashboard_stats IS 'Get comprehensive dashboard statistics';
COMMENT ON FUNCTION get_recent_activity IS 'Get recent activity across all tables';
COMMENT ON FUNCTION get_user_activity_summary IS 'Get summary of user activity';
COMMENT ON FUNCTION generate_monthly_report IS 'Generate monthly business report';
COMMENT ON FUNCTION backup_important_data IS 'Backup important data counts';
COMMENT ON FUNCTION is_valid_email IS 'Validate email format';
COMMENT ON FUNCTION is_valid_indian_phone IS 'Validate Indian phone number format';
COMMENT ON FUNCTION format_indian_price IS 'Format price in Indian currency';
COMMENT ON FUNCTION get_product_recommendations IS 'Get product recommendations based on category';
COMMENT ON FUNCTION track_user_engagement IS 'Track user engagement actions'; 