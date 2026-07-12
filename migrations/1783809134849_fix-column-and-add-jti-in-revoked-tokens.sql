-- Up Migration
ALTER TABLE devices ADD CONSTRAINT
fk_user_id FOREIGN KEY (user_id) REFERENCES
users(id) ON DELETE CASCADE;

ALTER TABLE devices ADD CONSTRAINT fk_device_user_tokens
FOREIGN KEY (user_id, device_id) REFERENCES refresh_tokens(user_id, device_id) 
ON DELETE CASCADE;

ALTER TABLE devices ADD CONSTRAINT unique_devices_per_user
UNIQUE(user_id, device_id);

ALTER TABLE revoked_tokens ADD COLUMN ip_addr TEXT NOT NULL;
ALTER TABLE revoked_tokens ADD COLUMN jti UUID NOT NULL;
ALTER TABLE revoked_tokens ALTER COLUMN revoke_reason TYPE TEXT;

ALTER TABLE refresh_tokens DROP COLUMN is_revoked;
DROP TYPE IF EXISTS token_revoke_reason;

CREATE TYPE token_revoke_reason AS ENUM ('refreshed', 'device_mismatch', 'reuse_attempt','logout', 'login');
ALTER TABLE revoked_tokens 
ALTER COLUMN revoke_reason TYPE token_revoke_reason 
USING (revoke_reason::text::token_revoke_reason);

-- Down Migration