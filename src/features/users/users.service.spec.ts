import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { db } from 'database';
import { users } from 'db/schema';

jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    query: {
      users: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
  },
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    user_id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should return user when email is found', async () => {
    const mockUserWithRelations = {
      ...mockUser,
      addresses: [],
      supplier: null,
    };
    
    (db.query.users.findFirst as jest.Mock).mockResolvedValueOnce(mockUserWithRelations);

    const result = await service.findByEmail('test@example.com');

    expect(db.query.users.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockUserWithRelations);
  });

  it('should return undefined when email not found', async () => {
    (db.query.users.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await service.findByEmail('notfound@example.com');

    expect(result).toBeUndefined();
  });

  it('should create and return user', async () => {
    const newUser = { email: 'new@example.com', first_name: 'Jane' };
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockUser]),
    };
    (db.insert as jest.Mock).mockReturnValue(mockInsert);

    const result = await service.createUser(newUser as any);

    expect(db.insert).toHaveBeenCalledWith(users);
    expect(mockInsert.values).toHaveBeenCalledWith(newUser);
    expect(result).toEqual(mockUser);
  });

  it('should return all users', async () => {
    const mockUsersWithRelations = [
      {
        ...mockUser,
        addresses: [],
        supplier: null,
      },
    ];
    
    (db.query.users.findMany as jest.Mock).mockResolvedValueOnce(mockUsersWithRelations);

    const result = await service.findAll();

    expect(db.query.users.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockUsersWithRelations);
  });

  it('should return user by id', async () => {
    const mockUserWithRelations = {
      ...mockUser,
      addresses: [],
      supplier: null,
    };
    
    (db.query.users.findFirst as jest.Mock).mockResolvedValueOnce(mockUserWithRelations);

    const result = await service.findById(1);

    expect(db.query.users.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockUserWithRelations);
  });
});
