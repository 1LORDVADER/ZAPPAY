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
      // submitDispensaryApplication uses db.insert which returns undefined on MySQL
      await expect(
        caller.applications.submitDispensaryApplication({
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
          targetStrains: 'OG Kush, Gorilla Glue',
        })
      ).resolves.not.toThrow();
    });

    it('should get all dispensary applications (admin only)', async () => {
      const applications = await caller.applications.getAllDispensaryApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Advertiser Applications', () => {
    it('should submit an advertiser application', async () => {
      // submitAdvertiserApplication uses db.insert which returns undefined on MySQL
      await expect(
        caller.applications.submitAdvertiserApplication({
          companyName: 'Test Cannabis Brand',
          contactName: 'Jane Smith',
          email: 'jane@testbrand.com',
          phone: '555-0456',
          website: 'https://testbrand.com',
          industry: 'Cannabis',
          tier: 'basic',
          budget: 5000,
          targetAudience: 'Medical patients in Colorado',
          campaignGoals: 'Increase brand awareness and drive sales',
          adCreativeUrl: null,
        })
      ).resolves.not.toThrow();
    });

    it('should get all advertiser applications (admin only)', async () => {
      const applications = await caller.applications.getAllAdvertiserApplications();
      expect(Array.isArray(applications)).toBe(true);
    });
  });

  describe('Application Approval/Rejection', () => {
    it('should approve a dispensary application', async () => {
      // Create an application first
      await caller.applications.submitDispensaryApplication({
        businessName: 'Approve Test Dispensary',
        licenseNumber: 'DISP-99999',
        licenseState: 'CO',
        contactName: 'Test User',
        email: 'test-approve@zappay.com',
        phone: '555-9999',
        address: '456 Test Ave',
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
        yearsInBusiness: 3,
        currentSuppliers: 'Local farms',
        monthlyVolume: '200 lbs',
        targetStrains: 'OG Kush',
      });

      // Find the application we just created
      const applications = await caller.applications.getAllDispensaryApplications();
      const created = applications.find(a => a.email === 'test-approve@zappay.com');
      expect(created).toBeDefined();

      if (created) {
        // Approve it
        const approveResult = await caller.applications.approveDispensaryApplication({ id: created.id });
        expect(approveResult).toHaveProperty('success', true);

        // Verify it's approved
        const updated = await caller.applications.getAllDispensaryApplications();
        const approved = updated.find(a => a.id === created.id);
        expect(approved?.status).toBe('approved');
      }
    });

    it('should reject an advertiser application', async () => {
      // Create an application first
      await caller.applications.submitAdvertiserApplication({
        companyName: 'Reject Test Brand',
        contactName: 'Test User',
        email: 'test-reject@zappay.com',
        phone: '555-8888',
        website: 'https://reject.com',
        industry: 'Cannabis',
        tier: 'basic',
        budget: 1000,
        targetAudience: 'General consumers',
        campaignGoals: 'Brand awareness',
        adCreativeUrl: null,
      });

      // Find the application we just created
      const applications = await caller.applications.getAllAdvertiserApplications();
      const created = applications.find(a => a.email === 'test-reject@zappay.com');
      expect(created).toBeDefined();

      if (created) {
        // Reject it
        const rejectResult = await caller.applications.rejectAdvertiserApplication({ id: created.id });
        expect(rejectResult).toHaveProperty('success', true);

        // Verify it's rejected
        const updated = await caller.applications.getAllAdvertiserApplications();
        const rejected = updated.find(a => a.id === created.id);
        expect(rejected?.status).toBe('rejected');
      }
    });
  });
});
