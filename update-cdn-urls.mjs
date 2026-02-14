import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const cdnUrls = JSON.parse(fs.readFileSync('./strain-cdn-urls.json', 'utf-8'));

const mapping = {
  "/strains/blue-dream.png": cdnUrls["blue-dream"],
  "/strains/gelato-33.png": cdnUrls["gelato-33"],
  "/strains/girl-scout-cookies.png": cdnUrls["girl-scout-cookies"],
  "/strains/gorilla-glue-4.png": cdnUrls["gorilla-glue-4"],
  "/strains/granddaddy-purple.png": cdnUrls["granddaddy-purple"],
  "/strains/gummy-bears.png": cdnUrls["gummy-bears"],
  "/strains/jack-herer.png": cdnUrls["jack-herer"],
  "/strains/og-kush.png": cdnUrls["og-kush"],
  "/strains/pre-rolls.png": cdnUrls["pre-rolls"],
  "/strains/purple-haze.png": cdnUrls["purple-haze"],
  "/strains/shatter.png": cdnUrls["shatter"],
  "/strains/sour-diesel.png": cdnUrls["sour-diesel"],
  "/strains/vape-cartridge.png": cdnUrls["vape-cartridge"],
  "/strains/wedding-cake.png": cdnUrls["wedding-cake"],
  "/strains/zkittlez.png": cdnUrls["zkittlez"]
};

console.log("Updating product images to CDN URLs...");

for (const [localPath, cdnUrl] of Object.entries(mapping)) {
  const result = await db.update(products)
    .set({ photos: cdnUrl })
    .where(eq(products.photos, localPath));
  console.log(`Updated ${localPath} -> ${cdnUrl}`);
}

console.log("✅ All product images updated to CDN URLs!");
await connection.end();
