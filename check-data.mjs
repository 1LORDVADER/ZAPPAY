import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Check drivers
const drivers = await db.select().from(schema.drivers);
console.log(`Found ${drivers.length} drivers in database`);

// Check shipments
const shipments = await db.select().from(schema.shipments);
console.log(`Found ${shipments.length} shipments in database`);

// Check GPS tracking
const gpsTracking = await db.select().from(schema.gpsTracking);
console.log(`Found ${gpsTracking.length} GPS tracking records in database`);

await connection.end();
