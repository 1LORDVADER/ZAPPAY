import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Check current state
const [products] = await conn.execute('SELECT COUNT(*) as total FROM products');
const [farmers] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
console.log('Products:', products[0].total);
console.log('Farmer profiles:', farmers[0].total);

// The demo farmers that were deleted - restore them
// These are the real named farms that serve as the marketplace's initial supplier roster
const demoFarmers = [
  { userId: 100, businessName: "Glass House Farms", licenseNumber: "LIC-CA-BOQ3N", state: "CA", city: "Los Angeles", zipCode: "90001", bio: "Premium cannabis from Glass House Farms. Follow us @glasshousefarms", verified: "approved", subscriptionTier: "enterprise", subscriptionStatus: "active" },
  { userId: 101, businessName: "Compound Genetics", licenseNumber: "LIC-WA-0QISED", state: "WA", city: "Seattle", zipCode: "90001", bio: "Premium cannabis from Compound Genetics. Follow us @compoundgeneticsofficial", verified: "approved", subscriptionTier: "premium", subscriptionStatus: "active" },
  { userId: 102, businessName: "Exotic Genetix", licenseNumber: "LIC-WA-GR93W", state: "WA", city: "Seattle", zipCode: "90001", bio: "Premium cannabis from Exotic Genetix. Follow us @exoticgenetix_official", verified: "approved", subscriptionTier: "enterprise", subscriptionStatus: "active" },
  { userId: 103, businessName: "Emerald Family Farms", licenseNumber: "LIC-CA-IOMZYS", state: "CA", city: "Los Angeles", zipCode: "90001", bio: "Premium cannabis from Emerald Family Farms. Follow us @emerald.family.farms", verified: "approved", subscriptionTier: "premium", subscriptionStatus: "active" },
  { userId: 104, businessName: "707 Russian River Farms", licenseNumber: "LIC-CA-9ILWXE", state: "CA", city: "Los Angeles", zipCode: "90001", bio: "Premium cannabis from 707 Russian River Farms. Follow us @707russianriverfarms", verified: "approved", subscriptionTier: "free", subscriptionStatus: "active" },
  { userId: 105, businessName: "Calibis Farms", licenseNumber: "LIC-MI-Q70Q99", state: "MI", city: "Detroit", zipCode: "48201", bio: "Premium cannabis from Calibis Farms. Follow us @calibisfarms", verified: "approved", subscriptionTier: "premium", subscriptionStatus: "active" },
  { userId: 106, businessName: "Grizzly Farms PDX", licenseNumber: "LIC-OR-7QJC3I", state: "OR", city: "Portland", zipCode: "97201", bio: "Premium cannabis from Grizzly Farms PDX. Follow us @grizzlyfarmspdx", verified: "approved", subscriptionTier: "free", subscriptionStatus: "active" },
  { userId: 107, businessName: "Amplified Farms", licenseNumber: "LIC-OK-OQETHF", state: "OK", city: "Oklahoma City", zipCode: "73101", bio: "Premium cannabis from Amplified Farms. Follow us @amplifiedfarms", verified: "approved", subscriptionTier: "free", subscriptionStatus: "active" },
];

for (const farmer of demoFarmers) {
  // Check if already exists
  const [existing] = await conn.execute('SELECT id FROM farmerProfiles WHERE userId = ?', [farmer.userId]);
  if (existing.length > 0) {
    console.log(`Skipping ${farmer.businessName} (already exists)`);
    continue;
  }
  
  await conn.execute(
    `INSERT INTO farmerProfiles (userId, businessName, licenseNumber, state, city, zipCode, bio, verified, subscriptionTier, subscriptionStatus, monthlyRevenue, totalSales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
    [farmer.userId, farmer.businessName, farmer.licenseNumber, farmer.state, farmer.city, farmer.zipCode, farmer.bio, farmer.verified, farmer.subscriptionTier, farmer.subscriptionStatus]
  );
  console.log(`Restored: ${farmer.businessName}`);
}

// Final count
const [finalFarmers] = await conn.execute('SELECT COUNT(*) as total FROM farmerProfiles');
const [finalProducts] = await conn.execute('SELECT COUNT(*) as total FROM products');
console.log(`\nFinal state: ${finalFarmers[0].total} farmer profiles, ${finalProducts[0].total} products`);

await conn.end();
