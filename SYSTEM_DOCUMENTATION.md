# System Documentation — Small Business Inventory & Sales Tracker

## 1. Purpose and scope

This system provides small businesses with user accounts, product and stock management, sales processing, customer records, business settings, a dashboard, and reports. It is implemented as two independently deployed Node.js services backed by PostgreSQL.

This document describes the current implementation and operational model. For HTTP endpoint details and examples, see the [Backend API Reference](backend/API.md). The repository [README](README.md) remains the quick-start and deployment checklist.

## 2. System context

```text
Browser
  │
  ├─ HTTPS ──> Next.js frontend (Vercel)
  │                │
  │                ├─ axios requests to NEXT_PUBLIC_API_URL
  │                └─ Bearer JWT from browser localStorage
  │
  └─ HTTPS ──> Express REST API (Render)
                   │
                   ├─ CORS allowlist from FRONTEND_URL
                   ├─ authentication and per-user data scoping
                   └─ PostgreSQL connection pool (pg)
                         └─ managed PostgreSQL database
```

The frontend and API are separate projects within this repository, each with its own `package.json` and lockfile. The frontend does not connect directly to PostgreSQL. Database credentials and JWT signing secrets belong only in the backend runtime environment.

## 3. Technology stack

| Layer | Implementation |
|---|---|
| Frontend | Next.js App Router 16, React 19, TypeScript, Tailwind CSS 4 |
| Frontend libraries | Axios, React Hook Form, Zod, Recharts, Lucide, next-themes, Sonner |
| Backend | Node.js, Express 5, TypeScript, Zod |
| Persistence | PostgreSQL via the `pg` driver and parameterized SQL; no ORM |
| Authentication | bcryptjs password hashing and signed JWT bearer tokens |
| Hosting pattern | Frontend on Vercel; API and PostgreSQL on Render |

The package manifests require Node.js `>=20.9.0`. The repository README lists PostgreSQL 13 or later.

## 4. Repository map

```text
backend/
  database/migrations/  ordered SQL schema migrations
  src/
    config/             environment validation and PostgreSQL pool
    controllers/        HTTP request handlers
    middleware/         JWT authentication middleware
    routes/             Express route registration
    scripts/            migration and demo-data scripts
    services/           application/data-access logic
    types/              TypeScript data contracts
    validators/         Zod request validation
  API.md                backend endpoint reference

frontend/
  src/app/              Next.js routes and page components
  src/components/       shared UI components
  src/contexts/         client-side authentication context
  src/lib/api.ts        Axios client and auth interceptors

README.md               quick start and deployment guide
SYSTEM_DOCUMENTATION.md this system overview
```

## 5. Main functional areas

- **Accounts:** registration, sign-in, current-user lookup.
- **Products:** create, read, update, and delete products, including price, category, quantity, and low-stock threshold.
- **Inventory:** stock increases and decreases with a reason and audit-history row.
- **Sales:** create sales from product/quantity items, validate available stock, calculate totals from current product prices, and reduce stock atomically.
- **Customers:** customer contact records scoped to an account.
- **Business settings:** business name, currency, tax rate, and notification email.
- **Dashboard and reports:** aggregated stock, sales, revenue, trend, category, and top-product views.

All protected operations are associated with the authenticated user. Product, customer, sales, stock, and settings queries include that user identity rather than accepting an arbitrary account ID from the client.

## 6. Important application flows

### 6.1 Registration and sign-in

1. The browser posts name, email, and password to `/api/auth/register`.
2. The API validates the fields, hashes the password with bcryptjs, and stores only the hash.
3. Registration returns the user record but does not sign in automatically.
4. The browser posts credentials to `/api/auth/login`.
5. The API returns a JWT and public user fields. Tokens expire after 24 hours.
6. The frontend stores the token in `localStorage`, adds it as `Authorization: Bearer …` to subsequent API calls, and clears it/redirects to login after a `401` response.

### 6.2 Sales and inventory consistency

Sale creation runs in a PostgreSQL transaction. For each requested product, the API locks and checks the user's product row, verifies sufficient stock, calculates line subtotals, and decreases stock. It then records the sale and sale items and commits the transaction. If a product is missing or stock is insufficient, the transaction is rolled back.

Manual stock adjustments also update product stock and create an inventory-adjustment history row in one transaction. Decreases that would result in negative stock are rejected.

### 6.3 Startup and migrations

The API validates its environment, connects through a PostgreSQL pool, and runs pending migrations before opening its HTTP listener. Migration names and application timestamps are stored in `schema_migrations`; migrations are serialized with a PostgreSQL advisory lock and each migration is applied transactionally. The `/health` check runs `SELECT 1` and is intended to indicate database readiness, not merely process liveness.

## 7. Data model overview

All primary identifiers are UUIDs. The schema is created by the ordered SQL files in `backend/database/migrations/`.

| Table | Purpose and key relationships |
|---|---|
| `users` | Account identity, display name, unique email, password hash |
| `products` | User-owned catalog items, price and stock fields; user deletion cascades |
| `sales` | User-owned sale header with total and timestamp |
| `sale_items` | Sale line items with quantity, unit-price snapshot, and subtotal; deleting a product sets `product_id` to null so historical line items remain |
| `inventory_adjustments` | User/product-associated stock-change audit records and reason |
| `customers` | User-owned customer contact records |
| `business_settings` | One settings record per user |
| `schema_migrations` | Migration ledger managed by the migration runner |

The product deletion migration intentionally allows historical sale items to survive without a current product reference. Monetary columns use PostgreSQL `NUMERIC`; clients should handle numeric values returned by the Node PostgreSQL driver appropriately.

## 8. Configuration

### Backend

Set these variables in `backend/.env` for local development or in Render's environment settings for deployment:

| Name | Meaning |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL. Use a local URL in development; use Render's Internal Database URL for the hosted API. |
| `JWT_SECRET` | Private JWT signing secret, at least 32 characters. |
| `FRONTEND_URL` | Exact allowed browser origin(s), comma-separated if multiple. Production requires at least one valid `http(s)` origin. Do not include a path or trailing slash. |
| `PORT` | Optional local port; defaults to `5000`. Render provides `PORT` in production. |
| `NODE_ENV` | Set to `production` for the deployed API. |

### Frontend

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` or in Vercel's frontend project environment. It must be an absolute HTTPS API URL ending in `/api` for production, e.g. `https://<render-service>.onrender.com/api`. This value is embedded during the frontend build; redeploy the frontend after changing it.

Do not put database URLs, passwords, or `JWT_SECRET` in frontend variables or any `NEXT_PUBLIC_*` variable. Do not commit `.env` or `.env.local` files.

## 9. Local development

Requirements: Node.js `>=20.9.0`, npm, and a reachable PostgreSQL 13+ database.

1. In `backend/`, install dependencies and create `.env` from `.env.example`. Set `DATABASE_URL` and a private 32+ character `JWT_SECRET`.
2. Run `npm run db:migrate` if you want to initialize the database manually. The server also runs pending migrations during startup.
3. Start the API from `backend/` with `npm run dev`. The default base is `http://localhost:5000`; the readiness endpoint is `http://localhost:5000/health`.
4. In `frontend/`, install dependencies and create `.env.local` from `.env.example`. Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
5. Start the UI from `frontend/` with `npm run dev` (Next.js default port `3000`).

On Windows PowerShell, use `npm.cmd` if the `npm.ps1` execution-policy shim is blocked.

## 10. Production deployment

### Render API and PostgreSQL

1. Provision PostgreSQL in Render; keep it in the same region as the API where practical.
2. Create a Render Web Service from this repository with root directory `backend`.
3. Build command: `npm ci --include=dev && npm run build`.
4. Start command: `npm start`.
5. Set health-check path `/health`.
6. Set `DATABASE_URL` to the database's Internal Database URL, `JWT_SECRET` to a unique secret of at least 32 characters, `FRONTEND_URL` to the exact Vercel origin, and `NODE_ENV=production`. Do not hard-code `PORT`.
7. Ensure the service can reach PostgreSQL and wait for startup migrations to complete before registering users.

If the Render plan does not provide a Shell, migrations can be run from a trusted local machine using the database's External Database URL. Rotate any database credentials that have been exposed, and do not paste secrets into chat or source control. See the repository's migration helper and README for the local workflow.

### Vercel frontend

1. Import the repository into Vercel with root directory `frontend` and framework preset Next.js.
2. Set `NEXT_PUBLIC_API_URL` to the Render API URL ending in `/api` for the correct target environment.
3. Deploy and copy the resulting frontend origin.
4. Set that exact origin in the API's `FRONTEND_URL` and redeploy the API if it changed.

Vercel Preview origins are not automatically allowed by the production API. Add only the exact preview origin(s) required to `FRONTEND_URL`; do not use `*` in production.

## 11. Operations and verification

- **API readiness:** `GET /health` should return HTTP `200` and `{"success":true,"status":"ok"}` when PostgreSQL responds. HTTP `503` means the database readiness query failed.
- **Account flow:** register, then log in; registration does not issue a token.
- **Frontend/API connection:** verify the deployed `NEXT_PUBLIC_API_URL` ends with `/api` and uses HTTPS.
- **CORS:** if browser calls fail but direct API requests work, verify that `FRONTEND_URL` exactly matches the browser origin (scheme, host, and port; no slash/path).
- **Schema:** if registration reports `relation "users" does not exist`, the database schema has not been initialized or the API is connected to the wrong database. Check `DATABASE_URL` and startup migration output before retrying.
- **Build checks:** backend `npm run check`; frontend `npm run typecheck`, `npm run lint`, and `npm run build`.

The backend includes a demo seed command, `npm run db:seed:demo`. Use only a dedicated demo account. The README notes that rerunning the seed resets that demo account's password; never use a real user's email or password for demo seeding.

## 12. Security considerations and current limitations

- Passwords are hashed before storage; the plaintext password is not returned by the API.
- JWTs and database credentials must remain secret. Rotate credentials after exposure and update the matching Render environment values.
- JWTs are stored in browser `localStorage`; this is convenient for the current client implementation but increases exposure if the site has an XSS vulnerability. Treat XSS prevention as a security priority; consider HttpOnly Secure cookies if the authentication architecture is revised.
- CORS is an origin allowlist, not authentication. Protected routes still require a valid JWT.
- Product and authentication requests use Zod validation. Customer and settings controllers currently pass bodies to their services without equivalent full Zod validation; database constraints remain the final guard for several required fields.
- Error response shapes vary between route groups. Consumers should support both `error.message` and top-level `message` formats.
- The repository does not document a password reset/email verification flow or role-based access control; do not assume those features exist.

## 13. Related documents

- [Backend API Reference](backend/API.md)
- [Quick start and deployment guide](README.md)
