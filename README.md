# Small Business Inventory & Sales Tracker

A production-quality MVP for small businesses (Spaza shops, retail stores, salons, etc.) to digitally manage their stock and record sales.

## 🚀 Features

### 🔐 Authentication
- Secure User Registration and Login.
- JWT-based session management.
- Password hashing using `bcryptjs`.
- Protected routes and API endpoints.

### 📦 Product Management
- Full CRUD for products.
- Category-based organization.
- Low-stock and out-of-stock tracking.
- Responsive inventory table with search and filtering.

### 📉 Inventory Management
- Manual stock adjustments (Increase/Decrease).
- Detailed adjustment history for every product.
- Strict validation to prevent negative stock.

### 💰 Sales Tracking
- Multi-product transaction support (Cart system).
- Automatic stock reduction upon sale completion.
- **Historical Price Preservation**: Sale items record the price at the time of transaction.
- Atomic transactions to ensure data integrity (Rollback on failure).

### 📊 Dashboard & Reporting
- Real-time summary cards (Total revenue, stock levels).
- Revenue trends over time (Recharts).
- Top-selling products analysis.
- Custom date-range sales reports.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State/API**: React Context, Axios
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod

### Database
- **Engine**: Neon PostgreSQL
- **Driver**: `pg` (node-postgres)
- **Migrations**: Raw SQL

## 🏗️ Architecture

```
Next.js Frontend <---> REST API (JSON) <---> Express.js Backend <---> Neon PostgreSQL
```

- **Zero ORM**: All database access is handled via parameterized SQL queries using the `pg` driver.
- **User Isolation**: Mandatory `user_id` filtering on every query to ensure data privacy.
- **Transactional Integrity**: Critical operations (Sales, Stock adjustments) are wrapped in PostgreSQL transactions.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Neon.tech recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd small-business-inventory
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Update DATABASE_URL and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env # Update NEXT_PUBLIC_API_URL
   npm run dev
   ```

### Database Setup
Run the migrations in `backend/database/migrations/` in order:
1. `001_create_users.sql`
2. `002_create_products.sql`
3. `003_create_sales.sql`
4. `004_create_sale_items.sql`
5. `005_create_inventory_adjustments.sql`

## 🛡️ Security Measures
- **SQL Injection Prevention**: All queries use parameterized inputs.
- **Password Security**: Passwords are never stored in plain text.
- **Data Isolation**: Users can only access records associated with their `user_id`.
- **Input Validation**: Strict Zod schemas on both frontend and backend.
- **Secure Auth**: JWT tokens used for session persistence.
