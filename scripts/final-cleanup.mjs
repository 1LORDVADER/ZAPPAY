import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Delete remaining test products
const [r] = await conn.execute("DELETE FROM products WHERE name LIKE '%Test%' OR name LIKE '%test%'");
console.log(`Deleted ${r.affectedRows} test products`);

// Delete the 1 remaining test order (consumerId=100 from the test run we just did)
const [o] = await conn.execute('DELETE FROM orders WHERE consumerId IN (100, 999)');
console.log(`Deleted ${o.affectedRows} test orders`);

// Also delete the test farmer profile created by the test suite (userId=100)
const [fp] = await conn.execute('DELETE FROM farmerProfiles WHERE userId = 100');
console.log(`Deleted ${fp.affectedRows} test farmer profiles (userId=100)`);

// Final counts
const [p] = await conn.execute('SELECT COUNT(*) as total FROM products');
const [f] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
const [ord] = await conn.execute('SELECT COUNT(*) as total FROM orders');
console.log(`\nFinal: ${p[0].total} products, ${f[0].total} farmer profiles, ${ord[0].total} orders`);

await conn.end();
