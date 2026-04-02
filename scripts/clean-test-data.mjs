import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const conn = await mysql.createConnection(dbUrl);

// Show all products
const [allProducts] = await conn.execute('SELECT id, name, farmerId, status FROM products ORDER BY id');
console.log('\n=== ALL PRODUCTS IN DATABASE ===');
for (const p of allProducts) {
  console.log(`  id=${p.id} farmerId=${p.farmerId} status=${p.status} name="${p.name}"`);
}
console.log(`\nTotal: ${allProducts.length} products`);

// Show products with "Test" in name
const [testProducts] = await conn.execute("SELECT id, name, farmerId FROM products WHERE name LIKE '%Test%' OR name LIKE '%test%'");
console.log('\n=== PRODUCTS WITH "TEST" IN NAME ===');
console.log(JSON.stringify(testProducts, null, 2));

await conn.end();
