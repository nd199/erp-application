# ERP Backend

A modular, scalable ERP backend service inspired by SAP's enterprise architecture. Built with Spring Boot 4.1, Java 21, and PostgreSQL.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Java 21 (LTS) |
| Framework | Spring Boot 4.1.0 |
| Database | PostgreSQL 17 |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway |
| Build | Maven |
| Container | Docker Compose |
| Testing | JUnit 5, H2, Mockito |

## Project Structure

```
src/main/java/com/naren/erpbackend/
├── config/                  # Security & bean configuration
├── common/exception/        # Global exception handling (RFC 7807)
├── user/                    # User, Role, Permission management
│   ├── entity/
│   ├── repository/
│   ├── dto/
│   ├── service/
│   ├── controller/
│   └── bootstrap/           # Seed data (roles, permissions)
└── employee/                # Employee & Department management
    ├── entity/
    ├── repository/
    ├── dto/
    ├── service/
    └── controller/
```

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- Docker & Docker Compose

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL 17 on `localhost:5432` with:

| Variable | Value |
|----------|-------|
| Database | `erp_db` |
| Username | `erp_user` |
| Password | `erp_password` |

### 2. Run the application

```bash
mvn spring-boot:run
```

The app starts on `http://localhost:8080`. Flyway runs migrations automatically on startup. Roles and permissions are seeded via `SystemAuthorizationSeeder`.

### 3. Run tests

```bash
mvn test
```

Tests use H2 in-memory database (PostgreSQL compatibility mode). No external dependencies required.

## Configuration

### Profiles

| Profile | Description |
|---------|-------------|
| `dev` (default) | Local PostgreSQL, SQL logging enabled |
| `prod` | All settings from environment variables |
| `test` | H2 in-memory, Flyway disabled |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/erp_db` | Database JDBC URL |
| `DB_USERNAME` | `erp_user` | Database username |
| `DB_PASSWORD` | `erp_password` | Database password |
| `BCRYPT_STRENGTH` | `12` | BCrypt password hashing strength |

## API Endpoints

Base URL: `http://localhost:8080/api/v1`

### User Management (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Register a new user |
| `GET` | `/users` | List all users (paginated) |
| `GET` | `/users/{id}` | Get user by ID |
| `GET` | `/users/username/{username}` | Get user by username |
| `GET` | `/users/email/{email}` | Get user by email |
| `GET` | `/users/search?keyword=` | Search users |
| `PATCH` | `/users/{id}` | Update user details |
| `DELETE` | `/users/{id}` | Delete user (soft delete) |
| `PATCH` | `/users/{id}/activate` | Activate user |
| `PATCH` | `/users/{id}/deactivate` | Deactivate user |
| `PATCH` | `/users/{id}/lock` | Lock user account |
| `PATCH` | `/users/{id}/unlock` | Unlock user account |
| `POST` | `/users/{userId}/roles/{roleId}` | Assign role to user |
| `DELETE` | `/users/{userId}/roles/{roleId}` | Remove role from user |
| `GET` | `/users/{userId}/roles` | Get user's roles |

### Role Management (`/roles`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/roles` | Create a role |
| `GET` | `/roles` | List all roles (paginated) |
| `GET` | `/roles/{id}` | Get role by ID |
| `GET` | `/roles/search?keyword=` | Search roles |
| `POST` | `/roles/{roleId}/permissions/{permissionId}` | Add permission to role |
| `DELETE` | `/roles/{roleId}/permissions/{permissionId}` | Remove permission from role |
| `GET` | `/roles/{roleId}/permissions` | Get role's permissions |
| `GET` | `/roles/{roleId}/permissions/{permissionId}` | Check if role has permission |
| `GET` | `/roles/{roleId}/users` | Get users with this role |

### Permission Management (`/permissions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/permissions` | Create a permission |
| `GET` | `/permissions` | List all permissions (paginated) |
| `GET` | `/permissions/{id}` | Get permission by ID |
| `GET` | `/permissions/search?keyword=` | Search permissions |
| `PATCH` | `/permissions/{id}` | Update a permission |
| `DELETE` | `/permissions/{id}` | Delete a permission |
| `GET` | `/permissions/{permissionId}/roles` | Get roles with this permission |

### Password Management (`/password`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/password/{id}` | Change user password |

### Employee Management (`/employees`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/employees` | Create an employee |
| `GET` | `/employees` | List all employees (paginated) |
| `GET` | `/employees/{id}` | Get employee by ID |
| `GET` | `/employees/search?keyword=` | Search employees |
| `GET` | `/employees/department/{departmentId}` | Get employees by department |
| `PATCH` | `/employees/{id}` | Update employee |
| `DELETE` | `/employees/{id}` | Delete employee (soft delete) |

### Department Management (`/departments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/departments` | Create a department |
| `GET` | `/departments` | List all departments (paginated) |
| `GET` | `/departments/{id}` | Get department by ID |
| `GET` | `/departments/search?keyword=` | Search departments |
| `PATCH` | `/departments/{id}` | Update department |
| `DELETE` | `/departments/{id}` | Delete department |

**Total: 41 endpoints across 6 controllers.**

## Database Schema

| Table | Description |
|-------|-------------|
| `user_profile` | User accounts (username, email, password, status) |
| `roles` | Authorization roles |
| `permissions` | Fine-grained permissions (19 total, including employee permissions added in V8) |
| `user_roles` | User ↔ Role mapping (many-to-many) |
| `role_permissions` | Role ↔ Permission mapping (many-to-many) |
| `departments` | Department master data |
| `employees` | Employee records linked to departments |

### Seeded Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system access (all 19 permissions) |
| `ADMIN` | User & role management (19 permissions) |
| `MANAGER` | Employee management (6 permissions) |
| `EMPLOYEE` | Basic read access (2 permissions) |

## Architecture Patterns

- **CQRS-lite** — Separate `MService` (writes) and `QService` (reads) per entity
- **Soft Delete** — Records are flagged as deleted, never physically removed
- **RFC 7807 ProblemDetail** — Standardized error responses
- **State Machine** — User status transitions are validated (e.g., ACTIVE → LOCKED)
- **Audit Trail** — `@CreatedDate` / `@LastModifiedDate` on all entities
- **Input Validation** — Jakarta Bean Validation on all request DTOs

## Roadmap

### Phase 1 — Core Foundation
- [ ] JWT authentication & Spring Security filter chain
- [ ] Enforce RBAC on all endpoints
- [ ] OpenAPI 3 / Swagger UI integration
- [ ] Audit logging (who did what, when)
- [ ] Master data (Company, Plant, Cost Center)

### Phase 2 — Financial Accounting (SAP FI)
- [ ] General Ledger (Chart of Accounts, posting documents)
- [ ] Accounts Payable (vendor invoices, payment runs)
- [ ] Accounts Receivable (customer invoices, dunning)
- [ ] Bank Management (reconciliation statements)
- [ ] Tax Management (GST/VAT)

### Phase 3 — Materials Management (SAP MM)
- [ ] Material Master (material types, pricing)
- [ ] Procurement (purchase requisitions, POs, RFQs)
- [ ] Inventory Management (goods receipts/issues, stock transfers)
- [ ] Vendor Management (master data, evaluation)

### Phase 4 — Sales & Distribution (SAP SD)
- [ ] Customer Master (credit management)
- [ ] Sales Orders (quotation → order → delivery → billing)
- [ ] Pricing & Conditions (price lists, discounts)
- [ ] Shipping & Logistics (delivery documents, tracking)

### Phase 5 — Production Planning (SAP PP)
- [ ] Bill of Materials (multi-level BOMs)
- [ ] Work Centers (capacity planning)
- [ ] Production Orders (confirmation, goods movements)
- [ ] MRP (Material Requirements Planning)

### Phase 6 — Controlling (SAP CO)
- [ ] Cost Center Accounting (plan vs actual)
- [ ] Profit Center Accounting (split analysis)
- [ ] Internal Orders (settlement, overhead)

### Phase 7 — Quality & Compliance
- [ ] Quality Management (inspection lots, notifications)
- [ ] Document Management (version control)
- [ ] Workflow Engine (approval workflows, escalation)

### Phase 8 — Reporting & Analytics
- [ ] Dashboard Service (KPIs, real-time metrics)
- [ ] Report Generator (PDF/Excel export)
- [ ] Data Warehouse Connector (ETL pipeline)

### DevOps
- [ ] GitHub Actions CI/CD
- [ ] Spring Boot Actuator + Micrometer monitoring
- [ ] Structured JSON logging

## License

Private — All rights reserved.
