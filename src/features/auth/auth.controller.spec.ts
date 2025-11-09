import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      verifyFirebaseToken: jest.fn(),
      registerWithFirebase: jest.fn(),
      loginOrRegister: jest.fn(),
    };

    const mockFirebaseService = {
      verifyIdToken: jest.fn(),
    };

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

  it('should return user after successful firebase login', async () => {
    const mockIdToken = 'token123';
    const mockUser = { id: 1, email: 'test@example.com' };

    (authService.loginOrRegister as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.googleAuth(mockIdToken);

    expect(authService.loginOrRegister).toHaveBeenCalledWith(mockIdToken);
    expect(result).toEqual(mockUser);
  });

  it('should throw if verifyFirebaseToken fails', async () => {
    (authService.loginOrRegister as jest.Mock).mockRejectedValue(
      new Error('Invalid Firebase token'),
    );

    await expect(controller.googleAuth('bad-token')).rejects.toThrow('Invalid Firebase token');
  });
});
