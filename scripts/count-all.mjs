import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [p] = await conn.execute('SELECT COUNT(*) as total FROM products');
const [f] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
const [o] = await conn.execute('SELECT COUNT(*) as total FROM orders');
const [t] = await conn.execute('SELECT COUNT(*) as total FROM transactions');
console.log(`Products: ${p[0].total}`);
console.log(`Farmer profiles: ${f[0].total}`);
console.log(`Orders: ${o[0].total}`);
console.log(`Transactions: ${t[0].total}`);

// Check for any remaining test products
const [testProds] = await conn.execute("SELECT id, name FROM products WHERE name LIKE '%Test%' OR name LIKE '%test%'");
console.log(`\nTest products remaining: ${testProds.length}`);
if (testProds.length > 0) console.log(JSON.stringify(testProds));

await conn.end();
