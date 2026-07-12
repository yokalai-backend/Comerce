-- Up Migration
ALTER TABLE revoked_tokens ADD COLUMN prev_jti UUID;
ALTER TABLE revoked_tokens ALTER COLUMN jti DROP NOT NULL;
-- Down Migration