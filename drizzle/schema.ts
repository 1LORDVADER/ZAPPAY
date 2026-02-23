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
  subscriptionTier: mysqlEnum("subscriptionTier", ["trial", "standard", "premium", "enterprise"]).default("trial").notNull(), // trial = first year free, standard = $250/month, premium = $1,100/month, enterprise = legacy
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
  quantity: int("quantity").notNull(), // minimum 1 gram
  isMixed: mysqlEnum("isMixed", ["yes", "no"]).default("no").notNull(), // whether this is a mixed strain order
  mixedStrains: text("mixedStrains"), // JSON array of {productId, quantity} for mixed orders (5+ grams total)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// Sales Representatives
export const salesReps = mysqlTable("salesReps", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  referralCode: varchar("referralCode", { length: 20 }).notNull().unique(),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  totalReferrals: int("totalReferrals").default(0).notNull(),
  activeReferrals: int("activeReferrals").default(0).notNull(),
  totalCommissionsEarned: int("totalCommissionsEarned").default(0).notNull(), // in cents
  pendingCommissions: int("pendingCommissions").default(0).notNull(), // in cents
  paidCommissions: int("paidCommissions").default(0).notNull(), // in cents
  stripeAccountId: varchar("stripeAccountId", { length: 255 }), // for payouts
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalesRep = typeof salesReps.$inferSelect;
export type InsertSalesRep = typeof salesReps.$inferInsert;

// Farmer Subscriptions
export const farmerSubscriptions = mysqlTable("farmerSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  farmerId: int("farmerId").notNull(),
  tier: mysqlEnum("tier", ["standard", "premium"]).notNull(), // $250/month or $1,100/month
  status: mysqlEnum("status", ["active", "cancelled", "expired", "trial"]).default("trial").notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "annual"]).default("monthly").notNull(),
  monthlyPrice: int("monthlyPrice").notNull(), // in cents (25000 or 110000)
  trialEndsAt: timestamp("trialEndsAt"), // First year free
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelledAt: timestamp("cancelledAt"),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  referredBy: int("referredBy"), // sales rep ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FarmerSubscription = typeof farmerSubscriptions.$inferSelect;
export type InsertFarmerSubscription = typeof farmerSubscriptions.$inferInsert;

// Referrals
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  salesRepId: int("salesRepId").notNull(),
  farmerId: int("farmerId").notNull(),
  referralCode: varchar("referralCode", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pending", "converted", "expired", "rejected"]).default("pending").notNull(),
  convertedAt: timestamp("convertedAt"),
  subscriptionTier: mysqlEnum("subscriptionTier", ["standard", "premium"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

// Commissions
export const commissions = mysqlTable("commissions", {
  id: int("id").autoincrement().primaryKey(),
  salesRepId: int("salesRepId").notNull(),
  farmerId: int("farmerId").notNull(),
  type: mysqlEnum("type", ["signup_bonus", "recurring_monthly"]).notNull(),
  amount: int("amount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "approved", "paid", "cancelled"]).default("pending").notNull(),
  subscriptionMonth: int("subscriptionMonth"), // 1-12 for recurring commissions
  paidAt: timestamp("paidAt"),
  stripePayoutId: varchar("stripePayoutId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

// Transportation Drivers
export const drivers = mysqlTable("drivers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // optional - if driver has user account
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  age: int("age").notNull(),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).notNull(),
  licenseState: varchar("licenseState", { length: 2 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 100 }).notNull(),
  vehicleMake: varchar("vehicleMake", { length: 100 }),
  vehicleModel: varchar("vehicleModel", { length: 100 }),
  vehicleYear: int("vehicleYear"),
  licensePlate: varchar("licensePlate", { length: 20 }),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }),
  insurancePolicyNumber: varchar("insurancePolicyNumber", { length: 100 }),
  status: mysqlEnum("status", ["active", "inactive", "suspended", "pending_approval"]).default("pending_approval").notNull(),
  verified: mysqlEnum("verified", ["yes", "no"]).default("no").notNull(),
  rating: varchar("rating", { length: 5 }), // e.g. "4.9"
  totalDeliveries: int("totalDeliveries").default(0).notNull(),
  currentLatitude: varchar("currentLatitude", { length: 20 }),
  currentLongitude: varchar("currentLongitude", { length: 20 }),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

// Shipments
export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  driverId: int("driverId").notNull(),
  farmerId: int("farmerId").notNull(),
  farmerBusinessName: varchar("farmerBusinessName", { length: 255 }).notNull(),
  consumerId: int("consumerId").notNull(),
  trackingNumber: varchar("trackingNumber", { length: 100 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled"]).default("pending").notNull(),
  pickupAddress: text("pickupAddress").notNull(),
  pickupCity: varchar("pickupCity", { length: 100 }).notNull(),
  pickupState: varchar("pickupState", { length: 2 }).notNull(),
  pickupZip: varchar("pickupZip", { length: 10 }).notNull(),
  pickupLatitude: varchar("pickupLatitude", { length: 20 }).notNull(),
  pickupLongitude: varchar("pickupLongitude", { length: 20 }).notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  deliveryCity: varchar("deliveryCity", { length: 100 }).notNull(),
  deliveryState: varchar("deliveryState", { length: 2 }).notNull(),
  deliveryZip: varchar("deliveryZip", { length: 10 }).notNull(),
  deliveryLatitude: varchar("deliveryLatitude", { length: 20 }).notNull(),
  deliveryLongitude: varchar("deliveryLongitude", { length: 20 }).notNull(),
  distanceMiles: varchar("distanceMiles", { length: 10 }),
  estimatedDeliveryTime: timestamp("estimatedDeliveryTime"),
  actualPickupTime: timestamp("actualPickupTime"),
  actualDeliveryTime: timestamp("actualDeliveryTime"),
  transportationFee: int("transportationFee").notNull(), // in cents
  platformCommission: int("platformCommission").notNull(), // 5.2% of transportation fee in cents
  driverPayout: int("driverPayout").notNull(), // transportation fee minus commission in cents
  packageWeight: varchar("packageWeight", { length: 20 }),
  packageValue: int("packageValue").notNull(), // in cents
  specialInstructions: text("specialInstructions"),
  signatureRequired: mysqlEnum("signatureRequired", ["yes", "no"]).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

// GPS Tracking History
export const gpsTracking = mysqlTable("gpsTracking", {
  id: int("id").autoincrement().primaryKey(),
  shipmentId: int("shipmentId").notNull(),
  driverId: int("driverId").notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  speed: varchar("speed", { length: 10 }), // in mph
  heading: varchar("heading", { length: 10 }), // compass direction in degrees
  accuracy: varchar("accuracy", { length: 10 }), // GPS accuracy in meters
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type GpsTracking = typeof gpsTracking.$inferSelect;
export type InsertGpsTracking = typeof gpsTracking.$inferInsert;

// Transportation Companies
export const transportationCompanies = mysqlTable("transportationCompanies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // company owner/admin
  companyName: varchar("companyName", { length: 255 }).notNull(),
  businessLicenseNumber: varchar("businessLicenseNumber", { length: 100 }).notNull(),
  dotNumber: varchar("dotNumber", { length: 100 }), // Department of Transportation number
  mcNumber: varchar("mcNumber", { length: 100 }), // Motor Carrier number
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }).notNull(),
  insurancePolicyNumber: varchar("insurancePolicyNumber", { length: 100 }).notNull(),
  insuranceCoverage: int("insuranceCoverage").notNull(), // coverage amount in cents
  status: mysqlEnum("status", ["active", "inactive", "suspended", "pending_approval"]).default("pending_approval").notNull(),
  verified: mysqlEnum("verified", ["yes", "no"]).default("no").notNull(),
  totalDrivers: int("totalDrivers").default(0).notNull(),
  totalDeliveries: int("totalDeliveries").default(0).notNull(),
  rating: varchar("rating", { length: 5 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TransportationCompany = typeof transportationCompanies.$inferSelect;
export type InsertTransportationCompany = typeof transportationCompanies.$inferInsert;

// Sales Rep Applications
export const salesRepApplications = mysqlTable("salesRepApplications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  experience: varchar("experience", { length: 50 }).notNull(),
  linkedinUrl: text("linkedinUrl"),
  resume: text("resume"),
  whyJoin: text("whyJoin").notNull(),
  status: mysqlEnum("status", ["pending_approval", "approved", "rejected"]).default("pending_approval").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalesRepApplication = typeof salesRepApplications.$inferSelect;
export type InsertSalesRepApplication = typeof salesRepApplications.$inferInsert;
