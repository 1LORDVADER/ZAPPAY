import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check all orders
const [orders] = await conn.execute('SELECT id, orderId, consumerId, status, total FROM orders ORDER BY id LIMIT 50');
console.log('All orders in database:');
console.log(JSON.stringify(orders, null, 2));

// Check all transactions
const [transactions] = await conn.execute('SELECT id, orderId, amount, status FROM transactions ORDER BY id LIMIT 50');
console.log('\nAll transactions:');
console.log(JSON.stringify(transactions, null, 2));

// Check order items
const [orderItems] = await conn.execute('SELECT id, orderId, productId, quantity FROM orderItems ORDER BY id LIMIT 50');
console.log('\nAll order items:');
console.log(JSON.stringify(orderItems, null, 2));

await conn.end();
