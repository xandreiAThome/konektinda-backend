import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      loginOrRegister: jest.fn(),
    };

    const mockFirebaseService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('googleAuth', () => {
    it('should return authentication result', async () => {
      const mockIdToken = 'token123';
      const mockResult = {
        message: 'Authenticated successfully',
        user: { id: 1, email: 'test@example.com' },
        provider: 'google.com',
      };

      (authService.loginOrRegister as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.googleAuth(mockIdToken);

      expect(authService.loginOrRegister).toHaveBeenCalledWith(mockIdToken);
      expect(result).toEqual(mockResult);
    });

    it('should throw error when authentication fails', async () => {
      const error = new Error('Invalid Firebase token');
      (authService.loginOrRegister as jest.Mock).mockRejectedValue(error);

      await expect(controller.googleAuth('bad-token')).rejects.toThrow(
        'Invalid Firebase token',
      );
    });
  });
});
