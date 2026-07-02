CREATE USER products_user WITH PASSWORD 'products_pass';
CREATE DATABASE products_db OWNER products_user;

CREATE USER auth_user WITH PASSWORD 'auth_pass';
CREATE DATABASE auth_db OWNER auth_user;