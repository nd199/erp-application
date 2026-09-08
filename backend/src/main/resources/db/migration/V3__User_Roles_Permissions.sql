CREATE TABLE user_roles
(
    user_profile_id BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,

    PRIMARY KEY (user_profile_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_profile_id)
            REFERENCES user_profile (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
            REFERENCES roles (id)
            ON DELETE CASCADE
);

CREATE TABLE role_permissions
(
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
            REFERENCES roles (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
            REFERENCES permissions (id)
            ON DELETE CASCADE
);