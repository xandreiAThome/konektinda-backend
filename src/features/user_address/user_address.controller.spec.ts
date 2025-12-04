import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressController } from './user_address.controller';
import { UserAddressService } from './user_address.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';

const mockUserAddressService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findMyAddresses: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUsersService = {
  findById: jest.fn(),
};

describe('UserAddressController', () => {
  let controller: UserAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAddressController],
      providers: [
        {
          provide: UserAddressService,
          useValue: mockUserAddressService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserAddressController>(UserAddressController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /user-address', () => {
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

      mockUserAddressService.create.mockResolvedValue(mockAddress);

      const result = await controller.createAddress(createDto);

      expect(result).toEqual(mockAddress);
      expect(mockUserAddressService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('GET /user-address', () => {
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

      mockUserAddressService.findAll.mockResolvedValue(mockAddresses);

      const result = await controller.getAllAddresses();

      expect(result).toEqual(mockAddresses);
      expect(mockUserAddressService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /user-address/me', () => {
    it('should return addresses for the authenticated user', async () => {
      const mockUser = {
        user_id: 1,
        uid: 'firebase-uid-1',
        email: 'user1@example.com',
      };

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

      const mockRequest = {
        user: {
          uid: 'firebase-uid-1',
        },
      } as any;

      mockUsersService.findById.mockResolvedValue(mockUser);
      mockUserAddressService.findMyAddresses.mockResolvedValue(mockAddresses);

      const result = await controller.getMyAddresses(mockRequest);

      expect(result).toEqual(mockAddresses);
      expect(mockUsersService.findById).toHaveBeenCalledWith('firebase-uid-1');
      expect(mockUserAddressService.findMyAddresses).toHaveBeenCalledWith(1);
    });

    it('should throw error when user is not found', async () => {
      const mockRequest = {
        user: {
          uid: 'firebase-uid-999',
        },
      } as any;

      mockUsersService.findById.mockResolvedValue(null);

      await expect(controller.getMyAddresses(mockRequest)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('GET /user-address/:id', () => {
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

      mockUserAddressService.findById.mockResolvedValue(mockAddress);

      const result = await controller.getAddressById(1);

      expect(result).toEqual(mockAddress);
      expect(mockUserAddressService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when address is not found', async () => {
      mockUserAddressService.findById.mockRejectedValue(
        new NotFoundException('Address with ID 999 not found'),
      );

      await expect(controller.getAddressById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /user-address/user/:userId', () => {
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

      mockUserAddressService.findByUserId.mockResolvedValue(mockAddresses);

      const result = await controller.getAddressesByUserId(1);

      expect(result).toEqual(mockAddresses);
      expect(mockUserAddressService.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('PATCH /user-address/:id', () => {
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

      mockUserAddressService.update.mockResolvedValue(mockUpdatedAddress);

      const result = await controller.updateAddress(1, updateDto);

      expect(result).toEqual(mockUpdatedAddress);
      expect(mockUserAddressService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when address to update is not found', async () => {
      const updateDto = {
        city: 'Quezon City',
      };

      mockUserAddressService.update.mockRejectedValue(
        new NotFoundException('Address with ID 999 not found'),
      );

      await expect(controller.updateAddress(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('DELETE /user-address/:id', () => {
    it('should delete an existing address', async () => {
      const mockMessage = 'Address with ID 1 has been deleted.';

      mockUserAddressService.delete.mockResolvedValue(mockMessage);

      const result = await controller.deleteAddress(1);

      expect(result).toBe(mockMessage);
      expect(mockUserAddressService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when address to delete is not found', async () => {
      mockUserAddressService.delete.mockRejectedValue(
        new NotFoundException('Address with ID 999 not found'),
      );

      await expect(controller.deleteAddress(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
