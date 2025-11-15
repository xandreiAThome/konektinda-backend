import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/features/users/users.service';
import { FirebaseService } from 'src/features/firebase/firebase.service';
import { UnauthorizedException } from '@nestjs/common';
import { CartsService } from '../carts/carts.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let firebaseService: FirebaseService;
  let cartsService: CartsService;

  const mockFirebaseAuth = {
    verifyIdToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: FirebaseService,
          useValue: {
            getAuth: jest.fn().mockReturnValue(mockFirebaseAuth),
          },
        },
        {
          provide: CartsService,
          useValue: {
            createCart: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
    cartsService = module.get<CartsService>(CartsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyFirebaseToken', () => {
    it('should return decoded token on success', async () => {
      const mockIdToken = 'token123';
      const mockDecoded = { uid: 'abc', email: 'test@example.com' };
      mockFirebaseAuth.verifyIdToken.mockResolvedValue(mockDecoded);

      const result = await service.verifyFirebaseToken(mockIdToken);

      expect(firebaseService.getAuth).toHaveBeenCalled();
      expect(mockFirebaseAuth.verifyIdToken).toHaveBeenCalledWith(mockIdToken);
      expect(result).toEqual(mockDecoded);
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      mockFirebaseAuth.verifyIdToken.mockRejectedValue(new Error('bad token'));

      await expect(service.verifyFirebaseToken('bad')).rejects.toThrow(
        new UnauthorizedException('Invalid Firebase token'),
      );
    });
  });

  describe('registerWithFirebase', () => {
    it('should return existing user if found', async () => {
      const decoded = {
        uid: '1',
        email: 'a@b.com',
        name: 'John Doe',
        picture: 'pic.jpg',
      };
      const existingUser = { id: 1, email: 'a@b.com' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.findByEmail).toHaveBeenCalledWith('a@b.com');
      expect(usersService.createUser).not.toHaveBeenCalled();
      expect(result).toBe(existingUser);
    });

    it('should create new user with all fields', async () => {
      const decoded = {
        uid: '2',
        email: 'new@b.com',
        name: 'Jane Doe',
        picture: 'pic2.jpg',
        email_verified: true,
      };
      const createdUser = { id: 2, email: 'new@b.com' };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.createUser).toHaveBeenCalledWith({
        firebase_uid: '2',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'new@b.com',
        username: 'new',
        password_hash: null,
        phone_number: null,
        email_verified: true,
        role: 'CONSUMER',
        profile_picture_url: 'pic2.jpg',
      });

      expect(cartsService.createCart).toHaveBeenCalledWith(decoded.uid);
      expect(result).toBe(createdUser);
    });

    it('should handle missing name or picture', async () => {
      const decoded = {
        uid: '3',
        email: 'noinfo@b.com',
        email_verified: false,
      };
      const createdUser = { id: 3, email: 'noinfo@b.com' };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.createUser).toHaveBeenCalledWith({
        firebase_uid: '3',
        first_name: 'User',
        last_name: '',
        email: 'noinfo@b.com',
        username: 'noinfo',
        password_hash: null,
        phone_number: null,
        email_verified: false,
        role: 'CONSUMER',
        profile_picture_url: '',
      });
      expect(cartsService.createCart).toHaveBeenCalledWith(decoded.uid);
      expect(result).toBe(createdUser);
    });
  });

  describe('loginOrRegister', () => {
    it('should authenticate and return user with provider', async () => {
      const mockIdToken = 'token123';
      const mockDecoded = {
        uid: 'abc',
        email: 'test@example.com',
        name: 'Test User',
        email_verified: true,
        firebase: {
          sign_in_provider: 'google.com',
        },
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };

      mockFirebaseAuth.verifyIdToken.mockResolvedValue(mockDecoded);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.loginOrRegister(mockIdToken);

      expect(result).toEqual({
        message: 'Authenticated successfully',
        user: mockUser,
        provider: 'google.com',
      });
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      const mockIdToken = 'invalid_token';
      mockFirebaseAuth.verifyIdToken.mockRejectedValue(
        new Error('Invalid token'),
      );

      await expect(service.loginOrRegister(mockIdToken)).rejects.toThrow(
        new UnauthorizedException('Invalid Firebase token'),
      );
    });
  });
});
