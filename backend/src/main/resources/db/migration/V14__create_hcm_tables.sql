CREATE TABLE leave_requests
(
    id             BIGSERIAL PRIMARY KEY,
    employee_id    BIGINT                   NOT NULL REFERENCES employees (id),
    leave_type     VARCHAR(30)              NOT NULL,
    from_date      DATE                     NOT NULL,
    to_date        DATE                     NOT NULL,
    days           NUMERIC(5, 1)            NOT NULL,
    reason         TEXT,
    status         VARCHAR(20)              NOT NULL DEFAULT 'PENDING',
    approved_by    BIGINT REFERENCES employees (id),
    approval_notes TEXT,
    deleted        BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_leave_dates CHECK (to_date >= from_date),
    CONSTRAINT chk_leave_days CHECK (days > 0)
);

CREATE INDEX idx_leave_employee ON leave_requests (employee_id);
CREATE INDEX idx_leave_status ON leave_requests (status) WHERE deleted = FALSE;
CREATE UNIQUE INDEX uk_leave_employee_range ON leave_requests (employee_id, from_date, to_date)
    WHERE status IN ('PENDING', 'APPROVED') AND deleted = FALSE;

CREATE TABLE attendance_records
(
    id           BIGSERIAL PRIMARY KEY,
    employee_id  BIGINT                   NOT NULL REFERENCES employees (id),
    work_date    DATE                     NOT NULL,
    check_in     TIME,
    check_out    TIME,
    status       VARCHAR(20)              NOT NULL DEFAULT 'PRESENT',
    notes        TEXT,
    deleted      BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_attendance_emp_date UNIQUE (employee_id, work_date),
    CONSTRAINT chk_attendance_times CHECK (check_out IS NULL OR check_in IS NULL OR check_out >= check_in)
);

CREATE INDEX idx_attendance_date ON attendance_records (work_date);
CREATE INDEX idx_attendance_employee ON attendance_records (employee_id);

CREATE TABLE payroll_runs
(
    id                BIGSERIAL PRIMARY KEY,
    period_month      INT                    NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year       INT                    NOT NULL CHECK (period_year >= 2000),
    status            VARCHAR(20)            NOT NULL DEFAULT 'DRAFT',
    total_gross       NUMERIC(14, 2)         NOT NULL DEFAULT 0,
    total_deductions  NUMERIC(14, 2)         NOT NULL DEFAULT 0,
    total_net         NUMERIC(14, 2)         NOT NULL DEFAULT 0,
    processed_by      BIGINT REFERENCES employees (id),
    notes             TEXT,
    deleted           BOOLEAN                NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_payroll_period UNIQUE (period_month, period_year)
);

CREATE TABLE payroll_items
(
    id             BIGSERIAL PRIMARY KEY,
    payroll_run_id BIGINT                   NOT NULL REFERENCES payroll_runs (id) ON DELETE CASCADE,
    employee_id    BIGINT                   NOT NULL REFERENCES employees (id),
    basic_salary   NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    allowances     NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    deductions     NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    tax            NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    net_pay        NUMERIC(14, 2)           NOT NULL DEFAULT 0,
    notes          TEXT,
    deleted        BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_updated   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_payroll_item UNIQUE (payroll_run_id, employee_id)
);

CREATE INDEX idx_payroll_items_run ON payroll_items (payroll_run_id);
CREATE INDEX idx_payroll_items_employee ON payroll_items (employee_id);
