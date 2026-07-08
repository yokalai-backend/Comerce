-- Up Migration
ALTER TABLE user_profiles ADD COLUMN
user_email VARCHAR(254) NOT NULL;

-- Down Migration
ALTER TABLE user_profiles DROP COLUMN IF EXISTS
user_email;