import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { drivers, shipments, gpsTracking, transportationCompanies } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const transportationRouter = router({
  // Get all drivers (admin only)
  getAllDrivers: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const allDrivers = await db.select().from(drivers).orderBy(desc(drivers.createdAt));
      return allDrivers;
    }),

  // Get all shipments (admin only)
  getAllShipments: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const allShipments = await db.select().from(shipments).orderBy(desc(shipments.createdAt));
      return allShipments;
    }),

  // Get GPS tracking for a shipment
  getGpsTracking: protectedProcedure
    .input(z.object({ shipmentId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const tracking = await db
        .select()
        .from(gpsTracking)
        .where(eq(gpsTracking.shipmentId, input.shipmentId))
        .orderBy(desc(gpsTracking.timestamp));
      return tracking;
    }),

  // Register as driver
  registerDriver: publicProcedure
    .input(z.object({
      fullName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      age: z.number(),
      gender: z.enum(["male", "female"]),
      licenseNumber: z.string(),
      licenseState: z.string(),
      vehicleType: z.string(),
      vehicleMake: z.string().optional(),
      vehicleModel: z.string().optional(),
      vehicleYear: z.number().optional(),
      licensePlate: z.string().optional(),
      insuranceProvider: z.string().optional(),
      insurancePolicyNumber: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [driver] = await db.insert(drivers).values({
        ...input,
        status: "pending_approval",
        verified: "no",
        totalDeliveries: 0,
      });
      
      // Send notification to admin
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'New Driver Application',
        content: `${input.fullName} has applied to become a ZAPPAY driver. License: ${input.licenseNumber}, State: ${input.licenseState}. Review at /admin/applications`
      });
      
      return { success: true, driverId: driver.insertId };
    }),

  // Register transportation company
  registerCompany: publicProcedure
    .input(z.object({
      companyName: z.string(),
      businessLicenseNumber: z.string(),
      dotNumber: z.string().optional(),
      mcNumber: z.string().optional(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      insuranceProvider: z.string(),
      insurancePolicyNumber: z.string(),
      insuranceCoverage: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [company] = await db.insert(transportationCompanies).values({
        ...input,
        status: "pending_approval",
        verified: "no",
        totalDrivers: 0,
        totalDeliveries: 0,
      });
      
      // Send notification to admin
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'New Transportation Company Application',
        content: `${input.companyName} has applied to join ZAPPAY. License: ${input.businessLicenseNumber}. Review at /admin/applications`
      });
      
      return { success: true, companyId: company.insertId };
    }),

  // Get shipment tracking info (public - for consumers)
  trackShipment: publicProcedure
    .input(z.object({ trackingNumber: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [shipment] = await db
        .select()
        .from(shipments)
        .where(eq(shipments.trackingNumber, input.trackingNumber));
      
      if (!shipment) {
        throw new Error("Shipment not found");
      }

      // Get latest GPS location
      const [latestLocation] = await db
        .select()
        .from(gpsTracking)
        .where(eq(gpsTracking.shipmentId, shipment.id))
        .orderBy(desc(gpsTracking.timestamp))
        .limit(1);

      return {
        shipment,
        currentLocation: latestLocation || null,
      };
    }),

  // Get all companies (admin only)
  getAllCompanies: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const allCompanies = await db.select().from(transportationCompanies).orderBy(desc(transportationCompanies.createdAt));
      return allCompanies;
    }),

  // Approve driver (admin only)
  approveDriver: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(drivers).set({ status: "active", verified: "yes" }).where(eq(drivers.id, input.id));
      return { success: true };
    }),

  // Reject driver (admin only)
  rejectDriver: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(drivers).set({ status: "inactive" }).where(eq(drivers.id, input.id));
      return { success: true };
    }),

  // Approve company (admin only)
  approveCompany: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(transportationCompanies).set({ status: "active", verified: "yes" }).where(eq(transportationCompanies.id, input.id));
      return { success: true };
    }),

  // Reject company (admin only)
  rejectCompany: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== "Adariusm33@gmail.com") {
        throw new Error("Unauthorized");
      }
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(transportationCompanies).set({ status: "inactive" }).where(eq(transportationCompanies.id, input.id));
      return { success: true };
    }),
});
