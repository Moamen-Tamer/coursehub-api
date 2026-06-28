# CourseHub API

A multi-tenant course management REST API built with **Node.js**, **TypeScript**, and **PostgreSQL**. Tenant isolation is enforced at the database level via PostgreSQL's **Row-Level Security (RLS)**, and access control is handled through **JWT-based RBAC** with three roles: `admin`, `instructor`, and `student`.

---

## Features

- **Multi-tenancy** — Each tenant's data is completely isolated via PostgreSQL RLS policies, no application-level filtering required
- **JWT Authentication** — Access and refresh tokens stored in `httpOnly` cookies, with separate expiry windows
- **Role-Based Access Control** — Three roles (`admin`, `instructor`, `student`) enforced at both the route and middleware level
- **Transaction-safe requests** — Each authenticated request runs inside a PostgreSQL transaction with automatic COMMIT/ROLLBACK on response finish
- **Rate limiting** — Global limiter (1000 req/hr) and a stricter auth limiter (5 req/5min) on login and register
- **Structured migrations** — Ordered SQL migration files with a lightweight TypeScript runner, including seed data for all three tenants

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` |
| Validation | `express-validator` |
| Security | `helmet`, `cookie-parser`, `express-rate-limit` |

---

## Project Structure

```
coursehub-api/
├── migrations/          # Ordered SQL migration files (schema + seed data)
├── scripts/
│   └── migrate.ts       # Migration runner
├── src/
│   ├── config/env.ts    # Env var validation (fails fast on startup)
│   ├── database/pool.ts # pg Pool configuration + in-memory refresh token store
│   ├── middleware/
│   │   ├── authentication.ts   # JWT verification + express-validator chains
│   │   ├── authorization.ts    # Role-based access control
│   │   ├── setTenantContext.ts # Acquires PG client, sets RLS context per request
│   │   ├── error.ts            # Centralized error handler
│   │   ├── logger.ts           # Color-coded request logger (chalk)
│   │   ├── limiter.ts          # Rate limiters
│   │   └── notFound.ts         # 404 handler
│   ├── controller/      # Business logic for each domain
│   ├── routes/          # Express routers
│   ├── model.ts         # Shared TypeScript types (UserRole, TokenUser, statusError)
│   └── server/server.ts # App entry point
└── types/types.d.ts     # Express Request augmentation (req.user, req.client)
```

---

## Database Schema

```
tenants ─────────────────────────────────────────┐
   └── users (tenant_id FK)                       │
   └── courses (tenant_id FK, instructor_id FK)   │
       └── assignments (tenant_id FK, course_id)  │
           └── submissions (assignment_id, student_id)
   └── enrollments (tenant_id FK, student_id, course_id)
```

RLS policies on all five tables filter by `current_setting('app.tenant_id')::int`, which is set per-transaction in `setTenantContext`.

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tenants/register` | Register a new tenant + admin user (atomic) |
| `POST` | `/api/auth/login` | Login — sets `accessToken` + `refreshToken` cookies |
| `POST` | `/api/auth/logout` | Clears auth cookies |
| `POST` | `/api/auth/refresh` | Issues a new access token via refresh token |
| `GET` | `/api/auth/me` | Returns the currently authenticated user |

### Courses `(auth required)`

| Method | Endpoint | Role |
|---|---|---|
| `GET` | `/api/courses` | Any |
| `GET` | `/api/courses/:id` | Any |
| `GET` | `/api/courses/enrollment_counts` | Any |
| `POST` | `/api/courses` | `admin`, `instructor` |
| `PATCH` | `/api/courses/:id` | `admin`, `instructor` |
| `DELETE` | `/api/courses/:id` | `admin` |

### Enrollments `(student only)`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/enrollments/my_courses` | Get all courses the student is enrolled in |
| `POST` | `/api/enrollments` | Enroll in a course |
| `DELETE` | `/api/enrollments/:course_id` | Unenroll from a course |

### Assignments `(auth required)`

| Method | Endpoint | Role |
|---|---|---|
| `GET` | `/api/assignments` | `student` (filter by `?courseId`) |
| `POST` | `/api/assignments` | `admin`, `instructor` |
| `PATCH` | `/api/assignments/:id` | `admin`, `instructor` |
| `DELETE` | `/api/assignments/:id` | `admin`, `instructor` |

### Submissions `(auth required)`

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/api/submissions` | `student` |
| `GET` | `/api/submissions/my_submissions` | `student` |
| `GET` | `/api/submissions/:assignmentId` | `admin`, `instructor` |
| `PATCH` | `/api/submissions/:id/grade` | `admin`, `instructor` |

### Analytics `(admin + instructor only)`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/topStudents` | Top 10 students by average grade |
| `GET` | `/api/analytics/avgGrade` | Average grade per course |
| `GET` | `/api/analytics/:id` | Students who haven't submitted for a given assignment |
| `GET` | `/api/analytics/overdue` | All assignments with submitted/overdue/pending status per student |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 1. Clone and install

```bash
git clone https://github.com/Moamen-Tamer/coursehub-api.git
cd coursehub-api
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
NODE_ENV=development
SERVER_PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=coursehub

ACCESS_KEY_SECRET=your_access_secret
REFRESH_KEY_SECRET=your_refresh_secret
ACCESS_KEY_EXPIRY=15m
REFRESH_KEY_EXPIRY=7d
```

### 3. Run migrations

```bash
npm run migrate
```

This runs all SQL files in `/migrations` in order, creating the schema and seeding all three tenants with users, courses, enrollments, assignments, and submissions.

### 4. Start the server

```bash
npm run dev
```

---

## Seed Accounts

The seed data creates three fully isolated tenants. All seeded passwords are listed below.

| Tenant | Slug | Password |
|---|---|---|
| Greenwood Academy | `greenwood-academy` | `user12345` |
| Blue Ridge Institute | `blue-ridge-institute` | `user54321` |
| Lighthouse Online School | `lighthouse-online` | `user00000` |

Each tenant has 1 admin, 2 instructors, and 5 students. Emails follow the pattern `firstname.lastname@slug.test` (e.g., `sarah.mitchell@greenwood-academy.test`).

---

## How Multi-Tenancy Works

1. A tenant registers via `POST /api/tenants/register` — this creates a row in `tenants` and an `admin` user in a single atomic transaction.
2. The admin logs in and receives JWT cookies. The token payload includes `tenant_id`.
3. On every subsequent request, `setTenantContext` middleware:
   - Checks out a `PoolClient` from the pool
   - Opens a transaction with `BEGIN`
   - Executes `SET LOCAL app.tenant_id = $1` using the value from the JWT
   - Attaches the client to `req.client`
4. PostgreSQL RLS policies on all five tables automatically filter all queries to the current tenant. No `WHERE tenant_id = ?` needed in application code.
5. On response finish, the middleware either `COMMIT`s or `ROLLBACK`s and releases the client.

---

## License

[MIT](LICENSE)
