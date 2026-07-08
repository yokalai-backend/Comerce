-- Up Migration
ALTER TABLE user_profiles ADD COLUMN 
birth_date_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Down Migration
ALTER TABLE user_profiles DROP TABLE IF EXISTS birth_date_updated_at;