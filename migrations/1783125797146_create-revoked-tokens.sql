-- Up Migration
CREATE TYPE token_revoke_reason AS ENUM (
  'rotated',
  'security_issues',
  'logout'
);

CREATE TABLE revoked_tokens (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
user_id TEXT NOT NULL, 
revoke_reason token_revoke_reason,
device_id TEXT NOT NULL, 
revoked_at TIMESTAMPTZ DEFAULT NOW());

-- Down Migration
DROP TABLE IF EXISTS revoked_tokens;
DROP TYPE IF EXISTS token_revoke_reason;