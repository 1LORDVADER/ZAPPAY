import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const products = await db.select({
  id: schema.products.id,
  name: schema.products.name,
  photos: schema.products.photos
}).from(schema.products).limit(5);

console.log(JSON.stringify(products, null, 2));
await connection.end();
