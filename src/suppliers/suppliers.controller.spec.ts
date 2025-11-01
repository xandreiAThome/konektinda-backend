import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { db } from 'database';
import { SuppliersService } from './suppliers.service';
import { Supplier } from 'interface/suppliers';

describe('SuppliersController', () => {
  let controller: SuppliersController;
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [SuppliersService],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
    service = module.get<SuppliersService>(SuppliersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("getAllSuppliers", () => {
    it("should return an array of suppliers", async () => {
      const suppliers = [{ supplier_id: 1, supplier_name: 'Supplier A' }, { supplier_id: 2, supplier_name: 'Supplier B' }];
      jest.spyOn(service, 'getAllSuppliers').mockResolvedValue(suppliers as Supplier[]);
      const result = await controller.getAllSuppliers();
      expect(result).toBe(suppliers);
      expect(service.getAllSuppliers).toHaveBeenCalled();
    });
  });

});
