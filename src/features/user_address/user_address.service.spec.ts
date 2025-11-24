import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressService } from './user_address.service';

describe('UserAddressService', () => {
  let service: UserAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAddressService],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
