-- Up Migration
ALTER TABLE refresh_tokens ALTER COLUMN expires_at SET DEFAULT 
NOW() + interval '7 days';

-- Down Migration
ALTER TABLE refresh_tokens ALTER COLUMN expires_at DROP DEFAULT;