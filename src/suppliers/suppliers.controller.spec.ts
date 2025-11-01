import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';

describe('SuppliersController', () => {
  let controller: SuppliersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a supplier', async () => {
    const dto = {
      supplier_name: 'Test Supplier',
      supplier_email: 'test@example.com',
      supplier_phone: '1234567890',
    };
    const result = await controller.createSupplier(dto);
    expect(result).toHaveProperty('supplier_id');
  });
  
});
