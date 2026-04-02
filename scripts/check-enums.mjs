import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [subTier] = await conn.execute('SHOW COLUMNS FROM farmerSubscriptions WHERE Field = "tier"');
console.log('farmerSubscriptions.tier:', JSON.stringify(subTier, null, 2));

const [fpTier] = await conn.execute('SHOW COLUMNS FROM farmerProfiles WHERE Field = "subscriptionTier"');
console.log('farmerProfiles.subscriptionTier:', JSON.stringify(fpTier, null, 2));

await conn.end();
