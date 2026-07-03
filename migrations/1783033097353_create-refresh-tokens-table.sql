-- Up Migration
CREATE TABLE refresh_tokens (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
jti UUID NOT NULL UNIQUE,
device_id UUID NOT NULL,
is_revoked BOOLEAN DEFAULT FALSE,
expires_at TIMESTAMPTZ NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (user_id, device_id)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Down Migration
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;
DROP TABLE IF EXISTS refresh_tokens;