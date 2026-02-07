import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

/**
 * ZAPPAY Economically Sustainable Pricing Structure
 * Based on cultivation cost research and market analysis
 * 
 * Pricing Tiers:
 * - Premium: $3.75/gram ($13.13/eighth, $1,680/lb) - Saves 71% vs retail
 * - Mid-Tier: $2.90/gram ($10.15/eighth, $1,299/lb) - Saves 75% vs retail
 * - Budget: $2.10/gram ($7.35/eighth, $941/lb) - Saves 76% vs retail
 * 
 * Farmer Economics:
 * - Premium: $1,093-1,193 profit per pound (cost $400-500)
 * - Mid-Tier: $832-932 profit per pound (cost $300-400)
 * - Budget: $592-642 profit per pound (cost $250-300)
 */

const pricingTiers = {
  premium: {
    pricePerGram: 3.75,
    retailPricePerEighth: 45.00,
    strains: [
      'Girl Scout Cookies',
      'Gorilla Glue #4',
      'Wedding Cake',
      'Gelato #33',
      'Purple Haze'
    ]
  },
  midTier: {
    pricePerGram: 2.90,
    retailPricePerEighth: 40.00,
    strains: [
      'Blue Dream',
      'OG Kush',
      'Sour Diesel',
      'Jack Herer',
      'Zkittlez',
      'Granddaddy Purple'
    ]
  },
  budget: {
    pricePerGram: 2.10,
    retailPricePerEighth: 30.00,
    strains: [
      'House Flower',
      'Bulk Flower',
      'Mixed Strain'
    ]
  },
  // Edibles pricing (per unit, not by weight)
  edibles: {
    price: 12.00, // per package
    retailPrice: 25.00
  },
  // Concentrates pricing (per gram)
  concentrates: {
    pricePerGram: 18.00,
    retailPricePerGram: 40.00
  },
  // Pre-rolls pricing (per unit)
  preRolls: {
    price: 6.00, // per pre-roll (typically 1g)
    retailPrice: 12.00
  },
  // Vapes pricing (per cartridge)
  vapes: {
    price: 25.00, // per 1g cartridge
    retailPrice: 50.00
  }
};

// Calculate retail price per gram from eighth price
function calculateRetailPricePerGram(retailPricePerEighth) {
  return retailPricePerEighth / 3.5;
}

// Update all products
const products = await db.select().from(schema.products);

console.log(`Found ${products.length} products to update`);

for (const product of products) {
  let newPrice = product.price;
  let newRetailPrice = product.retailPrice;
  
  // Determine pricing based on category and strain name
  if (product.category === 'flower') {
    // Check if it's a premium strain
    if (pricingTiers.premium.strains.some(s => product.name.includes(s))) {
      newPrice = pricingTiers.premium.pricePerGram;
      newRetailPrice = calculateRetailPricePerGram(pricingTiers.premium.retailPricePerEighth);
    }
    // Check if it's a mid-tier strain
    else if (pricingTiers.midTier.strains.some(s => product.name.includes(s))) {
      newPrice = pricingTiers.midTier.pricePerGram;
      newRetailPrice = calculateRetailPricePerGram(pricingTiers.midTier.retailPricePerEighth);
    }
    // Default to budget pricing
    else {
      newPrice = pricingTiers.budget.pricePerGram;
      newRetailPrice = calculateRetailPricePerGram(pricingTiers.budget.retailPricePerEighth);
    }
  }
  else if (product.category === 'edibles') {
    newPrice = pricingTiers.edibles.price;
    newRetailPrice = pricingTiers.edibles.retailPrice;
  }
  else if (product.category === 'concentrates') {
    newPrice = pricingTiers.concentrates.pricePerGram;
    newRetailPrice = pricingTiers.concentrates.retailPricePerGram;
  }
  else if (product.category === 'pre-rolls') {
    newPrice = pricingTiers.preRolls.price;
    newRetailPrice = pricingTiers.preRolls.retailPrice;
  }
  else if (product.category === 'vapes') {
    newPrice = pricingTiers.vapes.price;
    newRetailPrice = pricingTiers.vapes.retailPrice;
  }
  
  // Update product
  await db.update(schema.products)
    .set({
      price: newPrice,
      retailPrice: newRetailPrice
    })
    .where(eq(schema.products.id, product.id));
  
  const savings = newRetailPrice - newPrice;
  const savingsPercent = ((savings / newRetailPrice) * 100).toFixed(0);
  
  console.log(`✅ Updated ${product.name}:`);
  console.log(`   Category: ${product.category}`);
  console.log(`   ZAPPAY Price: $${newPrice.toFixed(2)}/unit`);
  console.log(`   Retail Price: $${newRetailPrice.toFixed(2)}/unit`);
  console.log(`   Savings: $${savings.toFixed(2)} (${savingsPercent}%)`);
  console.log('');
}

console.log('✅ All products updated with economically sustainable pricing!');
console.log('');
console.log('Summary:');
console.log('- Premium flower: $3.75/gram ($13.13/eighth) - Saves 71% vs retail');
console.log('- Mid-tier flower: $2.90/gram ($10.15/eighth) - Saves 75% vs retail');
console.log('- Budget flower: $2.10/gram ($7.35/eighth) - Saves 76% vs retail');
console.log('- Edibles: $12/package - Saves 52% vs retail');
console.log('- Concentrates: $18/gram - Saves 55% vs retail');
console.log('- Pre-rolls: $6/unit - Saves 50% vs retail');
console.log('- Vapes: $25/cartridge - Saves 50% vs retail');

await connection.end();
