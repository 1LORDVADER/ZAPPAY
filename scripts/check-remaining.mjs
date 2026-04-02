import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [farmers] = await conn.execute('SELECT id, userId, businessName FROM farmerProfiles ORDER BY id');
console.log('Remaining farmer profiles:');
console.log(JSON.stringify(farmers, null, 2));

const [products] = await conn.execute('SELECT id, name, farmerId FROM products ORDER BY id');
console.log('\nRemaining products:');
console.log(JSON.stringify(products, null, 2));

await conn.end();
