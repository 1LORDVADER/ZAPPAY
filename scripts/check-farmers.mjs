import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check what columns farmerProfiles has
const [cols] = await conn.execute('DESCRIBE farmerProfiles');
console.log('farmerProfiles columns:', cols.map(c => c.Field));

// Check farmer profiles for the remaining products
const [farmers] = await conn.execute(
  'SELECT * FROM farmerProfiles WHERE id IN (101, 102, 103, 104)'
);
console.log('\nFarmer profiles for remaining products:');
console.log(JSON.stringify(farmers, null, 2));

// Also check if there are any seeded farmer profiles
const [allFarmers] = await conn.execute(
  'SELECT * FROM farmerProfiles ORDER BY id LIMIT 20'
);
console.log('\nAll farmer profiles (first 20):');
console.log(JSON.stringify(allFarmers, null, 2));

await conn.end();
