CREATE TABLE employees (
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    email           VARCHAR(254) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    hire_date       DATE NOT NULL,
    job_title       VARCHAR(100) NOT NULL,
    department_id   BIGINT NOT NULL REFERENCES departments(id),
    user_profile_id BIGINT UNIQUE REFERENCES user_profile(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    deleted         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_emp_email UNIQUE (email)
);

CREATE INDEX idx_employee_deleted ON employees(deleted) WHERE deleted = FALSE;
