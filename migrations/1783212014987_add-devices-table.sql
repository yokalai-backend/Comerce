-- Up Migration
CREATE TABLE devices (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID NOT NULL, 
    agent TEXT NOT NULL,
    ip_addr TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Down Migration
DROP TABLE IF EXISTS devices;