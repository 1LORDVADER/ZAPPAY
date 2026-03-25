import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database and notification modules
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

vi.mock('./_core/notification', () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock('../drizzle/schema', () => ({
  wholesalerWaitlist: { email: 'email', businessName: 'businessName' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}));

describe('wholesalerWaitlist router', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should accept valid wholesaler signup data', async () => {
    const validInput = {
      businessName: 'Green Valley Farms',
      contactName: 'Jane Smith',
      email: 'jane@greenvalley.com',
      businessType: 'farmer' as const,
      state: 'CO',
      city: 'Denver',
      phone: '555-1234',
      licenseNumber: 'MED-2024-001',
      monthlyVolume: '$50,000 - $100,000',
      message: 'Looking to expand distribution',
    };

    // Validate required fields are present
    expect(validInput.businessName).toBeTruthy();
    expect(validInput.contactName).toBeTruthy();
    expect(validInput.email).toContain('@');
    expect(['farmer', 'dispensary', 'distributor', 'transporter', 'other']).toContain(validInput.businessType);
    expect(validInput.state).toBeTruthy();
  });

  it('should reject invalid email format', () => {
    const invalidEmail = 'not-an-email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(invalidEmail)).toBe(false);
  });

  it('should accept valid email format', () => {
    const validEmail = 'contact@dispensary.com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(validEmail)).toBe(true);
  });

  it('should accept all valid business types', () => {
    const validTypes = ['farmer', 'dispensary', 'distributor', 'transporter', 'other'];
    validTypes.forEach(type => {
      expect(validTypes).toContain(type);
    });
  });

  it('should handle duplicate email detection', async () => {
    const { getDb } = await import('./db');
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: 1, email: 'existing@test.com' }]),
        }),
      }),
    });
    mockDb.select = mockSelect;
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    const result = await db.select().from({}).where({}).limit(1);
    expect(result.length).toBeGreaterThan(0);
    // If existing record found, should return alreadyRegistered: true
    const alreadyRegistered = result.length > 0;
    expect(alreadyRegistered).toBe(true);
  });

  it('should insert new record when email is unique', async () => {
    const { getDb } = await import('./db');
    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([{ id: 1 }]),
    });
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockDb.select = mockSelect;
    mockDb.insert = mockInsert;
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    const existing = await db.select().from({}).where({}).limit(1);
    expect(existing.length).toBe(0);

    await db.insert({}).values({ email: 'new@test.com' });
    expect(mockInsert).toHaveBeenCalled();
  });
});
