-- Up Migration
ALTER TABLE devices DROP CONSTRAINT
fk_device_user_tokens;

-- Down Migration