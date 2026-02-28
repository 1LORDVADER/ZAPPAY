import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from './routers';
import type { Context } from './_core/context';

describe('Applications Router', () => {
  const mockContext: Context = {
    user: {
      id: 1,
      openId: 'test-admin',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
    },
    req: {} as any,
    res: {} as any,
  };

  const caller = appRouter.createCaller(mockContext);

  describe('Dispensary Applications', () => {
    it('should submit a dispensary application', async () => {
      const result = await caller.applications.submitDispensaryApplication({
        businessName: 'Test Dispensary',
        licenseNumber: 'DISP-12345',
        contactName: 'John Doe',
        email: 'john@testdispensary.com',
        phone: '555-0123',
        address: '123 Main St',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        yearsInBusiness: 5,
        currentSuppliers: 'Various local farms',
        estimatedMonthlyVolume: '500 lbs',
        reasonForJoining: 'Looking for better pricing and variety',
      });

      expect(result).toHaveProperty('id');
      expect(result.businessName).toBe('Test Dispensary');
      expect(result.status).toBe('pending');
    });

    it('should get all dispensary applications (admin only)', async () => {
      const applications = await caller.applications.getAllDispensaryApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Advertiser Applications', () => {
    it('should submit an advertiser application', async () => {
      const result = await caller.applications.submitAdvertiserApplication({
        companyName: 'Test Cannabis Brand',
        contactName: 'Jane Smith',
        email: 'jane@testbrand.com',
        phone: '555-0456',
        website: 'https://testbrand.com',
        advertisingBudget: '$5000/month',
        targetAudience: 'Medical patients in Colorado',
        campaignGoals: 'Increase brand awareness and drive sales',
        previousAdvertising: 'Social media and local events',
      });

      expect(result).toHaveProperty('id');
      expect(result.companyName).toBe('Test Cannabis Brand');
      expect(result.status).toBe('pending');
    });

    it('should get all advertiser applications (admin only)', async () => {
      const applications = await caller.applications.getAllAdvertiserApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Application Approval/Rejection', () => {
    it('should approve a dispensary application', async () => {
      // First create an application
      const app = await caller.applications.submitDispensary({
        businessName: 'Approve Test Dispensary',
        licenseNumber: 'DISP-99999',
        contactName: 'Test User',
        email: 'test@approve.com',
        phone: '555-9999',
        address: '456 Test Ave',
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
        yearsInBusiness: 3,
        currentSuppliers: 'Local farms',
        estimatedMonthlyVolume: '200 lbs',
        reasonForJoining: 'Better prices',
      });

      // Then approve it
      await caller.applications.approveDispensaryApplication({ id: app.id });

      // Verify it's approved
      const applications = await caller.applications.getAllDispensaryApplications();
      const approved = applications.find(a => a.id === app.id);
      expect(approved?.status).toBe('approved');
    });

    it('should reject an advertiser application', async () => {
      // First create an application
      const app = await caller.applications.submitAdvertiser({
        companyName: 'Reject Test Brand',
        contactName: 'Test User',
        email: 'test@reject.com',
        phone: '555-8888',
        website: 'https://reject.com',
        advertisingBudget: '$1000/month',
        targetAudience: 'General consumers',
        campaignGoals: 'Brand awareness',
        previousAdvertising: 'None',
      });

      // Then reject it
      await caller.applications.rejectAdvertiserApplication({ id: app.id });

      // Verify it's rejected
      const applications = await caller.applications.getAllAdvertiserApplications();
      const rejected = applications.find(a => a.id === app.id);
      expect(rejected?.status).toBe('rejected');
    });
  });
});
