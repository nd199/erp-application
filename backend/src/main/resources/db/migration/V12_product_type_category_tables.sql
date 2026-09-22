CREATE TABLE product_category
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT         NOT NULL,
    active       BOOLEAN                  DEFAULT TRUE,
    version      BIGINT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT uk_products_category_name UNIQUE (name)
);

CREATE TABLE product_type
(
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT         NOT NULL,
    active       BOOLEAN                  DEFAULT TRUE,
    version      BIGINT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT uk_products_type_name UNIQUE (name)
);

ALTER TABLE products
    ADD COLUMN products_category_id BIGINT;

ALTER TABLE products
    ADD COLUMN products_type_id BIGINT;

ALTER TABLE products
    ADD CONSTRAINT fk_products_category
        FOREIGN KEY (products_category_id) REFERENCES product_category (id);

ALTER TABLE products
    ADD CONSTRAINT fk_products_type
        FOREIGN KEY (products_type_id) REFERENCES product_type (id);