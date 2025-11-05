import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      verifyFirebaseToken: jest.fn(),
      registerWithFirebase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return user after successful firebase login', async () => {
    const mockIdToken = 'token123';
    const mockDecoded = { uid: 'abc123', email: 'test@example.com' };
    const mockUser = { id: 1, email: 'test@example.com' };

    (authService.verifyFirebaseToken as jest.Mock).mockResolvedValue(mockDecoded);
    (authService.registerWithFirebase as jest.Mock).mockResolvedValue(mockUser);

    const result = await controller.firebaseLogin(mockIdToken);

    expect(authService.verifyFirebaseToken).toHaveBeenCalledWith(mockIdToken);
    expect(authService.registerWithFirebase).toHaveBeenCalledWith(mockDecoded);
    expect(result).toEqual({
      message: 'Authenticated successfully',
      user: mockUser,
    });
  });

  it('should throw if verifyFirebaseToken fails', async () => {
    (authService.verifyFirebaseToken as jest.Mock).mockRejectedValue(
      new Error('Invalid Firebase token'),
    );

    await expect(controller.firebaseLogin('bad-token')).rejects.toThrow('Invalid Firebase token');
    expect(authService.registerWithFirebase).not.toHaveBeenCalled();
  });
});
