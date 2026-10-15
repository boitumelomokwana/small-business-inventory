# Small Business Inventory & Sales Tracker

Inventory and sales management for small businesses. The application consists of a Next.js frontend, an Express/TypeScript REST API, and PostgreSQL.

## Project structure

```text
.
├── backend/
│   ├── database/migrations/
│   └── src/
├── frontend/
│   ├── public/
│   └── src/
├── README.md
└── .gitignore
```

The frontend and backend are independent Node.js services with their own manifests, lockfiles, and environment templates. Install and run commands from the corresponding service directory.

## Requirements

- Node.js 20.9 or later
- PostgreSQL 13 or later (a managed PostgreSQL provider is recommended for production)
- npm

## Run locally

1. Configure the API:

   ```sh
   cd backend
   npm install
   ```

   Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` and replace `JWT_SECRET` with a random value of at least 32 characters.

2. Apply the database migrations and start the API:

   ```sh
   npm run db:migrate
   npm run dev
   ```

   The API listens on port `5000` by default and exposes its database readiness at `/health`.

3. Configure and start the frontend in another terminal:

   ```sh
   cd frontend
   npm install
   ```

   Copy `frontend/.env.example` to `frontend/.env.local`. Set `NEXT_PUBLIC_API_URL` to the API base URL, including `/api`.

   ```sh
   npm run dev
   ```

## Deployment

Deploy `backend/` and `frontend/` as separate Node.js services, using Node.js 20.9 or later.

### Backend service

- Build command: `npm ci && npm run build`
- Release/pre-deploy command: `npm run db:migrate`
- Start command: `npm start`
- Required environment variables: `DATABASE_URL`, `JWT_SECRET` (at least 32 characters), and `FRONTEND_URL` (the frontend origin, without a path; comma-separated origins are supported).
- Set `NODE_ENV=production` and provide the service's assigned `PORT` if required by the hosting platform.
- Configure the hosting provider's health check to use `/health`. This endpoint returns HTTP 503 if PostgreSQL is unavailable.

### Frontend service

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Set `NEXT_PUBLIC_API_URL` to the public HTTPS API URL with `/api` appended. This value is embedded during the frontend build, and the production build fails if it is missing or invalid.

Run the backend migration command once as a release step before serving traffic. Do not commit `.env` files or production secrets.

## Available checks

- Backend: `npm run check`
- Frontend: `npm run typecheck`, `npm run lint`, and `npm run build`

Product, inventory, sales, customer, settings, report, and dashboard API routes require a valid bearer token. Sign-up and sign-in are available under `/api/auth`.
