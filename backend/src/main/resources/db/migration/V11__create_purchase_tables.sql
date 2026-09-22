CREATE TABLE supplier
(
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(150)             NOT NULL,
    contact_person VARCHAR(100),
    email          VARCHAR(254),
    phone          VARCHAR(20),
    address        TEXT,
    gst_number     VARCHAR(20),
    active         BOOLEAN                  NOT NULL DEFAULT TRUE,
    version        BIGINT                   NOT NULL DEFAULT 0,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_supplier_name UNIQUE (name)
);

CREATE TABLE purchase_order
(
    id           BIGSERIAL PRIMARY KEY,
    supplier_id  BIGINT                   NOT NULL REFERENCES supplier (id),
    user_id      BIGINT                   NOT NULL REFERENCES user_profile (id),
    order_date   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status       VARCHAR(20)              NOT NULL DEFAULT 'PENDING',
    total_amount NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    notes        TEXT,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    version      BIGINT                   NOT NULL DEFAULT 0
);

CREATE TABLE purchase_order_item
(
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT         NOT NULL REFERENCES purchase_order (id),
    product_id BIGINT         NOT NULL REFERENCES products (id),
    quantity   INTEGER        NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(14, 2) NOT NULL,
    CONSTRAINT uk_purchase_order_item_order_id_product_id UNIQUE (order_id, product_id)
);
