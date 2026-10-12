-- 005_create_inventory_adjustments.sql
CREATE TYPE adjustment_type AS ENUM ('INCREASE', 'DECREASE');

CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    type adjustment_type NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_adjustments_product_id ON inventory_adjustments(product_id);
CREATE INDEX idx_adjustments_user_id ON inventory_adjustments(user_id);
