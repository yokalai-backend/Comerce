-- Up Migration
CREATE TYPE token_revoke_reason AS ENUM (
  'rotated',
  'security_issues',
  'logout'
);

ALTER TABLE refresh_tokens
ADD COLUMN revoked_at TIMESTAMPTZ,
ADD COLUMN revoke_reason token_revoke_reason;
-- Down Migration
ALTER TABLE refresh_tokens
DROP COLUMN IF EXISTS revoked_at,
DROP COLUMN IF EXISTS revoke_reason;

DROP TYPE IF EXISTS token_revoke_reason;