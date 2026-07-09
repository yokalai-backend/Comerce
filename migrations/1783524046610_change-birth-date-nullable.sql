-- Up Migration
ALTER TABLE user_profiles ALTER COLUMN
birth_date_updated_at SET DEFAULT NULL;

-- Down Migration
ALTER TABLE user_profiles DROP COLUMN IF EXISTS
birth_date_updated_at;