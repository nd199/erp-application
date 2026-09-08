# ERP Backend

A modular, scalable ERP backend service inspired by SAP's enterprise architecture. Built with Spring Boot 4.1, Java 21,
and PostgreSQL.

## Tech Stack

| Component  | Technology                          |
|------------|-------------------------------------|
| Language   | Java 21 (LTS)                       |
| Framework  | Spring Boot 4.1.0                   |
| Security   | Spring Security + JWT (jjwt 0.12.6) |
| Database   | PostgreSQL 17                       |
| ORM        | Spring Data JPA / Hibernate         |
| Migrations | Flyway                              |
| Build      | Maven                               |
| Container  | Docker Compose                      |
| Monitoring | Spring Boot Actuator                |
| Testing    | JUnit 5, H2, Mockito                |

## Project Structure

```
src/main/java/com/naren/erpbackend/
├── security/                  # Authentication & authorization
│   ├── jwt/                   # JWT properties, auth filter
│   ├── SecurityConfig.java    # Spring Security filter chain
│   ├── SecurityUser.java      # UserDetails implementation
│   └── service/               # JwtService, UserDetailsService, AuthService
├── auth/                      # Auth endpoints & DTOs
│   ├── controller/            # AuthController (login, refresh)
│   └── dto/                   # AuthRequest, TokenResponse
├── common/exception/          # Global exception handling (RFC 7807)
├── util/                      # BeanUtils (PasswordEncoder)
├── user/                      # User, Role, Permission management
│   ├── entity/
│   ├── repository/
│   ├── dto/
│   ├── service/
│   ├── controller/
│   └── bootstrap/             # Seed data (roles, permissions, admin user)
└── employee/                  # Employee & Department management
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

| Variable | Value          |
|----------|----------------|
| Database | `erp_db`       |
| Username | `erp_user`     |
| Password | `erp_password` |

### 2. Set environment variables

```bash
export JWT_SECRET=$(openssl rand -base64 32)   # Required — no default
export ADMIN_USERNAME=superadmin                # Optional (default: superadmin)
export ADMIN_PASSWORD=admin123                  # Optional (default: admin123)
export ADMIN_EMAIL=admin@erp.local              # Optional (default: admin@erp.local)
```

### 3. Run the application

```bash
mvn spring-boot:run
```

The app starts on `http://localhost:8080`. Flyway runs migrations automatically on startup.
Roles, permissions, and the admin user are seeded via `SystemAuthorizationSeeder` and `UserSeeder`.

### 4. Run tests

```bash
mvn test
```

Tests use H2 in-memory database (PostgreSQL compatibility mode). No external dependencies required.

## Security

### Authentication Flow

```
POST /api/v1/auth/login  { "username", "password" }
  → Returns: { accessToken, refreshToken, tokenType, expiresIn }

GET /api/v1/users  Authorization: Bearer <accessToken>
  → JwtAuthFilter validates token → SecurityContext set → Controller handles request

POST /api/v1/auth/refresh  { "refreshToken" }
  → Returns new accessToken (refresh token reused)
```

### Default Admin Account

| Field    | Value              |
|----------|--------------------|
| Username | `superadmin`       |
| Password | `admin123`         |
| Email    | `admin@erp.local`  |
| Role     | `SUPER_ADMIN`      |

Change these via environment variables before first run.

### Endpoints

| Endpoint                 | Auth Required | Description            |
|--------------------------|---------------|------------------------|
| `POST /api/v1/auth/login`    | No            | Login, get tokens      |
| `POST /api/v1/auth/refresh`  | No            | Refresh access token   |
| `GET /actuator/health`       | No            | Health check           |
| All other `/api/v1/**`       | Yes           | JWT Bearer token       |

## Configuration

### Profiles

| Profile         | Description                             |
|-----------------|-----------------------------------------|
| `dev` (default) | Local PostgreSQL, SQL logging enabled   |
| `prod`          | All settings from environment variables |
| `test`          | H2 in-memory, Flyway disabled           |

### Environment Variables

| Variable           | Default                                   | Description                      |
|--------------------|-------------------------------------------|----------------------------------|
| `DB_URL`           | `jdbc:postgresql://localhost:5432/erp_db` | Database JDBC URL                |
| `DB_USERNAME`      | `erp_user`                                | Database username                |
| `DB_PASSWORD`      | `erp_password`                            | Database password                |
| `BCRYPT_STRENGTH`  | `12`                                      | BCrypt password hashing strength |
| `JWT_SECRET`       | **(required)**                            | HMAC-SHA secret for JWT signing  |
| `JWT_EXPIRATION`   | `3600000` (1 hour)                        | Access token expiry (ms)         |
| `JWT_REFRESH_EXPIRATION` | `604800000` (7 days)                 | Refresh token expiry (ms)        |
| `JWT_ISSUER`       | `erp-backend`                             | JWT issuer claim                 |
| `ADMIN_USERNAME`   | `superadmin`                              | Initial admin username           |
| `ADMIN_PASSWORD`   | `admin123`                                | Initial admin password           |
| `ADMIN_EMAIL`      | `admin@erp.local`                         | Initial admin email              |

## API Endpoints

Base URL: `http://localhost:8080/api/v1`

### Auth (`/auth`)

| Method | Endpoint      | Description                   | Auth |
|--------|---------------|-------------------------------|------|
| `POST` | `/auth/login`     | Login, returns JWT tokens     | No   |
| `POST` | `/auth/refresh`   | Refresh access token          | No   |

### User Management (`/users`)

| Method   | Endpoint                         | Description                |
|----------|----------------------------------|----------------------------|
| `POST`   | `/users`                         | Register a new user        |
| `GET`    | `/users`                         | List all users (paginated) |
| `GET`    | `/users/{id}`                    | Get user by ID             |
| `GET`    | `/users/username/{username}`     | Get user by username       |
| `GET`    | `/users/email/{email}`           | Get user by email          |
| `GET`    | `/users/search?keyword=`         | Search users               |
| `PATCH`  | `/users/{id}`                    | Update user details        |
| `DELETE` | `/users/{id}`                    | Delete user (soft delete)  |
| `PATCH`  | `/users/{id}/activate`           | Activate user              |
| `PATCH`  | `/users/{id}/deactivate`         | Deactivate user            |
| `PATCH`  | `/users/{id}/lock`               | Lock user account          |
| `PATCH`  | `/users/{id}/unlock`             | Unlock user account        |
| `POST`   | `/users/{userId}/roles/{roleId}` | Assign role to user        |
| `DELETE` | `/users/{userId}/roles/{roleId}` | Remove role from user      |
| `GET`    | `/users/{userId}/roles`          | Get user's roles           |

### Role Management (`/roles`)

| Method   | Endpoint                                     | Description                  |
|----------|----------------------------------------------|------------------------------|
| `POST`   | `/roles`                                     | Create a role                |
| `GET`    | `/roles`                                     | List all roles (paginated)   |
| `GET`    | `/roles/{id}`                                | Get role by ID               |
| `GET`    | `/roles/search?keyword=`                     | Search roles                 |
| `POST`   | `/roles/{roleId}/permissions/{permissionId}` | Add permission to role       |
| `DELETE` | `/roles/{roleId}/permissions/{permissionId}` | Remove permission from role  |
| `GET`    | `/roles/{roleId}/permissions`                | Get role's permissions       |
| `GET`    | `/roles/{roleId}/permissions/{permissionId}` | Check if role has permission |
| `GET`    | `/roles/{roleId}/users`                      | Get users with this role     |

### Permission Management (`/permissions`)

| Method   | Endpoint                            | Description                      |
|----------|-------------------------------------|----------------------------------|
| `POST`   | `/permissions`                      | Create a permission              |
| `GET`    | `/permissions`                      | List all permissions (paginated) |
| `GET`    | `/permissions/{id}`                 | Get permission by ID             |
| `GET`    | `/permissions/search?keyword=`      | Search permissions               |
| `PATCH`  | `/permissions/{id}`                 | Update a permission              |
| `DELETE` | `/permissions/{id}`                 | Delete a permission              |
| `GET`    | `/permissions/{permissionId}/roles` | Get roles with this permission   |

### Password Management (`/password`)

| Method  | Endpoint         | Description          |
|---------|------------------|----------------------|
| `PATCH` | `/password/{id}` | Change user password |

### Employee Management (`/employees`)

| Method   | Endpoint                               | Description                    |
|----------|----------------------------------------|--------------------------------|
| `POST`   | `/employees`                           | Create an employee             |
| `GET`    | `/employees`                           | List all employees (paginated) |
| `GET`    | `/employees/{id}`                      | Get employee by ID             |
| `GET`    | `/employees/search?keyword=`           | Search employees               |
| `GET`    | `/employees/department/{departmentId}` | Get employees by department    |
| `PATCH`  | `/employees/{id}`                      | Update employee                |
| `DELETE` | `/employees/{id}`                      | Delete employee (soft delete)  |

### Department Management (`/departments`)

| Method   | Endpoint                       | Description                      |
|----------|--------------------------------|----------------------------------|
| `POST`   | `/departments`                 | Create a department              |
| `GET`    | `/departments`                 | List all departments (paginated) |
| `GET`    | `/departments/{id}`            | Get department by ID             |
| `GET`    | `/departments/search?keyword=` | Search departments               |
| `PATCH`  | `/departments/{id}`            | Update department                |
| `DELETE` | `/departments/{id}`            | Delete department                |

**Total: 43 endpoints across 7 controllers.**

## Database Schema

| Table              | Description                              |
|--------------------|------------------------------------------|
| `user_profile`     | User accounts (username, email, password, status) |
| `roles`            | Authorization roles                      |
| `permissions`      | Fine-grained permissions (19 total)      |
| `user_roles`       | User ↔ Role mapping (many-to-many)       |
| `role_permissions` | Role ↔ Permission mapping (many-to-many) |
| `departments`      | Department master data                   |
| `employees`        | Employee records linked to departments   |

### Seeded Roles

| Role          | Description                             |
|---------------|-----------------------------------------|
| `SUPER_ADMIN` | Full system access (all 19 permissions) |
| `ADMIN`       | User & role management (19 permissions) |
| `MANAGER`     | Employee management (6 permissions)     |
| `EMPLOYEE`    | Basic read access (2 permissions)       |

## Architecture Patterns

- **JWT Stateless Auth** — No HTTP sessions, pure token-based authentication
- **CQRS-lite** — Separate `MService` (writes) and `QService` (reads) per entity
- **Soft Delete** — Records are flagged as deleted, never physically removed
- **RFC 7807 ProblemDetail** — Standardized error responses
- **State Machine** — User status transitions are validated (e.g., ACTIVE → LOCKED)
- **Audit Trail** — `@CreatedDate` / `@LastModifiedDate` on all entities
- **Input Validation** — Jakarta Bean Validation on all request DTOs

## Roadmap

### Phase 1 — Core Foundation

- [x] JWT authentication & Spring Security filter chain
- [x] RBAC model (User, Role, Permission entities + seeder)
- [x] Spring Boot Actuator monitoring
- [ ] Enforce permission-based access on every endpoint (`@PreAuthorize`)
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
- [ ] Structured JSON logging
- [ ] API rate limiting

## License

Private — All rights reserved.
