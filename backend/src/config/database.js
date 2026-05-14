import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless'; 
import { drizzle } from 'drizzle-orm/neon-serverless'; 
import ws from 'ws'; // <-- Importăm pachetul ws

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const db = drizzle(pool);

export { db, pool };