import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "farmer", "consumer", "dispensary", "transporter"]).default("consumer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Farmer Profiles
export const farmerProfiles = mysqlTable("farmerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zipCode", { length: 10 }),
  bio: text("bio"),
  verified: mysqlEnum("verified", ["pending", "approved", "rejected"]).default("pending").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium", "enterprise"]).default("free").notNull(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "cancelled", "expired"]).default("active").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  monthlyRevenue: int("monthlyRevenue").default(0).notNull(), // in cents
  totalSales: int("totalSales").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FarmerProfile = typeof farmerProfiles.$inferSelect;
export type InsertFarmerProfile = typeof farmerProfiles.$inferInsert;

// Consumer Profiles
export const consumerProfiles = mysqlTable("consumerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deliveryAddress: text("deliveryAddress"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  preferences: text("preferences"),
  ageVerified: mysqlEnum("ageVerified", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsumerProfile = typeof consumerProfiles.$inferSelect;
export type InsertConsumerProfile = typeof consumerProfiles.$inferInsert;

// Products
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  farmerId: int("farmerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  strain: varchar("strain", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["flower", "edibles", "concentrates", "pre-rolls", "vapes", "other"]).notNull(),
  thcPercentage: varchar("thcPercentage", { length: 10 }),
  cbdPercentage: varchar("cbdPercentage", { length: 10 }),
  price: int("price").notNull(), // stored in cents - ZAPPAY price
  retailPrice: int("retailPrice"), // typical retail dispensary price in cents (optional)
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 20 }).default("gram").notNull(),
  description: text("description"),
  origin: text("origin"),
  lore: text("lore"),
  effects: text("effects"),
  flavor: text("flavor"),
  bestFor: text("bestFor"),
  photos: text("photos"), // JSON array of S3 URLs
  rating: varchar("rating", { length: 5 }), // e.g. "4.8" - community rating
  status: mysqlEnum("status", ["active", "sold_out", "inactive", "growing"]).default("active").notNull(),
  isPreOrder: mysqlEnum("isPreOrder", ["yes", "no"]).default("no").notNull(),
  estimatedHarvestDate: timestamp("estimatedHarvestDate"),
  isFeatured: mysqlEnum("isFeatured", ["yes", "no"]).default("no").notNull(),
  isSponsored: mysqlEnum("isSponsored", ["yes", "no"]).default("no").notNull(),
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Orders
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderId: varchar("orderId", { length: 50 }).notNull().unique(),
  consumerId: int("consumerId").notNull(),
  farmerId: int("farmerId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  subtotal: int("subtotal").notNull(), // in cents
  tax: int("tax").notNull(), // in cents
  platformFee: int("platformFee").notNull(), // 5.2% in cents
  total: int("total").notNull(), // in cents
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryCity: varchar("deliveryCity", { length: 100 }),
  deliveryState: varchar("deliveryState", { length: 2 }),
  deliveryZipCode: varchar("deliveryZipCode", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productStrain: varchar("productStrain", { length: 255 }),
  quantity: int("quantity").notNull(),
  pricePerUnit: int("pricePerUnit").notNull(), // in cents
  total: int("total").notNull(), // in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Transactions
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  amount: int("amount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Reviews
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  consumerId: int("consumerId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Shopping Cart
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;