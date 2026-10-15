import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set.');
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be set and contain at least 32 characters.');
}

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port between 1 and 65535.');
}

const frontendUrl =
  process.env.FRONTEND_URL ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
const frontendOrigins = frontendUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (frontendOrigins.length === 0) {
  throw new Error('FRONTEND_URL must be set in production.');
}

for (const origin of frontendOrigins) {
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new Error(`FRONTEND_URL contains an invalid origin: ${origin}`);
  }

  if (
    (parsedOrigin.protocol !== 'http:' && parsedOrigin.protocol !== 'https:') ||
    parsedOrigin.origin !== origin
  ) {
    throw new Error(`FRONTEND_URL must contain origins only: ${origin}`);
  }
}

export const env = {
  databaseUrl,
  frontendOrigins,
  jwtSecret,
  port,
};
