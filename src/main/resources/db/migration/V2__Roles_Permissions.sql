CREATE TABLE roles
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    description TEXT,

    CONSTRAINT uk_roles_name UNIQUE (name)
);

CREATE TABLE permissions
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    description TEXT,

    CONSTRAINT uk_permissions_name UNIQUE (name)
);