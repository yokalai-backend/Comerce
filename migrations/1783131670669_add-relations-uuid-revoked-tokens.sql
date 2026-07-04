-- Up Migration
ALTER TABLE revoked_tokens ALTER COLUMN user_id
TYPE UUID USING(user_id::UUID);

ALTER TABLE revoked_tokens ADD CONSTRAINT fk_to_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- Down Migration
ALTER TABLE revoked_tokens DROP CONSTRAINT IF EXISTS
fk_to_user_id;

ALTER TABLE revoked_tokens ALTER COLUMN user_id
TYPE TEXT;

