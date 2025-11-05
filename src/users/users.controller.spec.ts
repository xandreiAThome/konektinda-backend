import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth-guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    user_id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    const result = await controller.getAllUsers();

    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('should return the current user from the request', async () => {
    const req = { user: mockUser };

    const result = await controller.getMe(req);

    expect(result).toEqual(mockUser);
  });

  it('should return a user by ID', async () => {
    const result = await controller.getUserById('1');

    expect(usersService.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUser);
  });
});
