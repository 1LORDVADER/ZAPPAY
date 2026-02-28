import { describe, it, expect } from 'vitest';
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
      // submitDispensaryApplication requires: businessName, licenseNumber, licenseState,
      // contactName, email, phone, address, city, state, zipCode, yearsInBusiness
      await caller.applications.submitDispensaryApplication({
        businessName: 'Test Dispensary',
        licenseNumber: 'DISP-12345',
        licenseState: 'CO',
        contactName: 'John Doe',
        email: 'john@testdispensary.com',
        phone: '555-0123',
        address: '123 Main St',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        yearsInBusiness: 5,
        currentSuppliers: 'Various local farms',
        monthlyVolume: '500 lbs',
        targetStrains: 'Blue Dream, OG Kush',
      });

      // MySQL insert returns undefined for the first element; verify by querying
      const applications = await caller.applications.getAllDispensaryApplications();
      const created = applications.find(a => a.businessName === 'Test Dispensary');
      expect(created).toBeDefined();
      expect(created?.status).toBe('pending');
    });

    it('should get all dispensary applications (admin only)', async () => {
      const applications = await caller.applications.getAllDispensaryApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Advertiser Applications', () => {
    it('should submit an advertiser application', async () => {
      // submitAdvertiserApplication requires: companyName, contactName, email, phone,
      // industry, tier, budget, targetAudience, campaignGoals
      await caller.applications.submitAdvertiserApplication({
        companyName: 'Test Cannabis Brand',
        contactName: 'Jane Smith',
        email: 'jane@testbrand.com',
        phone: '555-0456',
        website: 'https://testbrand.com',
        industry: 'Cannabis',
        tier: 'standard',
        budget: 500000, // in cents
        targetAudience: 'Medical patients in Colorado',
        campaignGoals: 'Increase brand awareness and drive sales',
      });

      // MySQL insert returns undefined; verify by querying
      const applications = await caller.applications.getAllAdvertiserApplications();
      const created = applications.find(a => a.companyName === 'Test Cannabis Brand');
      expect(created).toBeDefined();
      expect(created?.status).toBe('pending');
    });

    it('should get all advertiser applications (admin only)', async () => {
      const applications = await caller.applications.getAllAdvertiserApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Application Approval/Rejection', () => {
    it('should approve a dispensary application', async () => {
      // First create an application
      await caller.applications.submitDispensaryApplication({
        businessName: 'Approve Test Dispensary',
        licenseNumber: 'DISP-99999',
        licenseState: 'CO',
        contactName: 'Test User',
        email: 'test@approve.com',
        phone: '555-9999',
        address: '456 Test Ave',
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
        yearsInBusiness: 3,
        currentSuppliers: 'Local farms',
        monthlyVolume: '200 lbs',
      });

      // Find the application we just created
      const applications = await caller.applications.getAllDispensaryApplications();
      const app = applications.find(a => a.businessName === 'Approve Test Dispensary');
      expect(app).toBeDefined();

      // Then approve it
      await caller.applications.approveDispensaryApplication({ id: app!.id });

      // Verify it's approved
      const updatedApplications = await caller.applications.getAllDispensaryApplications();
      const approved = updatedApplications.find(a => a.id === app!.id);
      expect(approved?.status).toBe('approved');
    });

    it('should reject an advertiser application', async () => {
      // First create an application
      await caller.applications.submitAdvertiserApplication({
        companyName: 'Reject Test Brand',
        contactName: 'Test User',
        email: 'test@reject.com',
        phone: '555-8888',
        website: 'https://reject.com',
        industry: 'Cannabis',
        tier: 'basic',
        budget: 100000, // in cents
        targetAudience: 'General consumers',
        campaignGoals: 'Brand awareness',
      });

      // Find the application we just created
      const applications = await caller.applications.getAllAdvertiserApplications();
      const app = applications.find(a => a.companyName === 'Reject Test Brand');
      expect(app).toBeDefined();

      // Then reject it
      await caller.applications.rejectAdvertiserApplication({ id: app!.id });

      // Verify it's rejected
      const updatedApplications = await caller.applications.getAllAdvertiserApplications();
      const rejected = updatedApplications.find(a => a.id === app!.id);
      expect(rejected?.status).toBe('rejected');
    });
  });
});
