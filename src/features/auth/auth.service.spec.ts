import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/features/users/users.service';
import { FirebaseService } from 'src/features/firebase/firebase.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let firebaseService: FirebaseService;

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    firebaseService = module.get<FirebaseService>(FirebaseService);
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
      const decoded = { uid: '1', email: 'a@b.com', name: 'John Doe', picture: 'pic.jpg' };
      const existingUser = { id: 1, email: 'a@b.com' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.findByEmail).toHaveBeenCalledWith('a@b.com');
      expect(usersService.createUser).not.toHaveBeenCalled();
      expect(result).toBe(existingUser);
    });

    it('should create new user if not found', async () => {
      const decoded = {
        uid: '2',
        email: 'new@b.com',
        name: 'Jane Doe',
        picture: 'pic2.jpg',
      };
      const createdUser = { id: 2, email: 'new@b.com' };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@b.com',
          first_name: 'Jane',
          last_name: 'Doe',
          profile_picture_url: 'pic2.jpg',
          username: 'new',
        }),
      );
      expect(result).toBe(createdUser);
    });

    it('should handle missing name or picture gracefully', async () => {
      const decoded = { uid: '3', email: 'noinfo@b.com' };
      const createdUser = { id: 3, email: 'noinfo@b.com' };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.registerWithFirebase(decoded);

      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: 'User',
          last_name: '',
          profile_picture_url: '',
        }),
      );
      expect(result).toBe(createdUser);
    });
  });
});
