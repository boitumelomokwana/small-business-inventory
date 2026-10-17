# Project Tracker — Small Business Inventory & Sales Tracker

**Last updated:** 2026-10-15  
**Overall status:** Deployment in progress; production database initialization and final deployment checks remain unresolved.

> Status reflects repository inspection and deployment logs shared through 2026-10-15. Anything not confirmed by a successful current deployment or test is marked **Unverified**.

## Status key

- **Done** — directly confirmed completed.
- **In progress** — implementation or setup has started, but completion is not confirmed.
- **Blocked** — cannot progress until a dependency or failure is resolved.
- **Unverified** — there is not enough recent evidence to call it complete.

## Current summary

| Workstream | Status | Evidence / current position |
|---|---|---|
| Backend code and build | **Build succeeded; runtime unverified** | Render logs showed `npm ci --include=dev && npm run build` completing successfully. Earlier startup attempts failed on environment validation; no later successful readiness log was supplied. |
| Database schema and registration | **Blocked / unverified** | Registration returned `relation "users" does not exist`. A local migration attempt failed with a connection-reset error. No successful migration completion has been confirmed. |
| Frontend Vercel deployment | **In progress** | Vercel detected Next.js and built the app, then failed TypeScript checking on an undeclared `currentUser` in the protected layout. A local source correction was made to use `user.name`; no successful build/deploy after that correction has been confirmed. |
| CORS / production environment | **Unverified** | Logs previously rejected `FRONTEND_URL` with a trailing slash. Use the exact Vercel origin with no trailing slash, and confirm the current Render environment values without sharing secrets. |
| Security / credential rotation | **Action required; status unknown** | Database connection information and a JWT secret were exposed in screenshots. Rotate the database password and JWT secret if not already done, and update Render with the new values. |
| Documentation | **Done** | API and system reference documents have been created; see the related documents section. |

## Work tracker

### Deployment and production readiness

| ID | Task | Status | Priority | Next action / completion criteria |
|---|---|---|---|---|
| DEP-01 | Rotate database credentials exposed in screenshots | **Unverified** | Critical | Rotate the PostgreSQL password in Render. Update the API service's `DATABASE_URL` to the new **Internal Database URL**. Never share either URL in chat or commit it. |
| DEP-02 | Confirm backend runtime environment | **Unverified** | High | In Render, verify exact keys `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and `NODE_ENV`. Ensure `FRONTEND_URL` is the exact production Vercel origin, no path or trailing slash. Keep `PORT` Render-managed. |
| DEP-03 | Initialize production database schema | **Blocked** | Critical | Ensure the latest backend code that runs pending migrations at startup is deployed. Review Render startup logs for each `Applied database migration ...` line and a successful server listen. If startup migration is not available, run `npm run db:migrate` from a trusted local machine using the rotated **External Database URL**. |
| DEP-04 | Verify API readiness | **Blocked by DEP-03** | High | Request `https://<render-service>.onrender.com/health`; completion means HTTP `200` with `{"success":true,"status":"ok"}`. HTTP `503` indicates the database is not ready. |
| DEP-05 | Verify account registration and login | **Blocked by DEP-03** | High | Register once after the `users` table exists, then log in and confirm a JWT is returned. Do not retry registration until the migration is confirmed. |
| DEP-06 | Confirm Render frontend origin allowlist | **Unverified** | High | Ensure `FRONTEND_URL` exactly matches the Vercel production origin, e.g. `https://<project>.vercel.app`; no trailing slash, path, or wildcard. Redeploy the API after changes. |

### Frontend

| ID | Task | Status | Priority | Next action / completion criteria |
|---|---|---|---|---|
| WEB-01 | Fix the protected-layout TypeScript error | **Code change made; deploy unverified** | High | The source now uses `user.name` for the avatar `alt` text instead of undeclared `currentUser.name`. Commit/push this change and confirm Vercel completes build and deployment. |
| WEB-02 | Confirm Vercel project configuration | **Partially verified** | High | Root directory should be `frontend`, framework Next.js, and `NEXT_PUBLIC_API_URL` should be the Render API URL ending in `/api`. Verify Production environment and redeploy after any change. |
| WEB-03 | Run browser smoke test | **Blocked / unverified** | Medium | After backend and frontend are both healthy, test register, login, dashboard, product listing, and one API request from the deployed site. |

### Documentation

| ID | Task | Status | Priority | Completion criteria |
|---|---|---|---|---|
| DOC-01 | Backend API reference | **Done** | — | Route paths, authentication, payloads, response shapes, and configuration are documented. |
| DOC-02 | System documentation | **Done** | — | Architecture, data model, flows, local setup, deployment, operations, and security considerations are documented. |
| DOC-03 | Project tracker | **Done** | — | This tracker records current evidence, risks, and next actions. |

## Recommended order of work

1. **Rotate credentials** if not already completed; replace the API's Render `DATABASE_URL` with the new internal URL and set a fresh 32+ character `JWT_SECRET`.
2. **Confirm migration execution** in Render startup logs. If using the local helper, run it only with the newly rotated External Database URL. The connection-reset error needs resolution before considering migrations complete.
3. Confirm `/health` returns HTTP `200`.
4. Confirm the corrected frontend source is pushed and the latest Vercel deployment succeeds.
5. Confirm CORS is set to the exact Vercel production origin, then test registration and login once.
6. Complete the browser smoke test and record the successful deployment URLs and commit IDs below.

## Risks and constraints

- **Exposed credentials:** Previous screenshots showed database credentials and a JWT secret. Treat them as compromised until rotation is confirmed.
- **Database connectivity:** The last reported local migration attempt failed with a connection-reset code. Check that the current External Database URL is being used from a network that can reach the database on port `5432`; do not publish connection strings while troubleshooting.
- **Render Shell availability:** The project owner reported that Shell is unavailable on the free tier. Prefer the backend's startup migration behavior or a trusted local migration run with the database External URL.
- **Deployment state can lag repository state:** Local edits do not reach Render or Vercel until committed, pushed, and redeployed. Capture the deployed commit ID when validating.
- **Demo seeding:** `npm run db:seed:demo` resets the password for its configured demo email when rerun. Never use a real account for demo seeding.

## Deployment record

| Service | Expected host | Latest confirmed state | Current deployed commit |
|---|---|---|---|
| API | Render Web Service | Build success observed; runtime health not confirmed | Not confirmed |
| Database | Render PostgreSQL | Exists; schema initialization not confirmed | Not applicable |
| Frontend | Vercel Next.js project | Build error observed before local fix; subsequent deployment not confirmed | Not confirmed |

## Related documents

- [System documentation](SYSTEM_DOCUMENTATION.md)
- [Backend API reference](backend/API.md)
- [Quick start and deployment guide](README.md)
