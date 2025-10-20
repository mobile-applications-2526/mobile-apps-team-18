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

CREATE TABLE TASKS (
    id BIGSERIAL NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    task_type TEXT NOT NULL,
    kot_address TEXT NOT NULL,
    "date" DATE NOT NULL,
    assigned_user_id BIGINT NOT NULL,
    created_by_id BIGINT NOT NULL,

    CONSTRAINT task_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user2 FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE EVENTS (
    id BIGSERIAL NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    kot_address TEXT NOT NULL,
    "date" DATE NOT NULL,
    location TEXT NOT NULL,
    organizer_id BIGINT NOT NULL,

    CONSTRAINT event_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user3 FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE DORMS (
    id BIGSERIAL NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL
)