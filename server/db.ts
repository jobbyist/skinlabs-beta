import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { config } from "./env-config";

neonConfig.webSocketConstructor = ws;

if (!config.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: config.DATABASE_URL });
export const db = drizzle({ client: pool, schema });