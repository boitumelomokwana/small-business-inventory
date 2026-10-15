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

Deploy `backend/` and `frontend/` as separate services, using Node.js 20.9 or later. The API runs on Render and the Next.js site runs on Vercel.

### 1. Create the production database on Render

1. In the [Render Dashboard](https://dashboard.render.com/), choose **New → PostgreSQL**.
2. Give the database a name and select a region. Use the same region for the API service.
3. Create the database and copy its **Internal Database URL** for the API's `DATABASE_URL`. Keep database credentials private. If you run migrations from your computer instead, use the database's **External Database URL**.

### 2. Deploy the API on Render

1. Push this repository to GitHub, then in Render choose **New → Web Service** and connect the repository.
2. Set **Root Directory** to `backend`.
3. Set the service commands:
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
4. Add these environment variables in Render's **Environment** settings:
   - `DATABASE_URL`: the Render PostgreSQL **Internal Database URL**.
   - `JWT_SECRET`: a unique random secret of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `FRONTEND_URL`: the Vercel production origin, for example `https://your-app.vercel.app` (no path or trailing slash). You can set the final value after creating the Vercel project.
   - `NODE_ENV`: `production`.
   - Render provides `PORT`; do not hard-code it in Render settings.
5. Create the service and wait for the first deployment. Copy its public `https://...onrender.com` URL; the API base URL will be that URL plus `/api`.
6. Apply migrations before sending users to the app. If your Render plan provides a **Pre-Deploy Command**, set it to `npm run db:migrate` (the service root directory is `backend`). Otherwise run the migration locally against the production database using the External Database URL:

   ```sh
   cd backend
   DATABASE_URL="your-render-external-database-url" JWT_SECRET="your-production-jwt-secret" FRONTEND_URL="https://your-app.vercel.app" NODE_ENV=production npm run db:migrate
   ```

   The migration command is safe to rerun; it records applied migrations in `schema_migrations`. Do not run it against a database containing data you need to preserve without taking a backup first.

   In Windows PowerShell, set the variables for the current terminal before running the migration:

   ```powershell
   $env:DATABASE_URL = "your-render-external-database-url"
   $env:JWT_SECRET = "your-production-jwt-secret"
   $env:FRONTEND_URL = "https://your-app.vercel.app"
   $env:NODE_ENV = "production"
   npm run db:migrate
   ```

### 3. Deploy the frontend on Vercel

1. In the [Vercel Dashboard](https://vercel.com/dashboard), choose **Add New → Project** and import the same GitHub repository.
2. Set **Root Directory** to `frontend` and leave framework detection set to **Next.js**.
3. Add `NEXT_PUBLIC_API_URL` with the Render API URL ending in `/api`, for example `https://your-api.onrender.com/api`. Add it to the **Production** environment (and Preview if you have configured the API to allow the preview origin).
4. Deploy. Vercel installs dependencies and builds the Next.js app from `frontend/`.
5. Copy the deployed production origin (for example `https://your-app.vercel.app`). In Render, set `FRONTEND_URL` to that exact origin, save the change, and redeploy the API.
6. Visit the Vercel URL, register an account, and verify that sign-in, product listing, and `/health` on the Render API work.

The API only allows origins listed in `FRONTEND_URL`. For a custom Vercel domain, set that domain as the origin instead. To use Preview deployments with the API, add the exact Preview origin(s) to `FRONTEND_URL` as a comma-separated list and redeploy the API. Do not use `*` for production.

`NEXT_PUBLIC_API_URL` is embedded during the frontend build; changing it in Vercel requires a new deployment. Never put database credentials or `JWT_SECRET` in Vercel or any `NEXT_PUBLIC_*` variable. Do not commit `.env` files or production secrets.

## Available checks

- Backend: `npm run check`
- Frontend: `npm run typecheck`, `npm run lint`, and `npm run build`

Product, inventory, sales, customer, settings, report, and dashboard API routes require a valid bearer token. Sign-up and sign-in are available under `/api/auth`.
