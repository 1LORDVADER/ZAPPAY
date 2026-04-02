import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== PURGING SEEDED FARMER PROFILES ===\n');

// userIds 100-107 are all seeded/demo users (not real Manus OAuth users)
// The only real user is id=1 (Adarius Matthews with Manus openId)
// Delete all farmer profiles belonging to seeded userIds
const [result] = await conn.execute(
  'DELETE FROM farmerProfiles WHERE userId IN (100, 101, 102, 103, 104, 105, 106, 107)'
);
console.log(`Deleted ${result.affectedRows} seeded farmer profiles`);

// Verify
const [remaining] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
console.log(`Remaining farmer profiles: ${remaining[0].total}`);

const [remainingList] = await conn.execute('SELECT id, userId, businessName FROM farmerProfiles ORDER BY id');
console.log('Remaining:', JSON.stringify(remainingList, null, 2));

await conn.end();
