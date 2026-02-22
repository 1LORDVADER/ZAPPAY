import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🚀 Seeding transportation test data...\n');

// Realistic licensed farmer business names (California, Oregon, Washington, Colorado)
const farmerBusinessNames = [
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

// Realistic driver data (diverse ages 23-33, male/female mix)
const drivers = [
  { fullName: 'Marcus Johnson', age: 28, gender: 'male', email: 'marcus.j@transport.com', phone: '555-0101', licenseNumber: 'CA-D8472951', licenseState: 'CA', vehicleType: 'Refrigerated Van' },
  { fullName: 'Sarah Chen', age: 25, gender: 'female', email: 'sarah.chen@transport.com', phone: '555-0102', licenseNumber: 'OR-D3928471', licenseState: 'OR', vehicleType: 'Cargo Van' },
  { fullName: 'James Rodriguez', age: 31, gender: 'male', email: 'james.r@transport.com', phone: '555-0103', licenseNumber: 'WA-D7462819', licenseState: 'WA', vehicleType: 'Box Truck' },
  { fullName: 'Emily Thompson', age: 27, gender: 'female', email: 'emily.t@transport.com', phone: '555-0104', licenseNumber: 'CO-D5839274', licenseState: 'CO', vehicleType: 'Refrigerated Van' },
  { fullName: 'David Kim', age: 29, gender: 'male', email: 'david.kim@transport.com', phone: '555-0105', licenseNumber: 'CA-D9273846', licenseState: 'CA', vehicleType: 'Cargo Van' },
  { fullName: 'Jessica Martinez', age: 26, gender: 'female', email: 'jessica.m@transport.com', phone: '555-0106', licenseNumber: 'OR-D4718293', licenseState: 'OR', vehicleType: 'Box Truck' },
  { fullName: 'Michael Brown', age: 33, gender: 'male', email: 'michael.b@transport.com', phone: '555-0107', licenseNumber: 'WA-D8291746', licenseState: 'WA', vehicleType: 'Refrigerated Van' },
  { fullName: 'Ashley Davis', age: 24, gender: 'female', email: 'ashley.d@transport.com', phone: '555-0108', licenseNumber: 'CO-D3746291', licenseState: 'CO', vehicleType: 'Cargo Van' },
  { fullName: 'Christopher Lee', age: 30, gender: 'male', email: 'chris.lee@transport.com', phone: '555-0109', licenseNumber: 'CA-D6482937', licenseState: 'CA', vehicleType: 'Box Truck' },
  { fullName: 'Amanda Wilson', age: 23, gender: 'female', email: 'amanda.w@transport.com', phone: '555-0110', licenseNumber: 'OR-D1928374', licenseState: 'OR', vehicleType: 'Refrigerated Van' },
];

// GPS coordinates for major cannabis-legal cities
const locations = [
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, zip: '90001' },
  { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194, zip: '94102' },
  { city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784, zip: '97201' },
  { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321, zip: '98101' },
  { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903, zip: '80202' },
  { city: 'Sacramento', state: 'CA', lat: 38.5816, lng: -121.4944, zip: '95814' },
  { city: 'Eugene', state: 'OR', lat: 44.0521, lng: -123.0868, zip: '97401' },
  { city: 'Spokane', state: 'WA', lat: 47.6588, lng: -117.4260, zip: '99201' },
  { city: 'Boulder', state: 'CO', lat: 40.0150, lng: -105.2705, zip: '80301' },
  { city: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712, zip: '94601' },
];

try {
  // Insert drivers
  console.log('📦 Inserting drivers...');
  for (const driver of drivers) {
    await connection.execute(
      `INSERT INTO drivers (fullName, email, phone, age, gender, licenseNumber, licenseState, vehicleType, status, verified, totalDeliveries, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 'yes', ?, NOW(), NOW())`,
      [
        driver.fullName,
        driver.email,
        driver.phone,
        driver.age,
        driver.gender,
        driver.licenseNumber,
        driver.licenseState,
        driver.vehicleType,
        Math.floor(Math.random() * 50) + 10 // 10-60 deliveries
      ]
    );
  }
  console.log(`✅ Inserted ${drivers.length} drivers\n`);

  // Get driver IDs
  const [driverRows] = await connection.execute(`SELECT id FROM drivers ORDER BY id DESC LIMIT ${drivers.length}`);
  const driverIds = driverRows.map(row => row.id);

  // Insert high-value shipments
  console.log('📦 Inserting shipments...');
  const shipmentStatuses = ['in_transit', 'in_transit', 'in_transit', 'delivered', 'picked_up'];
  
  for (let i = 0; i < 15; i++) {
    const pickup = locations[Math.floor(Math.random() * locations.length)];
    let delivery = locations[Math.floor(Math.random() * locations.length)];
    while (delivery.city === pickup.city) {
      delivery = locations[Math.floor(Math.random() * locations.length)];
    }

    const driverId = driverIds[Math.floor(Math.random() * driverIds.length)];
    const farmerName = farmerBusinessNames[Math.floor(Math.random() * farmerBusinessNames.length)];
    const status = shipmentStatuses[Math.floor(Math.random() * shipmentStatuses.length)];
    
    // Calculate distance (rough approximation)
    const distanceMiles = Math.floor(
      Math.sqrt(
        Math.pow((delivery.lat - pickup.lat) * 69, 2) + 
        Math.pow((delivery.lng - pickup.lng) * 54.6, 2)
      )
    );

    const trackingNumber = `ZAP${Date.now()}${i}`.slice(0, 16);
    const packageValue = Math.floor(Math.random() * 4500000) + 1500000; // $15k-$60k in cents
    const transportationFee = Math.floor(distanceMiles * 2.5 * 100); // $2.50/mile in cents
    const platformCommission = Math.floor(transportationFee * 0.052); // 5.2%
    const driverPayout = transportationFee - platformCommission;

    await connection.execute(
      `INSERT INTO shipments (
        orderId, driverId, farmerId, farmerBusinessName, consumerId,
        trackingNumber, status, packageValue,
        pickupAddress, pickupCity, pickupState, pickupZip, pickupLatitude, pickupLongitude,
        deliveryAddress, deliveryCity, deliveryState, deliveryZip, deliveryLatitude, deliveryLongitude,
        distanceMiles, estimatedDeliveryTime, actualDeliveryTime,
        transportationFee, platformCommission, driverPayout,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        1000 + i, // orderId
        driverId,
        100 + Math.floor(Math.random() * 10), // farmerId
        farmerName,
        200 + Math.floor(Math.random() * 50), // consumerId
        trackingNumber,
        status,
        packageValue,
        `${Math.floor(Math.random() * 9999)} ${pickup.city} Blvd`,
        pickup.city,
        pickup.state,
        pickup.zip,
        pickup.lat.toString(),
        pickup.lng.toString(),
        `${Math.floor(Math.random() * 9999)} ${delivery.city} Ave`,
        delivery.city,
        delivery.state,
        delivery.zip,
        delivery.lat.toString(),
        delivery.lng.toString(),
        distanceMiles.toString(),
        new Date(Date.now() + Math.random() * 86400000 * 2), // 0-2 days from now
        status === 'delivered' ? new Date(Date.now() - Math.random() * 86400000) : null,
        transportationFee,
        platformCommission,
        driverPayout
      ]
    );

    // Insert GPS tracking points for in_transit shipments
    if (status === 'in_transit' || status === 'picked_up') {
      const numTrackingPoints = Math.floor(Math.random() * 5) + 3; // 3-7 tracking points
      for (let j = 0; j < numTrackingPoints; j++) {
        const progress = j / numTrackingPoints;
        const currentLat = pickup.lat + (delivery.lat - pickup.lat) * progress;
        const currentLng = pickup.lng + (delivery.lng - pickup.lng) * progress;
        
        await connection.execute(
          `INSERT INTO gpsTracking (shipmentId, driverId, latitude, longitude, timestamp, speed, heading)
           VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?)`,
          [
            driverId,
            currentLat.toString(),
            currentLng.toString(),
            new Date(Date.now() - (numTrackingPoints - j) * 3600000), // Hourly updates
            (Math.floor(Math.random() * 30) + 45).toString(), // 45-75 mph
            (Math.floor(Math.random() * 360)).toString() // 0-360 degrees
          ]
        );
      }
    }
  }
  console.log('✅ Inserted 15 shipments with GPS tracking\n');

  console.log('🎉 Transportation test data seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${drivers.length} drivers (ages 23-33, diverse gender mix)`);
  console.log('   - 15 high-value shipments ($15k-$60k each)');
  console.log('   - Real farmer business names from CA, OR, WA, CO');
  console.log('   - GPS tracking for in-transit shipments');
  console.log('   - Distance calculations between cities');
  console.log('\n🔗 Access admin dashboard at: /admin/transportation');
  console.log('   (Login required: Adarium33@gmail.com)\n');

} catch (error) {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
} finally {
  await connection.end();
}
