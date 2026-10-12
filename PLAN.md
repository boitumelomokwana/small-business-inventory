# Implementation Plan - Small Business Inventory & Sales Tracker

## Project Goals
Build a production-quality MVP for small business inventory and sales tracking using Next.js, Express, and Neon PostgreSQL (no ORM).

## Technology Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons.
- **Backend**: Node.js, Express.js, TypeScript, Zod.
- **Database**: Neon PostgreSQL via `pg` driver (Raw SQL).
- **Auth**: JWT, bcryptjs.

## Development Phases

### Phase 1: Project Inspection (Completed)
- [x] Inspect existing repository.
- [x] Analyze business logic in existing `server/db.ts`.
- [x] Identify prohibited technologies (Prisma, tRPC) to be replaced.

### Phase 2: Base Setup
- [ ] Initialize `frontend/` using Next.js App Router.
- [ ] Initialize `backend/` using Express and TypeScript.
- [ ] Set up project structure as requested.
- [ ] Configure `.env.example`.

### Phase 3: Database Connection
- [ ] Configure Neon PostgreSQL connection pool.
- [ ] Implement database utility for executing queries.

### Phase 4: Database Migrations
- [ ] Create `001_create_users.sql`.
- [ ] Create `002_create_products.sql`.
- [ ] Create `003_create_sales.sql`.
- [ ] Create `004_create_sale_items.sql`.
- [ ] Create `005_create_inventory_adjustments.sql`.
- [ ] Implement a simple migration runner.

### Phase 5: Authentication
- [ ] Backend: Password hashing with bcrypt.
- [ ] Backend: JWT generation and verification middleware.
- [ ] Backend: endpoints `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- [ ] Frontend: Auth context and protected routes.
- [ ] Frontend: Login and Registration pages.

### Phase 6: Product Management
- [ ] Backend: REST endpoints for Product CRUD.
- [ ] Backend: Zod validation for product input.
- [ ] Frontend: Product list table (Responsive).
- [ ] Frontend: Add/Edit product forms.

### Phase 7: Inventory Management
- [ ] Backend: `/api/products/:id/adjust-stock` (Transaction).
- [ ] Backend: `/api/products/:id/adjustments` history.
- [ ] Frontend: Stock adjustment dialog.
- [ ] Frontend: Adjustment history view.

### Phase 8: Sales Implementation
- [ ] Backend: `/api/sales` (POST) with strict transaction logic.
- [ ] Backend: Stock validation and automatic reduction.
- [ ] Backend: Historical price preservation in `sale_items`.
- [ ] Frontend: Sales "Cart" interface.
- [ ] Frontend: Sale completion flow.

### Phase 9: Dashboard
- [ ] Backend: `/api/dashboard` with aggregated statistics.
- [ ] Frontend: Summary cards.
- [ ] Frontend: Sales charts (Recharts).

### Phase 10: Reports & History
- [ ] Backend: `/api/reports/sales` with date range filters.
- [ ] Frontend: Date picker and reports table.
- [ ] Frontend: Detailed sale view.

### Phase 11: UI/UX Polish
- [ ] Implement Light/Dark mode.
- [ ] Add Skeleton loaders and Loading states.
- [ ] Integrate Sonner toast notifications.
- [ ] Responsive design audit.

### Phase 12: Testing
- [ ] Unit tests for business logic (Sales, Stock).
- [ ] Integration tests for API endpoints.
- [ ] User data isolation verification.

### Phase 13: Security Review
- [ ] SQL Injection audit.
- [ ] JWT and Middleware verification.
- [ ] Input validation check.

### Phase 14: Deployment Preparation
- [ ] Vercel (Frontend) and Render/Railway (Backend) config.
- [ ] Final production build check.

### Phase 15: Documentation
- [ ] Create professional `README.md`.
