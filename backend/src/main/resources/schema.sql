DROP TABLE IF EXISTS users;

CREATE TABLE USERS (
    id BIGSERIAL NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    geboortedatum DATE NOT NULL,
    locatie TEXT NOT NULL,
    password TEXT NOT NULL,

    CONSTRAINT user_pkey PRIMARY KEY (id)
); 