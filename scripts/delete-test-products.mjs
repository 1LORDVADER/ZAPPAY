import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const conn = await mysql.createConnection(dbUrl);

// Delete all products with "Test" in the name (created by test suite runs)
const [testResult] = await conn.execute(
  "DELETE FROM products WHERE name LIKE '%Test%' OR name LIKE '%test%'"
);
console.log(`Deleted ${testResult.affectedRows} test-named products`);

// Delete all products with farmerId=1 (seeded demo data, not real supplier products)
// farmerId=1 is the placeholder/seed farmer used in demo data
const [seedResult] = await conn.execute(
  "DELETE FROM products WHERE farmerId = 1"
);
console.log(`Deleted ${seedResult.affectedRows} seeded demo products (farmerId=1)`);

// Also delete products with farmerId=100 (test runner farmer)
const [testFarmerResult] = await conn.execute(
  "DELETE FROM products WHERE farmerId = 100"
);
console.log(`Deleted ${testFarmerResult.affectedRows} test runner products (farmerId=100)`);

// Verify what remains
const [remaining] = await conn.execute('SELECT COUNT(*) as total FROM products');
console.log(`\nRemaining products in database: ${remaining[0].total}`);

const [remainingList] = await conn.execute('SELECT id, name, farmerId, status FROM products ORDER BY id');
if (remainingList.length > 0) {
  console.log('\nRemaining products:');
  for (const p of remainingList) {
    console.log(`  id=${p.id} farmerId=${p.farmerId} status=${p.status} name="${p.name}"`);
  }
} else {
  console.log('No products remain — marketplace is clean.');
}

await conn.end();
