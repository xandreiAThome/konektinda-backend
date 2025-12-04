import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressService } from './user_address.service';
import { NotFoundException } from '@nestjs/common';
import { db } from 'database';

// Mock the database
jest.mock('database', () => ({
  db: {
    query: {
      user_addresses: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserAddressService', () => {
  let service: UserAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAddressService],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new address', async () => {
      const createDto = {
        user_id: 1,
        region: 'NCR',
        province: 'Metro Manila',
        city: 'Makati City',
        barangay: 'Bel-Air',
        zip_code: '1121',
      };

      const mockAddress = {
        address_id: 1,
        ...createDto,
      };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockAddress]),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAddress);
      expect(db.insert).toHaveBeenCalled();
      expect(mockInsert.values).toHaveBeenCalledWith(createDto);
      expect(mockInsert.returning).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all addresses with user relations', async () => {
      const mockAddresses = [
        {
          address_id: 1,
          user_id: 1,
          region: 'NCR',
          province: 'Metro Manila',
          city: 'Makati City',
          barangay: 'Bel-Air',
          zip_code: '1121',
          user: {
            user_id: 1,
            uid: 'firebase-uid-1',
            email: 'user1@example.com',
          },
        },
        {
          address_id: 2,
          user_id: 2,
          region: 'Region IV-A',
          province: 'Laguna',
          city: 'Santa Rosa',
          barangay: 'Balibago',
          zip_code: '4026',
          user: {
            user_id: 2,
            uid: 'firebase-uid-2',
            email: 'user2@example.com',
          },
        },
      ];

      (db.query.user_addresses.findMany as jest.Mock).mockResolvedValue(
        mockAddresses,
      );

      const result = await service.findAll();

      expect(result).toEqual(mockAddresses);
      expect(db.query.user_addresses.findMany).toHaveBeenCalledWith({
        with: {
          user: true,
        },
      });
    });
  });

  describe('findById', () => {
    it('should return an address by ID with user relations', async () => {
      const mockAddress = {
        address_id: 1,
        user_id: 1,
        region: 'NCR',
        province: 'Metro Manila',
        city: 'Makati City',
        barangay: 'Bel-Air',
        zip_code: '1121',
        user: {
          user_id: 1,
          uid: 'firebase-uid-1',
          email: 'user1@example.com',
        },
      };

      (db.query.user_addresses.findFirst as jest.Mock).mockResolvedValue(
        mockAddress,
      );

      const result = await service.findById(1);

      expect(result).toEqual(mockAddress);
      expect(db.query.user_addresses.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          user: true,
        },
      });
    });

    it('should throw NotFoundException when address is not found', async () => {
      (db.query.user_addresses.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow(
        'Address with ID 999 not found',
      );
    });
  });

  describe('findByUserId', () => {
    it('should return all addresses for a specific user', async () => {
      const mockAddresses = [
        {
          address_id: 1,
          user_id: 1,
          region: 'NCR',
          province: 'Metro Manila',
          city: 'Makati City',
          barangay: 'Bel-Air',
          zip_code: '1121',
          user: {
            user_id: 1,
            uid: 'firebase-uid-1',
            email: 'user1@example.com',
          },
        },
        {
          address_id: 2,
          user_id: 1,
          region: 'Region IV-A',
          province: 'Laguna',
          city: 'Santa Rosa',
          barangay: 'Balibago',
          zip_code: '4026',
          user: {
            user_id: 1,
            uid: 'firebase-uid-1',
            email: 'user1@example.com',
          },
        },
      ];

      (db.query.user_addresses.findMany as jest.Mock).mockResolvedValue(
        mockAddresses,
      );

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockAddresses);
      expect(db.query.user_addresses.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          user: true,
        },
      });
    });
  });

  describe('findMyAddresses', () => {
    it('should return addresses for the authenticated user without user relations', async () => {
      const mockAddresses = [
        {
          address_id: 1,
          user_id: 1,
          region: 'NCR',
          province: 'Metro Manila',
          city: 'Makati City',
          barangay: 'Bel-Air',
          zip_code: '1121',
        },
      ];

      (db.query.user_addresses.findMany as jest.Mock).mockResolvedValue(
        mockAddresses,
      );

      const result = await service.findMyAddresses(1);

      expect(result).toEqual(mockAddresses);
      expect(db.query.user_addresses.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update an existing address', async () => {
      const updateDto = {
        city: 'Quezon City',
        barangay: 'Commonwealth',
      };

      const mockUpdatedAddress = {
        address_id: 1,
        user_id: 1,
        region: 'NCR',
        province: 'Metro Manila',
        city: 'Quezon City',
        barangay: 'Commonwealth',
        zip_code: '1121',
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockUpdatedAddress]),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedAddress);
      expect(db.update).toHaveBeenCalled();
      expect(mockUpdate.set).toHaveBeenCalledWith(updateDto);
      expect(mockUpdate.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException when address to update is not found', async () => {
      const updateDto = {
        city: 'Quezon City',
      };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, updateDto)).rejects.toThrow(
        'Address with ID 999 not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing address', async () => {
      const mockDeletedAddress = {
        address_id: 1,
        user_id: 1,
        region: 'NCR',
        province: 'Metro Manila',
        city: 'Makati City',
        barangay: 'Bel-Air',
        zip_code: '1121',
      };

      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockDeletedAddress]),
      };

      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      const result = await service.delete(1);

      expect(result).toBe('Address with ID 1 has been deleted.');
      expect(db.delete).toHaveBeenCalled();
      expect(mockDelete.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException when address to delete is not found', async () => {
      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };

      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      await expect(service.delete(999)).rejects.toThrow(
        'Address with ID 999 not found',
      );
    });
  });
});
