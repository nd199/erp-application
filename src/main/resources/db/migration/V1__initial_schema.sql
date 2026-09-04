CREATE TABLE user_profile
(
    id           BIGSERIAL PRIMARY KEY,
    user_name    VARCHAR(50)              NOT NULL,
    email        VARCHAR(254)             NOT NULL,
    password     VARCHAR(60)              NOT NULL,

    phone        VARCHAR(20)              NOT NULL,
    address      TEXT                     NOT NULL,

    status       VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',
    deleted      BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE UNIQUE INDEX uk_user_profile_username_active
    ON user_profile (user_name)
    WHERE deleted = FALSE;

CREATE UNIQUE INDEX uk_user_profile_email_active
    ON user_profile (email)
    WHERE deleted = FALSE;