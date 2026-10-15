# Inventory Tracker frontend

The frontend is a Next.js App Router application. For local development, copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_API_URL` to the backend URL ending in `/api`, then run:

```sh
npm ci
npm run dev
```

For production, set `NEXT_PUBLIC_API_URL` to the public HTTPS backend URL ending in `/api` before building. Production builds reject missing or invalid API URLs.

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm start
```

See the repository [deployment guide](../README.md#deployment) for backend configuration, database migrations, and release settings.
