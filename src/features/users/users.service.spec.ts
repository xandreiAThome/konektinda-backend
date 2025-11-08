import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { db } from 'database';
import { users } from 'db/schema';
import { eq } from 'drizzle-orm';

jest.mock('drizzle-orm', () => ({
  eq: jest.fn((a, b) => `eq(${a}, ${b})`),
}));

jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
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
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockUser]),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);

    const result = await service.findByEmail('test@example.com');

    expect(db.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalledWith(users);
    expect(eq).toHaveBeenCalledWith(users.email, 'test@example.com');
    expect(result).toEqual(mockUser);
  });

  it('should return undefined when email not found', async () => {
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);

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
    const mockSelect = {
      from: jest.fn().mockResolvedValue([mockUser]),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);

    const result = await service.findAll();

    expect(db.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalledWith(users);
    expect(result).toEqual([mockUser]);
  });

  it('should return user by id', async () => {
    const mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockUser]),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);

    const result = await service.findById(1);

    expect(db.select).toHaveBeenCalled();
    expect(mockSelect.from).toHaveBeenCalledWith(users);
    expect(eq).toHaveBeenCalledWith(users.user_id, 1);
    expect(result).toEqual(mockUser);
  });
});
