CREATE TABLE leave_balances
(
    id             BIGSERIAL PRIMARY KEY,
    employee_id    BIGINT                   NOT NULL REFERENCES employees (id),
    leave_year     INT                      NOT NULL CHECK (leave_year >= 2000),
    leave_type     VARCHAR(30)              NOT NULL,
    total_entitled NUMERIC(5, 1)            NOT NULL DEFAULT 0 CHECK (total_entitled >= 0),
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_leave_balance UNIQUE (employee_id, leave_year, leave_type)
);

CREATE INDEX idx_leave_balance_emp_year ON leave_balances (employee_id, leave_year);
