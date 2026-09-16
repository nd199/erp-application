CREATE TABLE products
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100)             NOT NULL,
    sku          VARCHAR(50)              NOT NULL UNIQUE,
    description  TEXT                     NOT NULL,
    price        NUMERIC(12, 2)           NOT NULL DEFAULT 0,
    quantity     INTEGER                  NOT NULL DEFAULT 0,
    active       BOOLEAN                  NOT NULL DEFAULT TRUE,
    image_url    TEXT,
    version      BIGINT                   NOT NULL DEFAULT 0,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_products_sku UNIQUE (sku)
);