ALTER TABLE employees
    ADD COLUMN manager_id BIGINT REFERENCES employees (id);

CREATE INDEX idx_employees_manager ON employees (manager_id) WHERE manager_id IS NOT NULL;
