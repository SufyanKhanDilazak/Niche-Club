-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table first (referenced by orders)
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  clerk_user_id VARCHAR(255),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address JSONB NOT NULL DEFAULT '{}',
  billing_address JSONB DEFAULT '{}',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update customer stats when orders change
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer stats based on their orders
    UPDATE customers 
    SET 
        total_orders = (
            SELECT COUNT(*) 
            FROM orders 
            WHERE customer_email = customers.email 
            AND payment_status = 'paid'
        ),
        total_spent = (
            SELECT COALESCE(SUM(total), 0) 
            FROM orders 
            WHERE customer_email = customers.email 
            AND payment_status = 'paid'
        )
    WHERE email = COALESCE(NEW.customer_email, OLD.customer_email);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger to update customer stats when orders change
CREATE TRIGGER update_customer_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- Insert some sample data for testing (optional)
INSERT INTO customers (email, name, phone) VALUES 
('test@example.com', 'Test Customer', '+1234567890'),
('demo@example.com', 'Demo User', '+0987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert sample orders for testing (optional)
INSERT INTO orders (
    order_number, 
    customer_email, 
    customer_name, 
    customer_phone,
    shipping_address,
    items,
    subtotal,
    tax,
    shipping,
    total,
    status,
    payment_status
) VALUES 
(
    'ORD-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'test@example.com',
    'Test Customer',
    '+1234567890',
    '{"address": "123 Test St", "city": "Test City", "state": "TS", "zip": "12345"}',
    '[{"id": "1", "name": "Test Product", "price": 29.99, "quantity": 2}]',
    59.98,
    4.80,
    10.00,
    74.78,
    'processing',
    'paid'
),
(
    'ORD-' || (EXTRACT(EPOCH FROM NOW())::bigint + 1),
    'demo@example.com',
    'Demo User',
    '+0987654321',
    '{"address": "456 Demo Ave", "city": "Demo City", "state": "DC", "zip": "67890"}',
    '[{"id": "2", "name": "Demo Product", "price": 49.99, "quantity": 1}]',
    49.99,
    4.00,
    0.00,
    53.99,
    'delivered',
    'paid'
)
ON CONFLICT (order_number) DO NOTHING;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (your dashboard will use service role)
CREATE POLICY "Service role can do everything on customers" ON customers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on orders" ON orders
    FOR ALL USING (true) WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON customers TO service_role;
GRANT ALL ON orders TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Customers table created with ' || COUNT(*) || ' records' as customers_status FROM customers;
SELECT 'Orders table created with ' || COUNT(*) || ' records' as orders_status FROM orders;
