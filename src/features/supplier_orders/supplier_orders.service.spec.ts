import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOrdersService } from './supplier_orders.service';

describe('SupplierOrdersService', () => {
  let service: SupplierOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierOrdersService],
    }).compile();

    service = module.get<SupplierOrdersService>(SupplierOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
