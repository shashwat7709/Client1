-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR ANTIQUE MARKETPLACE
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLE DEFINITIONS
-- =====================================================

-- Products table - Main product catalog
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    subject TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table - User submissions for selling antiques
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_title TEXT NOT NULL,
    description TEXT,
    asking_price DECIMAL(10,2) CHECK (asking_price >= 0),
    images JSONB DEFAULT '[]'::jsonb,
    contact_info JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Antique submissions table - Alternative submissions table
CREATE TABLE IF NOT EXISTS antique_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_title TEXT NOT NULL,
    description TEXT,
    asking_price DECIMAL(10,2) CHECK (asking_price >= 0),
    images JSONB DEFAULT '[]'::jsonb,
    contact_info JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User registrations table
CREATE TABLE IF NOT EXISTS user_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, product_id)
);

-- User offers table
CREATE TABLE IF NOT EXISTS user_offer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    offer_amount DECIMAL(10,2) NOT NULL CHECK (offer_amount >= 0),
    message TEXT,
    name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin offers table
CREATE TABLE IF NOT EXISTS admin_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    content TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_expires TIMESTAMP WITH TIME ZONE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Antique submissions indexes
CREATE INDEX IF NOT EXISTS idx_antique_submissions_status ON antique_submissions(status);
CREATE INDEX IF NOT EXISTS idx_antique_submissions_user_id ON antique_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_antique_submissions_created_at ON antique_submissions(created_at DESC);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- User offers indexes
CREATE INDEX IF NOT EXISTS idx_user_offer_product_id ON user_offer(product_id);
CREATE INDEX IF NOT EXISTS idx_user_offer_status ON user_offer(status);
CREATE INDEX IF NOT EXISTS idx_user_offer_created_at ON user_offer(created_at DESC);

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Admin offers indexes
CREATE INDEX IF NOT EXISTS idx_admin_offers_status ON admin_offers(status);
CREATE INDEX IF NOT EXISTS idx_admin_offers_created_at ON admin_offers(created_at DESC);

-- Newsletter subscribers indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_verified ON newsletter_subscribers(is_verified);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATED TIMESTAMPS
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_antique_submissions_updated_at 
    BEFORE UPDATE ON antique_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_offers_updated_at 
    BEFORE UPDATE ON admin_offers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Admin password verification function
CREATE OR REPLACE FUNCTION verify_admin_password(admin_email TEXT, plain_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = admin_email 
        AND is_active = TRUE
        AND password_hash = crypt(plain_password, password_hash)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cart total for a session
CREATE OR REPLACE FUNCTION get_cart_total(session_id_param TEXT)
RETURNS DECIMAL(10,2) AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(ci.quantity * p.price)
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.session_id = session_id_param
         AND p.status = 'active'), 
        0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired cart items (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_expired_cart_items()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cart_items 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product statistics
CREATE OR REPLACE FUNCTION get_product_stats()
RETURNS TABLE(
    total_products INTEGER,
    active_products INTEGER,
    sold_products INTEGER,
    total_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_products,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::INTEGER as active_products,
        COUNT(CASE WHEN status = 'sold' THEN 1 END)::INTEGER as sold_products,
        COALESCE(SUM(CASE WHEN status = 'active' THEN price ELSE 0 END), 0) as total_value
    FROM products;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE antique_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Public read access to active products
CREATE POLICY "Public read access to active products" ON products
    FOR SELECT USING (status = 'active');

-- Admin full access to products
CREATE POLICY "Admin full access to products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- SUBMISSIONS TABLE POLICIES
-- =====================================================

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions" ON submissions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions" ON submissions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own submissions
CREATE POLICY "Users can update own submissions" ON submissions
    FOR UPDATE USING (user_id = auth.uid());

-- Admin full access to submissions
CREATE POLICY "Admin full access to submissions" ON submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- ANTIQUE SUBMISSIONS TABLE POLICIES
-- =====================================================

-- Users can read their own submissions
CREATE POLICY "Users can read own antique submissions" ON antique_submissions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- Users can insert their own submissions
CREATE POLICY "Users can insert own antique submissions" ON antique_submissions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own submissions
CREATE POLICY "Users can update own antique submissions" ON antique_submissions
    FOR UPDATE USING (user_id = auth.uid());

-- Admin full access to antique submissions
CREATE POLICY "Admin full access to antique submissions" ON antique_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- USER REGISTRATIONS TABLE POLICIES
-- =====================================================

-- Users can read their own registrations
CREATE POLICY "Users can read own registrations" ON user_registrations
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- Users can insert their own registrations
CREATE POLICY "Users can insert own registrations" ON user_registrations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin full access to user registrations
CREATE POLICY "Admin full access to user registrations" ON user_registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- CART ITEMS TABLE POLICIES
-- =====================================================

-- Users can manage their own cart items
CREATE POLICY "Users can manage own cart items" ON cart_items
    FOR ALL USING (
        session_id = auth.jwt() ->> 'session_id' OR
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- USER OFFER TABLE POLICIES
-- =====================================================

-- Public read access to offers (for admin)
CREATE POLICY "Public read access to offers" ON user_offer
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- Public insert access to offers
CREATE POLICY "Public insert access to offers" ON user_offer
    FOR INSERT WITH CHECK (true);

-- Admin full access to offers
CREATE POLICY "Admin full access to offers" ON user_offer
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- CONTACT MESSAGES TABLE POLICIES
-- =====================================================

-- Public insert access to contact messages
CREATE POLICY "Public insert access to contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Admin read access to contact messages
CREATE POLICY "Admin read access to contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- Admin update access to contact messages
CREATE POLICY "Admin update access to contact messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- ADMIN OFFERS TABLE POLICIES
-- =====================================================

-- Public read access to active admin offers
CREATE POLICY "Public read access to active admin offers" ON admin_offers
    FOR SELECT USING (status = 'active');

-- Admin full access to admin offers
CREATE POLICY "Admin full access to admin offers" ON admin_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE POLICIES
-- =====================================================

-- Public insert access to newsletter subscribers
CREATE POLICY "Public insert access to newsletter subscribers" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Admin full access to newsletter subscribers
CREATE POLICY "Admin full access to newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
            AND is_active = TRUE
        )
    );

-- =====================================================
-- ADMIN USERS TABLE POLICIES
-- =====================================================

-- Admin users can read their own profile
CREATE POLICY "Admin users can read own profile" ON admin_users
    FOR SELECT USING (
        email = auth.jwt() ->> 'email'
    );

-- Admin users can update their own profile
CREATE POLICY "Admin users can update own profile" ON admin_users
    FOR UPDATE USING (
        email = auth.jwt() ->> 'email'
    );

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
    'admin@antiquemarket.com', 
    crypt('admin123', gen_salt('bf')), 
    'Admin User', 
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, category, subject) VALUES
('Antique Brass Wall Clock', 'Beautiful vintage brass wall clock with Roman numerals, fully functional.', 2500.00, 'Clocks', 'Vintage Timepiece'),
('Mughal Era Silver Coin', 'Rare silver coin from the Mughal period, excellent condition.', 15000.00, 'Coins', 'Historical Currency'),
('Colonial Era Tea Set', 'Complete porcelain tea set from British colonial period.', 8500.00, 'Porcelain', 'Colonial Heritage'),
('Ancient Wooden Chest', 'Hand-carved wooden chest with traditional motifs.', 12000.00, 'Furniture', 'Traditional Craftsmanship')
ON CONFLICT DO NOTHING;

-- Insert sample admin offers
INSERT INTO admin_offers (title, content, status) VALUES
('Heritage Festival Sale', 'Get 20% off on all antique furniture this weekend!', 'active'),
('New Arrivals Alert', 'Fresh collection of Mughal era artifacts just arrived.', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE products IS 'Main product catalog for antique items';
COMMENT ON TABLE submissions IS 'User submissions for selling antiques';
COMMENT ON TABLE antique_submissions IS 'Alternative submissions table for antique items';
COMMENT ON TABLE user_registrations IS 'User registration information';
COMMENT ON TABLE cart_items IS 'Shopping cart items per session';
COMMENT ON TABLE user_offer IS 'User offers on products';
COMMENT ON TABLE contact_messages IS 'Contact form submissions';
COMMENT ON TABLE admin_offers IS 'Promotional offers created by admins';
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription list';
COMMENT ON TABLE admin_users IS 'Admin user accounts';

COMMENT ON FUNCTION verify_admin_password IS 'Verifies admin login credentials';
COMMENT ON FUNCTION get_cart_total IS 'Calculates total cart value for a session';
COMMENT ON FUNCTION cleanup_expired_cart_items IS 'Removes cart items older than 7 days';
COMMENT ON FUNCTION get_product_stats IS 'Returns product statistics for dashboard'; 