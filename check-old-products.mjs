import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, name, price, retailPrice, LEFT(photos, 150) as photo_preview FROM products ORDER BY price ASC LIMIT 15');
console.log(JSON.stringify(rows, null, 2));
await conn.end();
