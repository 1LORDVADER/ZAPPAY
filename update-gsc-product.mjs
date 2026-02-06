import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Premium Girl Scout Cookies image URL
const premiumImageUrl = 'https://private-us-east-1.manuscdn.com/sessionFile/BPBio4gvpoM5hxRuK31E4R/sandbox/dtlu291kWsU4aNO5IqZG9z-img-1_1770338154000_na1fn_Z2lybC1zY291dC1jb29raWVzLXByZW1pdW0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvQlBCaW80Z3Zwb001aHhSdUszMUU0Ui9zYW5kYm94L2R0bHUyOTFrV3NVNGFOTzVJcVpHOXotaW1nLTFfMTc3MDMzODE1NDAwMF9uYTFmbl9aMmx5YkMxelkyOTFkQzFqYjI5cmFXVnpMWEJ5WlcxcGRXMC5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IPKhKV0QO-SbhmPc8PeDCfOJhYiDXznfq6sLNkviCO1JSnU2ZXCF3X6PgjEr4Pw9OLaKkVcxMvwyhwtdh0HD1kEJnmYYUxKHOsTeYrWIa7bdxEskbuf2WjhMPrHS1sQ4z3cMrRr8Yl1Pyz3G6UBamJAuAW-QJ11EpXpQ~JUKdzQQz5oRZZ-zLMdu7ECYN0L1oIHAcHAk-xxeBYynDnOmcztf~en9Z0hXN-09JzcNzUu9sZK9OGDeFvMcRY~7M3AMSSZYPD2-lQOxBAOA~-MJF~bpw4qiXyTZy0LFzicv~NdaA3W14LBc3lYbT4oM2K55ZhaYo8~Q5~9Dgn3VebiT-A__';

// Update all Girl Scout Cookies products
const result = await db.update(products)
  .set({
    photos: JSON.stringify([premiumImageUrl]),
    retailPrice: 6500, // $65.00 typical retail price
    isFeatured: 'yes' // Make it featured
  })
  .where(eq(products.name, 'Girl Scout Cookies'));

console.log(`Updated ${result[0].affectedRows} Girl Scout Cookies products with premium image and retail pricing`);

await connection.end();
