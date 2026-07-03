-- Up Migration
CREATE TYPE user_role AS ENUM('user', 'admin');

CREATE TABLE users (
id UUID PRIMARY KEY default gen_random_uuid(),
username VARCHAR(250) NOT NULL,
role user_role NOT NULL DEFAULT user, 
email VARCHAR(250) UNIQUE NOT NULL,
hash TEXT NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Down Migration
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS user_role;

DROP INDEX IF EXISTS idx_users_email;
