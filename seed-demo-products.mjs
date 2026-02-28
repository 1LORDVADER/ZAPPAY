import { drizzle } from 'drizzle-orm/mysql2';
import { products, farmerProfiles } from './drizzle/schema.js';
import fs from 'fs';

const db = drizzle(process.env.DATABASE_URL);

// Load strain descriptions
const strainDescriptions = JSON.parse(fs.readFileSync('./strain-descriptions.json', 'utf-8'));

// Demo farmers from the provided list
const demoFarmers = [
  { name: "Glass House Farms", instagram: "glasshousefarms", state: "CA", tier: "enterprise" },
  { name: "Compound Genetics", instagram: "compoundgeneticsofficial", state: "WA", tier: "premium" },
  { name: "Exotic Genetix", instagram: "exoticgenetix_official", state: "WA", tier: "enterprise" },
  { name: "Emerald Family Farms", instagram: "emerald.family.farms", state: "CA", tier: "premium" },
  { name: "707 Russian River Farms", instagram: "707russianriverfarms", state: "CA", tier: "free" },
  { name: "Calibis Farms", instagram: "calibisfarms", state: "MI", tier: "premium" },
  { name: "Grizzly Farms PDX", instagram: "grizzlyfarmspdx", state: "OR", tier: "free" },
  { name: "Amplified Farms", instagram: "amplifiedfarms", state: "OK", tier: "free" },
];

// Demo products with realistic cannabis data
const demoProducts = [
  {
    name: "Blue Dream",
    strain: "Sativa-Dominant Hybrid",
    category: "flower",
    thcPercentage: "24%",
    cbdPercentage: "0.5%",
    price: 3500, // $35.00
    quantity: 28,
    unit: "gram",
    description: "A balanced hybrid with sweet berry aroma. Perfect for daytime use with uplifting effects.",
    origin: strainDescriptions["blue-dream"].origin,
    lore: strainDescriptions["blue-dream"].lore,
    effects: strainDescriptions["blue-dream"].effects,
    flavor: strainDescriptions["blue-dream"].flavor,
    bestFor: strainDescriptions["blue-dream"].bestFor,
    photos: "/strains/blue-dream.png",
    isFeatured: "yes",
    isSponsored: "yes",
  },
  {
    name: "OG Kush",
    strain: "Indica-Dominant Hybrid",
    category: "flower",
    thcPercentage: "22%",
    cbdPercentage: "0.3%",
    price: 4000,
    quantity: 28,
    unit: "gram",
    description: "Classic strain with earthy, pine, and woody notes. Known for stress relief and relaxation.",
    origin: strainDescriptions["og-kush"].origin,
    lore: strainDescriptions["og-kush"].lore,
    effects: strainDescriptions["og-kush"].effects,
    flavor: strainDescriptions["og-kush"].flavor,
    bestFor: strainDescriptions["og-kush"].bestFor,
    photos: "/strains/og-kush.png",
    isFeatured: "yes",
  },
  {
    name: "Sour Diesel",
    strain: "Sativa",
    category: "flower",
    thcPercentage: "26%",
    cbdPercentage: "0.2%",
    price: 3800,
    quantity: 28,
    unit: "gram",
    description: "Energizing sativa with diesel aroma. Great for creativity and focus.",
    origin: strainDescriptions["sour-diesel"].origin,
    lore: strainDescriptions["sour-diesel"].lore,
    effects: strainDescriptions["sour-diesel"].effects,
    flavor: strainDescriptions["sour-diesel"].flavor,
    bestFor: strainDescriptions["sour-diesel"].bestFor,
    photos: "/strains/sour-diesel.png",
  },
  {
    name: "Granddaddy Purple",
    strain: "Indica",
    category: "flower",
    thcPercentage: "20%",
    cbdPercentage: "0.1%",
    price: 3200,
    quantity: 28,
    unit: "gram",
    description: "Deep purple buds with grape and berry flavors. Perfect for evening relaxation.",
    origin: strainDescriptions["granddaddy-purple"].origin,
    lore: strainDescriptions["granddaddy-purple"].lore,
    effects: strainDescriptions["granddaddy-purple"].effects,
    flavor: strainDescriptions["granddaddy-purple"].flavor,
    bestFor: strainDescriptions["granddaddy-purple"].bestFor,
    photos: "/strains/granddaddy-purple.png",
    isFeatured: "yes",
  },
  {
    name: "Girl Scout Cookies",
    strain: "Hybrid",
    category: "flower",
    thcPercentage: "28%",
    cbdPercentage: "0.4%",
    price: 4500,
    quantity: 28,
    unit: "gram",
    description: "Sweet and earthy with minty notes. Euphoric and relaxing effects.",
    origin: strainDescriptions["girl-scout-cookies"].origin,
    lore: strainDescriptions["girl-scout-cookies"].lore,
    effects: strainDescriptions["girl-scout-cookies"].effects,
    flavor: strainDescriptions["girl-scout-cookies"].flavor,
    bestFor: strainDescriptions["girl-scout-cookies"].bestFor,
    photos: "/strains/girl-scout-cookies.png",
    isSponsored: "yes",
  },
  {
    name: "Gelato #33",
    strain: "Hybrid",
    category: "flower",
    thcPercentage: "25%",
    cbdPercentage: "0.3%",
    price: 4200,
    quantity: 28,
    unit: "gram",
    description: "Dessert-like flavor profile with balanced effects. Popular for its smooth smoke.",
    origin: strainDescriptions["gelato-33"].origin,
    lore: strainDescriptions["gelato-33"].lore,
    effects: strainDescriptions["gelato-33"].effects,
    flavor: strainDescriptions["gelato-33"].flavor,
    bestFor: strainDescriptions["gelato-33"].bestFor,
    photos: "/strains/gelato-33.png",
  },
  {
    name: "Wedding Cake",
    strain: "Indica-Dominant Hybrid",
    category: "flower",
    thcPercentage: "27%",
    cbdPercentage: "0.2%",
    price: 4800,
    quantity: 28,
    unit: "gram",
    description: "Sweet vanilla and earthy flavors. Relaxing with euphoric undertones.",
    origin: strainDescriptions["wedding-cake"].origin,
    lore: strainDescriptions["wedding-cake"].lore,
    effects: strainDescriptions["wedding-cake"].effects,
    flavor: strainDescriptions["wedding-cake"].flavor,
    bestFor: strainDescriptions["wedding-cake"].bestFor,
    photos: "/strains/wedding-cake.png",
  },
  {
    name: "Jack Herer",
    strain: "Sativa-Dominant Hybrid",
    category: "flower",
    thcPercentage: "23%",
    cbdPercentage: "0.5%",
    price: 3600,
    quantity: 28,
    unit: "gram",
    description: "Spicy pine scent with clear-headed effects. Named after the cannabis activist.",
    origin: strainDescriptions["jack-herer"].origin,
    lore: strainDescriptions["jack-herer"].lore,
    effects: strainDescriptions["jack-herer"].effects,
    flavor: strainDescriptions["jack-herer"].flavor,
    bestFor: strainDescriptions["jack-herer"].bestFor,
    photos: "/strains/jack-herer.png",
  },
  {
    name: "Zkittlez",
    strain: "Indica-Dominant Hybrid",
    category: "flower",
    thcPercentage: "21%",
    cbdPercentage: "0.2%",
    price: 3900,
    quantity: 28,
    unit: "gram",
    description: "Fruity candy-like flavor. Calming and mood-lifting effects.",
    origin: strainDescriptions["zkittlez"].origin,
    lore: strainDescriptions["zkittlez"].lore,
    effects: strainDescriptions["zkittlez"].effects,
    flavor: strainDescriptions["zkittlez"].flavor,
    bestFor: strainDescriptions["zkittlez"].bestFor,
    photos: "/strains/zkittlez.png",
  },
  {
    name: "Gorilla Glue #4",
    strain: "Hybrid",
    category: "flower",
    thcPercentage: "29%",
    cbdPercentage: "0.1%",
    price: 5000,
    quantity: 28,
    unit: "gram",
    description: "Extremely potent with earthy and sour notes. Heavy-hitting relaxation.",
    origin: strainDescriptions["gorilla-glue-4"].origin,
    lore: strainDescriptions["gorilla-glue-4"].lore,
    effects: strainDescriptions["gorilla-glue-4"].effects,
    flavor: strainDescriptions["gorilla-glue-4"].flavor,
    bestFor: strainDescriptions["gorilla-glue-4"].bestFor,
    photos: "/strains/gorilla-glue-4.png",
    isFeatured: "yes",
  },
  {
    name: "Live Resin Cart - Blue Dream",
    strain: "Sativa-Dominant Hybrid",
    category: "vapes",
    thcPercentage: "85%",
    cbdPercentage: "1%",
    price: 4500,
    quantity: 1,
    unit: "gram",
    description: "Premium live resin vape cartridge. Full-spectrum terpenes preserved.",
    origin: strainDescriptions["live-resin-vape"].origin,
    lore: strainDescriptions["live-resin-vape"].lore,
    effects: strainDescriptions["live-resin-vape"].effects,
    flavor: strainDescriptions["live-resin-vape"].flavor,
    bestFor: strainDescriptions["live-resin-vape"].bestFor,
    photos: "/strains/vape-cartridge.png",
    isSponsored: "yes",
  },
  {
    name: "Gummy Bears - Mixed Fruit",
    strain: "Hybrid",
    category: "edibles",
    thcPercentage: "10mg",
    cbdPercentage: "0mg",
    price: 2500,
    quantity: 10,
    unit: "pieces",
    description: "Delicious fruit-flavored gummies. 10mg THC per piece, 100mg total.",
    origin: strainDescriptions["gummy-bears"].origin,
    lore: strainDescriptions["gummy-bears"].lore,
    effects: strainDescriptions["gummy-bears"].effects,
    flavor: strainDescriptions["gummy-bears"].flavor,
    bestFor: strainDescriptions["gummy-bears"].bestFor,
    photos: "/strains/gummy-bears.png",
  },
  {
    name: "Shatter - Sour Diesel",
    strain: "Sativa",
    category: "concentrates",
    thcPercentage: "92%",
    cbdPercentage: "0.5%",
    price: 3500,
    quantity: 1,
    unit: "gram",
    description: "Glass-like concentrate with high potency. Perfect for dabbing.",
    origin: strainDescriptions["shatter"].origin,
    lore: strainDescriptions["shatter"].lore,
    effects: strainDescriptions["shatter"].effects,
    flavor: strainDescriptions["shatter"].flavor,
    bestFor: strainDescriptions["shatter"].bestFor,
    photos: "/strains/shatter.png",
  },
  {
    name: "Pre-Roll Pack - OG Kush",
    strain: "Indica-Dominant Hybrid",
    category: "pre-rolls",
    thcPercentage: "22%",
    cbdPercentage: "0.3%",
    price: 2000,
    quantity: 5,
    unit: "pack",
    description: "5 premium pre-rolled joints. Convenient and ready to smoke.",
    origin: strainDescriptions["pre-rolls"].origin,
    lore: strainDescriptions["pre-rolls"].lore,
    effects: strainDescriptions["pre-rolls"].effects,
    flavor: strainDescriptions["pre-rolls"].flavor,
    bestFor: strainDescriptions["pre-rolls"].bestFor,
    photos: "/strains/pre-rolls.png",
  },
  {
    name: "Summer 2025 Harvest - Purple Haze",
    strain: "Sativa",
    category: "flower",
    thcPercentage: "N/A",
    cbdPercentage: "N/A",
    price: 2500,
    quantity: 28,
    unit: "gram",
    description: "Pre-order for summer 2025 harvest. Classic Purple Haze genetics.",
    origin: strainDescriptions["purple-haze"].origin,
    lore: strainDescriptions["purple-haze"].lore,
    effects: strainDescriptions["purple-haze"].effects,
    flavor: strainDescriptions["purple-haze"].flavor,
    bestFor: strainDescriptions["purple-haze"].bestFor,
    photos: "/strains/purple-haze.png",
    isPreOrder: "yes",
  },
];

async function seed() {
  console.log("🌱 Seeding database with demo data...");
  
  try {
    // Create demo farmer users and profiles
    for (let i = 0; i < demoFarmers.length; i++) {
      const farmer = demoFarmers[i];
      const farmerId = i + 100; // Start from ID 100 to avoid conflicts
      
      console.log(`Creating farmer: ${farmer.name}`);
      
      // Insert farmer profile
      await db.insert(farmerProfiles).values({
        userId: farmerId,
        businessName: farmer.name,
        licenseNumber: `LIC-${farmer.state}-${Math.random().toString(36).substring(7).toUpperCase()}`,
        state: farmer.state,
        city: farmer.state === "CA" ? "Los Angeles" : farmer.state === "WA" ? "Seattle" : farmer.state === "OR" ? "Portland" : "Oklahoma City",
        zipCode: "90001",
        bio: `Premium cannabis from ${farmer.name}. Follow us @${farmer.instagram}`,
        verified: "approved",
        subscriptionTier: farmer.tier,
        subscriptionStatus: "active",
      });
      
      // Assign 2-3 products per farmer
      const productsPerFarmer = Math.floor(Math.random() * 2) + 2;
      for (let j = 0; j < productsPerFarmer; j++) {
        const productIndex = (i * 2 + j) % demoProducts.length;
        const product = demoProducts[productIndex];
        
        await db.insert(products).values({
          farmerId,
          ...product,
          status: "active",
        });
      }
    }
    
    console.log("✅ Database seeded successfully!");
    console.log(`Created ${demoFarmers.length} farmers and ${demoProducts.length} products`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
