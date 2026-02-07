import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Pricing tiers based on market research
const pricingTiers = {
  premium: {
    perGram: 5.50,
    retailPerGram: 14.00,
    strains: ['Girl Scout Cookies', 'Gorilla Glue #4', 'Wedding Cake', 'Gelato #33', 'Zkittlez']
  },
  midTier: {
    perGram: 4.50,
    retailPerGram: 11.00,
    strains: ['Blue Dream', 'OG Kush', 'Sour Diesel', 'Jack Herer', 'Purple Haze']
  },
  budget: {
    perGram: 3.50,
    retailPerGram: 9.00,
    strains: ['Granddaddy Purple'] // and others not in premium/mid
  },
  concentrates: {
    perGram: 20.00,
    retailPerGram: 40.00
  },
  edibles: {
    per100mg: 10.00,
    retailPer100mg: 20.00
  },
  vapes: {
    perCart: 25.00,
    retailPerCart: 50.00
  },
  preRolls: {
    perGram: 5.00,
    retailPerGram: 10.00
  }
};

// Get all products
const products = await db.select().from(schema.products);

console.log(`Updating pricing for ${products.length} products...`);

for (const product of products) {
  let newPrice = product.price;
  let retailPrice = product.price * 2; // default 2x markup
  
  // Determine pricing based on category and strain name
  if (product.category === 'flower') {
    // Check if premium strain
    if (pricingTiers.premium.strains.includes(product.name)) {
      newPrice = pricingTiers.premium.perGram;
      retailPrice = pricingTiers.premium.retailPerGram;
    }
    // Check if mid-tier strain
    else if (pricingTiers.midTier.strains.includes(product.name)) {
      newPrice = pricingTiers.midTier.perGram;
      retailPrice = pricingTiers.midTier.retailPerGram;
    }
    // Budget tier
    else {
      newPrice = pricingTiers.budget.perGram;
      retailPrice = pricingTiers.budget.retailPerGram;
    }
  }
  else if (product.category === 'concentrates') {
    newPrice = pricingTiers.concentrates.perGram;
    retailPrice = pricingTiers.concentrates.retailPerGram;
  }
  else if (product.category === 'edibles') {
    newPrice = pricingTiers.edibles.per100mg;
    retailPrice = pricingTiers.edibles.retailPer100mg;
  }
  else if (product.category === 'vapes') {
    newPrice = pricingTiers.vapes.perCart;
    retailPrice = pricingTiers.vapes.retailPerCart;
  }
  else if (product.category === 'pre-rolls') {
    newPrice = pricingTiers.preRolls.perGram;
    retailPrice = pricingTiers.preRolls.retailPerGram;
  }
  
  // Update product with new pricing
  await db.update(schema.products)
    .set({
      price: newPrice,
      retailPrice: retailPrice
    })
    .where(eq(schema.products.id, product.id));
  
  const savings = (retailPrice - newPrice).toFixed(2);
  const savingsPercent = ((savings / retailPrice) * 100).toFixed(0);
  
  console.log(`✓ ${product.name}: $${newPrice}/unit (retail: $${retailPrice}, save $${savings} / ${savingsPercent}%)`);
}

console.log(`\n✅ Successfully updated ${products.length} products with competitive bulk pricing!`);
console.log(`\nPricing Strategy:`);
console.log(`- Premium strains: $${pricingTiers.premium.perGram}/g (vs $${pricingTiers.premium.retailPerGram}/g retail)`);
console.log(`- Mid-tier strains: $${pricingTiers.midTier.perGram}/g (vs $${pricingTiers.midTier.retailPerGram}/g retail)`);
console.log(`- Budget strains: $${pricingTiers.budget.perGram}/g (vs $${pricingTiers.budget.retailPerGram}/g retail)`);
console.log(`- Concentrates: $${pricingTiers.concentrates.perGram}/g (vs $${pricingTiers.concentrates.retailPerGram}/g retail)`);
console.log(`- Vapes: $${pricingTiers.vapes.perCart}/cart (vs $${pricingTiers.vapes.retailPerCart}/cart retail)`);
console.log(`\nAverage savings: 40-60% vs retail dispensaries`);

await connection.end();
