import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { db } from 'database'; // your Drizzle instance

jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersService],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    jest.clearAllMocks(); // ✅ ensure a clean mock state before every test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSuppliers', () => {
    it('should return an array of suppliers', async () => {
      const allSuppliers = [
        { supplier_id: 1, supplier_name: 'Supplier A' },
        { supplier_id: 2, supplier_name: 'Supplier B' },
      ];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValueOnce(allSuppliers),
      });

      const results = await service.getAllSuppliers();

      expect(results).toEqual(allSuppliers);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSupplierById', () => {
    it('should return a supplier by id', async () => {
      const supplier = { supplier_id: 1, supplier_name: 'Supplier A' };

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([supplier]),
        }),
      });

      const result = await service.getSupplierById(1);

      expect(result).toEqual(supplier);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('createSupplier', () => {
    it('should create a new supplier', async () => {
      const dto = {
        supplier_name: 'Supplier C',
        supplier_description: 'Description C',
      };
      const newSupplier = { supplier_id: 3, ...dto };

      (db.insert as jest.Mock).mockReturnValueOnce({
        values: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([newSupplier]),
        }),
      });

      const result = await service.createSupplier(dto);

      expect(result).toEqual(newSupplier);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('updateSupplier', () => {
    it('should update an existing supplier', async () => {
      const dto = { supplier_name: 'Supplier A Updated' };
      const updatedSupplier = { supplier_id: 1, ...dto };

      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedSupplier]),
          }),
        }),
      });

      const result = await service.updateSupplier(1, dto);

      expect(result).toEqual(updatedSupplier);
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe('deleteSupplier', () => {
    it('should delete an existing supplier', async () => {
      const deletedSupplier = { supplier_id: 1, supplier_name: 'Supplier A' };

      (db.delete as jest.Mock).mockReturnValueOnce({
        where: jest.fn().mockReturnValueOnce({
          returning: jest.fn().mockResolvedValueOnce([deletedSupplier]),
        }),
      });

      const result = await service.deleteSupplier(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
    });
  });
});
