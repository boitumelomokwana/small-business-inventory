# Backend API Reference

This document describes the Express API implemented in `backend/src`. It is intended for the frontend and API consumers. Unless noted otherwise, request and response bodies are JSON.

## Base URL

- Local development: `http://localhost:5000`
- Production: use the public Render URL for the backend service.
- API routes are prefixed with `/api`, except for the health check at `/health`.

Example production API base:

```text
https://<render-service>.onrender.com/api
```

The server accepts JSON request bodies up to 1 MiB. Product, customer, sales, inventory, report, settings, and dashboard data are scoped to the authenticated user.

## Authentication

Registration and login are public. All other `/api` endpoints require a JWT bearer token obtained from login:

```http
Authorization: Bearer <token>
```

Tokens expire after 24 hours. The token payload identifies the user; clients should not send a user ID to select whose data is read or changed.

Unauthenticated or invalid-token response:

```json
{
  "success": false,
  "error": {
    "message": "Unauthorized: Invalid token"
  }
}
```

The message is `Unauthorized: No token provided` when the header is missing or empty. Both cases return HTTP `401`.

## Endpoint summary

| Method | Path | Auth | Description |
|---|---|---:|---|
| `GET` | `/health` | No | Database readiness check |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Sign in and obtain a JWT |
| `GET` | `/api/auth/me` | Yes | Get the current account |
| `GET` | `/api/dashboard` | Yes | Dashboard summary |
| `GET` | `/api/products` | Yes | List products |
| `GET` | `/api/products/:id` | Yes | Get a product |
| `POST` | `/api/products` | Yes | Create a product |
| `PUT` | `/api/products/:id` | Yes | Update a product |
| `DELETE` | `/api/products/:id` | Yes | Delete a product |
| `POST` | `/api/inventory/:id/adjust-stock` | Yes | Increase or decrease stock |
| `GET` | `/api/inventory/:id/adjustments` | Yes | List stock adjustments for a product |
| `POST` | `/api/sales` | Yes | Create a sale and reduce stock |
| `GET` | `/api/sales` | Yes | List sales |
| `GET` | `/api/sales/:id` | Yes | Get a sale with its items |
| `GET` | `/api/customers` | Yes | List customers |
| `GET` | `/api/customers/:id` | Yes | Get a customer |
| `POST` | `/api/customers` | Yes | Create a customer |
| `PUT` | `/api/customers/:id` | Yes | Update a customer |
| `DELETE` | `/api/customers/:id` | Yes | Delete a customer |
| `GET` | `/api/reports/sales` | Yes | Sales report for a date interval |
| `GET` | `/api/reports/revenue-trends` | Yes | Revenue grouped by month |
| `GET` | `/api/reports/category-performance` | Yes | Sales and revenue grouped by product category |
| `GET` | `/api/reports/top-products` | Yes | Top five products by revenue |
| `GET` | `/api/settings` | Yes | Get business settings |
| `PUT` | `/api/settings` | Yes | Update business settings |

For endpoints described below, `<id>` is a database UUID. Error responses are not completely uniform across older controllers: some use `{success:false,error:{message}}`, while customer and settings endpoints may use `{success:false,message}`. Check each endpoint's notes.

## Health check

### `GET /health`

Checks the PostgreSQL connection with `SELECT 1`.

- `200`: `{ "success": true, "status": "ok" }`
- `503`: `{ "success": false, "status": "unavailable" }`

## Authentication

### `POST /api/auth/register`

Create an account. Registration does not return a token; call login after successful registration.

Request:

```json
{
  "name": "Boitumelo Mokwana",
  "email": "owner@example.com",
  "password": "at-least-6-characters"
}
```

- `name`: required string, trimmed, at least 2 characters.
- `email`: required valid email string, trimmed.
- `password`: required string, at least 6 characters.

Success (`201`):

```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "name": "Boitumelo Mokwana",
    "email": "owner@example.com"
  }
}
```

Validation or duplicate email errors return `400` with `{success:false,error:{message}}`.

### `POST /api/auth/login`

Request:

```json
{
  "email": "owner@example.com",
  "password": "your-password"
}
```

Success (`200`):

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "<uuid>",
      "name": "Boitumelo Mokwana",
      "email": "owner@example.com"
    }
  }
}
```

Invalid credentials or validation errors return `401` with `{success:false,error:{message}}`.

### `GET /api/auth/me`

Requires bearer authentication. Returns the current account:

```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "name": "Boitumelo Mokwana",
    "email": "owner@example.com"
  }
}
```

## Dashboard

### `GET /api/dashboard`

Requires bearer authentication. Success (`200`):

```json
{
  "success": true,
  "data": {
    "totalProducts": 0,
    "totalStockUnits": 0,
    "lowStockProducts": 0,
    "outOfStockProducts": 0,
    "todayRevenue": 0,
    "todaySalesCount": 0,
    "salesOverTime": [{ "date": "2026-01-31", "revenue": 0 }],
    "topProducts": [{ "name": "Example item", "quantity": 0 }]
  }
}
```

`salesOverTime` covers up to the most recent 30 calendar days; `topProducts` contains up to five products ordered by quantity sold.

## Products

### Product fields

Products use these fields:

- `name`: required non-empty string.
- `category`: required non-empty string.
- `price`: required number, zero or greater.
- `stock_quantity`: required non-negative integer when creating.
- `low_stock_threshold`: required non-negative integer when creating.
- Responses also include `id`, `user_id`, `created_at`, and `updated_at`.

### `GET /api/products`

Returns products for the current account, sorted by name:

```json
{ "success": true, "data": [{ "id": "<uuid>", "name": "Example item" }] }
```

### `GET /api/products/:id`

Returns `{ "success": true, "data": <product> }`; returns `404` if the product does not exist for the authenticated account.

### `POST /api/products`

Create a product. All five product fields above are required. Success is `201` with `{ "success": true, "data": <product> }`.

### `PUT /api/products/:id`

Partial update. Include one or more product fields in the JSON body; supplied values follow the same validation as create. Success is `200` with `{ "success": true, "data": <product> }`. Returns `404` if not found.

### `DELETE /api/products/:id`

Success (`200`):

```json
{ "success": true, "data": { "message": "Product deleted successfully" } }
```

Returns `404` if no matching product belongs to the account.

## Inventory

### `POST /api/inventory/:id/adjust-stock`

Request:

```json
{
  "quantity": 5,
  "type": "INCREASE",
  "reason": "New delivery"
}
```

- `quantity`: positive integer.
- `type`: `INCREASE` or `DECREASE`.
- `reason`: trimmed string of at least 2 characters.

Success (`200`): `{ "success": true, "data": { "newStock": 25 } }`. The update and adjustment-history entry are made in a transaction. A decrease that would make stock negative fails with `400`.

### `GET /api/inventory/:id/adjustments`

Returns `{ "success": true, "data": [...] }`, newest adjustments first. Adjustment rows include `id`, `user_id`, `product_id`, `quantity`, `type`, `reason`, and `created_at`.

## Sales

### `POST /api/sales`

Create a sale. Each product ID must be a UUID and each quantity a positive integer. The request must contain at least one item.

```json
{
  "items": [
    { "productId": "<product-uuid>", "quantity": 2 }
  ]
}
```

Success (`201`):

```json
{
  "success": true,
  "data": {
    "saleId": "<sale-uuid>",
    "totalAmount": 19.98
  }
}
```

The API checks stock and reduces product quantities in a transaction. Validation, missing products, or insufficient stock return `400`.

### `GET /api/sales`

Optional query parameters:

- `start`: beginning of the interval (timestamp/date string).
- `end`: end of the interval. The date filter is applied only when both `start` and `end` are supplied.
- `limit`: integer from 1 to 100.

Example: `/api/sales?start=2026-01-01&end=2026-01-31&limit=25`

Success (`200`): `{ "success": true, "data": [...] }`, newest first.

### `GET /api/sales/:id`

Returns `{ "success": true, "data": { ...sale, "items": [...] } }`. Sale items include the item quantity, unit price, subtotal, and product name when the product still exists. Returns `404` when the sale is not found for the account.

## Customers

Customer fields are `first_name` and `last_name` (required by the database); `email`, `phone`, and `address` are optional. The API currently passes customer request bodies to the service without a Zod validation schema, so send strings matching the database columns.

### `GET /api/customers`

Returns a bare JSON array of the authenticated account's customers, newest first (not wrapped in a `data` envelope).

### `GET /api/customers/:id`

Returns a bare customer object. Returns `404` if not found.

### `POST /api/customers`

Request:

```json
{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "email": "ada@example.com",
  "phone": "+1-555-0100",
  "address": "123 Example Street"
}
```

Success (`201`): bare customer object.

### `PUT /api/customers/:id`

Partial update; accepts any subset of `first_name`, `last_name`, `email`, `phone`, and `address`. Success (`200`): bare customer object. Returns `404` if not found.

### `DELETE /api/customers/:id`

Success (`200`): `{ "success": true, "message": "Customer deleted successfully" }`. Returns `404` if not found.

Customer errors use `{ "success": false, "message": "..." }` for most `500` responses; missing records use that shape with `404`.

## Reports

All report endpoints require bearer authentication and return `{ "success": true, "data": ... }`.

### `GET /api/reports/sales?start=<date>&end=<date>`

Both `start` and `end` query parameters are required. The report contains `totalRevenue`, `transactionCount`, `totalItemsSold`, `avgTransactionValue`, and a `sales` array (`id`, `created_at`, `item_count`, `total_amount`). Missing dates return `400`.

### `GET /api/reports/revenue-trends`

Returns an array of `{ "period": "YYYY-MM", "revenue": 123.45 }`, grouped by month.

### `GET /api/reports/category-performance`

Returns an array of `{ "category": "Example", "total_sales": 3, "revenue": 42.50 }`.

### `GET /api/reports/top-products`

Returns up to five products as `{ "product_name": "Example", "total_quantity": 3, "total_revenue": 42.50 }`, ordered by revenue.

## Business settings

### `GET /api/settings`

Returns the current account's settings as a bare object (not wrapped in `data`). If no settings row exists, returns `404` with `{ "success": false, "message": "Settings not found" }`.

### `PUT /api/settings`

Accepts a partial body with any of:

```json
{
  "business_name": "Example Shop",
  "currency": "USD",
  "tax_rate": 0,
  "notification_email": "owner@example.com"
}
```

Success (`200`): bare settings object containing `user_id`, `business_name`, `currency`, `tax_rate`, optional `notification_email`, and `updated_at`. When creating settings for the first time, provide `business_name`; the database requires it. Errors are returned with HTTP `500` and `{ "success": false, "message": "..." }`.

## Runtime and deployment configuration

The backend reads these environment variables:

| Variable | Requirement |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL. Required. |
| `JWT_SECRET` | Required, at least 32 characters. Keep private. |
| `FRONTEND_URL` | Allowed frontend origin(s), comma-separated if needed. In production it is required. Use origins only, no path or trailing slash. |
| `PORT` | Optional; defaults to `5000`. Render supplies this in deployment. |
| `NODE_ENV` | Set to `production` in production. |

The API runs pending migrations before it starts listening. Migrations are tracked in `schema_migrations` and serialized using a PostgreSQL advisory lock. The `/health` endpoint returns ready only when PostgreSQL responds.

## Notes for API consumers

- Send `Content-Type: application/json` when sending a JSON body.
- Do not put passwords, database credentials, or JWT secrets in frontend source or `NEXT_PUBLIC_*` variables.
- The API currently uses endpoint-specific error envelope shapes; clients should handle both `error.message` and `message` fields.
- Monetary values are returned from PostgreSQL-backed queries; consumers should normalize numeric database values as needed.
