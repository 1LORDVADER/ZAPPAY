import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// consumerId=999 is the test runner consumer - all orders from it are test data
// Also delete orders from consumerId=100 (test runner user)
const [result] = await conn.execute(
  'DELETE FROM orders WHERE consumerId IN (999, 100)'
);
console.log(`Deleted ${result.affectedRows} test orders (consumerId 999/100)`);

// Delete any orphaned order items
const [itemResult] = await conn.execute(
  'DELETE FROM orderItems WHERE orderId NOT IN (SELECT id FROM orders)'
);
console.log(`Deleted ${itemResult.affectedRows} orphaned order items`);

// Delete any orphaned transactions  
const [txResult] = await conn.execute(
  'DELETE FROM transactions WHERE orderId NOT IN (SELECT id FROM orders)'
);
console.log(`Deleted ${txResult.affectedRows} orphaned transactions`);

// Verify
const [remaining] = await conn.execute('SELECT COUNT(*) as total FROM orders');
console.log(`\nRemaining orders: ${remaining[0].total}`);

await conn.end();
