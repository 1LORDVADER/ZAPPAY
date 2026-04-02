import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== PURGING ALL SEEDED/TEST DATA FROM DATABASE ===\n');

// 1. Delete ALL remaining products (all are seeded - no real suppliers have listed yet)
const [p1] = await conn.execute('DELETE FROM products');
console.log(`Deleted ${p1.affectedRows} products`);

// 2. Delete seeded farmer profiles (ids 1-20 and 30001-30010 range are all seeded)
// Keep only profiles belonging to real authenticated users (those with actual Manus OAuth IDs)
// Real users have openId that is a Manus OAuth string, not a simple integer
const [fp1] = await conn.execute(
  "DELETE FROM farmerProfiles WHERE userId IN (SELECT id FROM users WHERE openId REGEXP '^[0-9]+$')"
);
console.log(`Deleted ${fp1.affectedRows} seeded farmer profiles`);

// 3. Delete seeded users (those with numeric-only openIds are test/seeded users)
const [u1] = await conn.execute(
  "DELETE FROM users WHERE openId REGEXP '^[0-9]+$'"
);
console.log(`Deleted ${u1.affectedRows} seeded users`);

// 4. Verify what remains
const [remainingProducts] = await conn.execute('SELECT COUNT(*) as total FROM products');
const [remainingFarmers] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
const [remainingUsers] = await conn.execute('SELECT COUNT(*) as total FROM users');

console.log(`\n=== REMAINING COUNTS ===`);
console.log(`Products: ${remainingProducts[0].total}`);
console.log(`Farmer profiles: ${remainingFarmers[0].total}`);
console.log(`Users: ${remainingUsers[0].total}`);

// Show remaining users so we can verify real users are intact
const [realUsers] = await conn.execute('SELECT id, name, email, openId, role FROM users ORDER BY id');
console.log('\nRemaining users:');
console.log(JSON.stringify(realUsers, null, 2));

await conn.end();
