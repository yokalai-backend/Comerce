-- Up Migration
CREATE TABLE products (
id UUID PRIMARY KEY default gen_random_uuid(), 
title VARCHAR(255) NOT NULL, 
price NUMERIC(12, 2) NOT NULL, 
stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0), 
rate NUMERIC(3, 2) DEFAULT 0 CHECK (rate >= 0 AND rate <= 5), 
is_sold BOOLEAN GENERATED ALWAYS AS (stock <= 0) STORED,
created_at TIMESTAMPTZ DEFAULT NOW(), 
updated_at TIMESTAMPTZ DEFAULT NOW());

-- Down Migration
DROP TABLE products;