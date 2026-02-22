import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';
import { drivers, shipments, gpsTracking } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Transportation System', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error('Database not available');
  });

  it('should have drivers in the database', async () => {
    const allDrivers = await db.select().from(drivers).limit(5);
    expect(allDrivers.length).toBeGreaterThan(0);
    expect(allDrivers[0]).toHaveProperty('fullName');
    expect(allDrivers[0]).toHaveProperty('email');
    expect(allDrivers[0]).toHaveProperty('licenseNumber');
  });

  it('should have shipments in the database', async () => {
    const allShipments = await db.select().from(shipments).limit(5);
    expect(allShipments.length).toBeGreaterThan(0);
    expect(allShipments[0]).toHaveProperty('trackingNumber');
    expect(allShipments[0]).toHaveProperty('farmerBusinessName');
    expect(allShipments[0]).toHaveProperty('distanceMiles');
  });

  it('should have GPS tracking data for in-transit shipments', async () => {
    const inTransitShipments = await db
      .select()
      .from(shipments)
      .where(eq(shipments.status, 'in_transit'))
      .limit(1);

    if (inTransitShipments.length > 0) {
      const shipmentId = inTransitShipments[0].id;
      const trackingData = await db
        .select()
        .from(gpsTracking)
        .where(eq(gpsTracking.shipmentId, shipmentId));

      expect(trackingData.length).toBeGreaterThan(0);
      expect(trackingData[0]).toHaveProperty('latitude');
      expect(trackingData[0]).toHaveProperty('longitude');
      expect(trackingData[0]).toHaveProperty('timestamp');
    }
  });

  it('should have drivers with valid ages (23-33)', async () => {
    const allDrivers = await db.select().from(drivers);
    allDrivers.forEach(driver => {
      expect(driver.age).toBeGreaterThanOrEqual(23);
      expect(driver.age).toBeLessThanOrEqual(33);
    });
  });

  it('should have shipments with realistic farmer business names', async () => {
    const allShipments = await db.select().from(shipments).limit(5);
    const expectedNames = [
      'Green Valley Cultivation LLC',
      'Pacific Northwest Cannabis Co.',
      'Rocky Mountain Organics',
      'Emerald Triangle Farms',
      'Cascade Cannabis Collective',
      'Golden State Growers',
      'Mile High Cultivation',
      'Willamette Valley Cannabis',
      'Sierra Nevada Farms',
      'Columbia River Cannabis Co.'
    ];

    allShipments.forEach(shipment => {
      expect(expectedNames).toContain(shipment.farmerBusinessName);
    });
  });

  it('should have shipments with calculated transportation fees', async () => {
    const allShipments = await db.select().from(shipments).limit(5);
    allShipments.forEach(shipment => {
      expect(shipment.transportationFee).toBeGreaterThan(0);
      expect(shipment.platformCommission).toBeGreaterThan(0);
      expect(shipment.driverPayout).toBeGreaterThan(0);
      
      // Verify 5.2% commission calculation
      const expectedCommission = Math.floor(shipment.transportationFee * 0.052);
      expect(shipment.platformCommission).toBe(expectedCommission);
      
      // Verify driver payout calculation
      const expectedPayout = shipment.transportationFee - shipment.platformCommission;
      expect(shipment.driverPayout).toBe(expectedPayout);
    });
  });

  it('should have drivers with diverse gender mix', async () => {
    const allDrivers = await db.select().from(drivers);
    const maleCount = allDrivers.filter(d => d.gender === 'male').length;
    const femaleCount = allDrivers.filter(d => d.gender === 'female').length;
    
    expect(maleCount).toBeGreaterThan(0);
    expect(femaleCount).toBeGreaterThan(0);
  });

  it('should have shipments with valid GPS coordinates', async () => {
    const allShipments = await db.select().from(shipments).limit(5);
    allShipments.forEach(shipment => {
      const pickupLat = parseFloat(shipment.pickupLatitude);
      const pickupLng = parseFloat(shipment.pickupLongitude);
      const deliveryLat = parseFloat(shipment.deliveryLatitude);
      const deliveryLng = parseFloat(shipment.deliveryLongitude);

      // Valid US latitude range: 24-50
      expect(pickupLat).toBeGreaterThan(24);
      expect(pickupLat).toBeLessThan(50);
      expect(deliveryLat).toBeGreaterThan(24);
      expect(deliveryLat).toBeLessThan(50);

      // Valid US longitude range: -125 to -65
      expect(pickupLng).toBeGreaterThan(-125);
      expect(pickupLng).toBeLessThan(-65);
      expect(deliveryLng).toBeGreaterThan(-125);
      expect(deliveryLng).toBeLessThan(-65);
    });
  });
});
