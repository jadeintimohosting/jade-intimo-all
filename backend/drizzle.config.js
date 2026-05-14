import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // FIX 1: Change .js to .ts so Drizzle can see your models
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // This will now correctly pull from your .env file
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
