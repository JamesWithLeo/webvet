import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig, neon } from "@neondatabase/serverless";
import ws from "ws";

// This is required for environments like Node.js
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined. Check your .env.local");
}

const connectionString = process.env.DATABASE_URL!;

// 1. The "Fast" client for standard queries
const httpClient = neon(connectionString);
export const db = drizzleHttp({ client: httpClient });

// 2. The "Transaction" client for complex logic
const wsClient = new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 1000, // Close the connection quickly if idle
    connectionTimeoutMillis: 5000, // Don't hang the function if the DB is slow
});
export const dbTx = drizzleWs({ client: wsClient });
