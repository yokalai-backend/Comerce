-- Up Migration
CREATE TABLE user_profiles (
user_id UUID PRIMARY KEY,
full_name VARCHAR(200),
avatar_url VARCHAR(255),
phone_number VARCHAR(20),
birth_date DATE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_addresses (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
label VARCHAR(50), 
street_address TEXT,
city VARCHAR(100),
country VARCHAR(150),
is_default BOOLEAN DEFAULT false
);

-- Down Migration
DROP TABLE user_profiles;
DROP TABLE user_addresses;