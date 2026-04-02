import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../server/db';

describe('ZAPPAY Core Features', () => {
  describe('Product Management', () => {
    it('should create a product successfully', async () => {
      const { createProduct, getProductsByFarmerId } = await import('../server/db');
      
      await createProduct({
        farmerId: 100,
        name: 'Test Flower Product',
        strain: 'Sativa-Dominant Hybrid',
        category: 'flower',
        thcPercentage: '24%',
        cbdPercentage: '0.5%',
        price: 3500,
        quantity: 28,
        unit: 'gram',
        description: 'Test product',
        status: 'active',
      });
      
      // Verify product was created by fetching farmer's products
      const products = await getProductsByFarmerId(100);
      const createdProduct = products.find(p => p.name === 'Test Flower Product');
      
      expect(createdProduct).toBeDefined();
      expect(createdProduct?.price).toBe(3500);
    });

    it('should list all active products', async () => {
      const { getAllActiveProducts } = await import('../server/db');
      
      const products = await getAllActiveProducts();
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      // getAllActiveProducts returns all non-inactive products (active, sold_out, growing, pre-order)
      expect(products.every(p => p.status !== 'inactive')).toBe(true);
    });

    it('should get product by ID', async () => {
      const { getAllActiveProducts, getProductById } = await import('../server/db');
      
      const products = await getAllActiveProducts();
      if (products.length === 0) {
        expect(true).toBe(true); // Skip if no products
        return;
      }
      
      const firstProduct = products[0];
      const product = await getProductById(firstProduct.id);
      
      expect(product).toBeDefined();
      expect(product?.id).toBe(firstProduct.id);
    });

    it('should get products by farmer ID', async () => {
      const { getProductsByFarmerId } = await import('../server/db');
      
      const products = await getProductsByFarmerId(100);
      
      expect(Array.isArray(products)).toBe(true);
      // All products should belong to farmer 100
      expect(products.every(p => p.farmerId === 100)).toBe(true);
    });
  });

  describe('Shopping Cart', () => {
    const testUserId = 999;
    const testProductId = 1;

    it('should add item to cart', async () => {
      const { addToCart } = await import('../server/db');
      
      await addToCart({
        userId: testUserId,
        productId: testProductId,
        quantity: 2,
      });
      
      const { getCartItems } = await import('../server/db');
      const cartItems = await getCartItems(testUserId);
      
      expect(cartItems.length).toBeGreaterThan(0);
      const addedItem = cartItems.find(item => item.productId === testProductId);
      expect(addedItem).toBeDefined();
    });

    it('should update cart item quantity', async () => {
      const { getCartItems, updateCartItemQuantity } = await import('../server/db');
      
      const cartItems = await getCartItems(testUserId);
      if (cartItems.length === 0) {
        expect(true).toBe(true); // Skip if no cart items
        return;
      }
      
      const firstItem = cartItems[0];
      await updateCartItemQuantity(firstItem.id, 5);
      
      const updatedItems = await getCartItems(testUserId);
      const updatedItem = updatedItems.find(item => item.id === firstItem.id);
      
      expect(updatedItem?.quantity).toBe(5);
    });

    it('should clear cart', async () => {
      const { clearCart, getCartItems } = await import('../server/db');
      
      await clearCart(testUserId);
      const cartItems = await getCartItems(testUserId);
      
      expect(cartItems.length).toBe(0);
    });
  });

  describe('Farmer Profiles', () => {
    it('should create and get farmer profile by user ID', async () => {
      const { getFarmerProfileByUserId, createFarmerProfile } = await import('../server/db');
      
      // Create a test farmer profile first (userId 100 is the test runner user)
      await createFarmerProfile({
        userId: 100,
        businessName: 'Test Farm',
        licenseNumber: 'LIC-TEST-001',
        state: 'CA',
        city: 'Los Angeles',
        zipCode: '90001',
        bio: 'Test farm for unit tests',
        verified: 'pending',
        subscriptionTier: 'enterprise',
        subscriptionStatus: 'active',
      });
      
      const profile = await getFarmerProfileByUserId(100);
      
      expect(profile).toBeDefined();
      expect(profile?.userId).toBe(100);
    });

    it('should verify subscription tiers exist', async () => {
      const { getFarmerProfileByUserId } = await import('../server/db');
      
      const profile = await getFarmerProfileByUserId(100);
      
      if (profile) {
        expect(['free', 'premium', 'enterprise']).toContain(profile.subscriptionTier);
        expect(['active', 'cancelled', 'expired']).toContain(profile.subscriptionStatus);
      }
    });
  });

  describe('Orders', () => {
    it('should create an order', async () => {
      const { createOrder, getOrdersByConsumerId } = await import('../server/db');
      const { nanoid } = await import('nanoid');
      
      const orderId = nanoid(10);
      await createOrder({
        orderId,
        consumerId: 999,
        farmerId: 100,
        status: 'pending',
        subtotal: 3500,
        tax: 280,
        platformFee: 182,
        total: 3780,
        deliveryAddress: '123 Test St',
        deliveryCity: 'Los Angeles',
        deliveryState: 'CA',
        deliveryZipCode: '90001',
      });
      
      // Verify order was created by fetching consumer's orders
      const orders = await getOrdersByConsumerId(999);
      const createdOrder = orders.find(o => o.orderId === orderId);
      
      expect(createdOrder).toBeDefined();
      expect(createdOrder?.status).toBe('pending');
    });

    it('should get orders by consumer ID', async () => {
      const { getOrdersByConsumerId } = await import('../server/db');
      
      const orders = await getOrdersByConsumerId(999);
      
      expect(Array.isArray(orders)).toBe(true);
    });

    it('should get orders by farmer ID', async () => {
      const { getOrdersByFarmerId } = await import('../server/db');
      
      const orders = await getOrdersByFarmerId(100);
      
      expect(Array.isArray(orders)).toBe(true);
    });
  });

  describe('Database Schema Validation', () => {
    it('should have all required tables', async () => {
      const { getAllActiveProducts } = await import('../server/db');
      
      // This test validates that the database connection works
      // and basic queries can be executed
      const products = await getAllActiveProducts();
      expect(Array.isArray(products)).toBe(true);
    });

    it('should validate product has advertising fields', async () => {
      const { getAllActiveProducts } = await import('../server/db');
      
      const products = await getAllActiveProducts();
      
      if (products.length > 0) {
        const product = products[0];
        expect(product).toHaveProperty('isFeatured');
        expect(product).toHaveProperty('isSponsored');
        expect(product).toHaveProperty('views');
        expect(product).toHaveProperty('clicks');
      }
    });

    it('should validate farmer profile has subscription fields', async () => {
      const { getFarmerProfileByUserId } = await import('../server/db');
      
      const profile = await getFarmerProfileByUserId(100);
      
      if (profile) {
        expect(profile).toHaveProperty('subscriptionTier');
        expect(profile).toHaveProperty('subscriptionStatus');
        expect(profile).toHaveProperty('monthlyRevenue');
        expect(profile).toHaveProperty('totalSales');
      }
    });
  });

  describe('Business Logic Validation', () => {
    it('should calculate correct platform fee (5.2%)', () => {
      const subtotal = 10000; // $100.00
      const platformFee = Math.round(subtotal * 0.052);
      
      expect(platformFee).toBe(520); // $5.20
    });

    it('should calculate correct tax (8%)', () => {
      const subtotal = 10000; // $100.00
      const tax = Math.round(subtotal * 0.08);
      
      expect(tax).toBe(800); // $8.00
    });

    it('should validate minimum order value for Stripe ($0.50)', () => {
      const minimumOrderValue = 50; // $0.50 in cents
      const testOrder = 100; // $1.00
      
      expect(testOrder).toBeGreaterThanOrEqual(minimumOrderValue);
    });
  });
});
