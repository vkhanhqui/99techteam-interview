CREATE TABLE IF NOT EXISTS subscribers
(
    id varchar(36) NOT NULL,

    status varchar(50) NOT NULL,
    email varchar(256) NOT NULL,
    first_name varchar(256),
    last_name varchar(256),

    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,

    CONSTRAINT subscribers_pkey PRIMARY KEY (id),
    UNIQUE (email)
);