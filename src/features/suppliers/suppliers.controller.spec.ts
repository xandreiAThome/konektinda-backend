import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Supplier } from 'db/schema';

describe('SuppliersController', () => {
  let controller: SuppliersController;
  let service: SuppliersService;

  const mockSupplierService = {
    getAllSuppliers: jest.fn(),
    getSupplierById: jest.fn(),
    createSupplier: jest.fn(),
    updateSupplier: jest.fn(),
    deleteSupplier: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        {
          provide: SuppliersService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    controller = module.get<SuppliersController>(SuppliersController);
    service = module.get<SuppliersService>(SuppliersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSuppliers', () => {
    it('should return an array of suppliers', async () => {
      const suppliers = [
        { supplier_id: 1, supplier_name: 'Supplier A' },
        { supplier_id: 2, supplier_name: 'Supplier B' },
      ];
      jest
        .spyOn(service, 'getAllSuppliers')
        .mockResolvedValue(suppliers as Supplier[]);
      const result = await controller.getAllSuppliers();
      expect(result).toBe(suppliers);
      expect(service.getAllSuppliers).toHaveBeenCalled();
    });
  });

  describe('getSupplierById', () => {
    it('should return a supplier by id', async () => {
      const supplier = { supplier_id: 1, supplier_name: 'Supplier A' };
      jest
        .spyOn(service, 'getSupplierById')
        .mockResolvedValue(supplier as Supplier);
      const result = await controller.getSupplierById(1);
      expect(result).toBe(supplier);
      expect(service.getSupplierById).toHaveBeenCalledWith(1);
    });
  });

  describe('createSupplier', () => {
    it('should create and return a new supplier', async () => {
      const dto = {
        supplier_name: 'New Supplier',
        supplier_description: 'New Description',
      };
      const newSupplier = { supplier_id: 3, ...dto };
      jest
        .spyOn(service, 'createSupplier')
        .mockResolvedValue(newSupplier as Supplier);
      const result = await controller.createSupplier(dto);
      expect(result).toBe(newSupplier);
      expect(service.createSupplier).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateSupplier', () => {
    it('should update and return the supplier', async () => {
      const dto = {
        supplier_name: 'Updated Supplier',
        supplier_description: 'Updated Description',
      };
      const updatedSupplier = { supplier_id: 1, ...dto };
      jest
        .spyOn(service, 'updateSupplier')
        .mockResolvedValue(updatedSupplier as Supplier);
      const result = await controller.updateSupplier(1, dto);
      expect(result).toBe(updatedSupplier);
      expect(service.updateSupplier).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteSupplier', () => {
    it('should delete the supplier and return void', async () => {
      jest.spyOn(service, 'deleteSupplier').mockResolvedValue(undefined);
      const result = await controller.deleteSupplier(1);
      expect(result).toBeUndefined();
      expect(service.deleteSupplier).toHaveBeenCalledWith(1);
    });
  });
});
