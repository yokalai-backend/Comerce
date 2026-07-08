-- Up Migration
ALTER TABLE user_addresses
ADD CONSTRAINT user_id_street_addr_cons
UNIQUE(user_id, street_address);

-- Down Migration
ALTER TABLE user_addresses
DROP CONSTRAINT IF EXISTS user_id_street_addr_cons;