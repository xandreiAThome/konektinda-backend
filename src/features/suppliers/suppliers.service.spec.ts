import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { db } from 'database'; // your Drizzle instance
import { NotFoundException } from '@nestjs/common';

jest.mock('database', () => ({
  db: {
    query: {
      suppliers: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
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
        {
          supplier_id: 1,
          supplier_name: 'Supplier A',
          products: [{ product_id: 1, product_name: 'Product 1' }],
        },
        {
          supplier_id: 2,
          supplier_name: 'Supplier B',
          products: [{ product_id: 2, product_name: 'Product 2' }],
        },
      ];

      (db.query.suppliers.findMany as jest.Mock).mockResolvedValueOnce(
        allSuppliers,
      );

      const results = await service.getAllSuppliers();

      expect(results).toEqual(allSuppliers);
      expect(db.query.suppliers.findMany).toHaveBeenCalled();
    });
  });

  describe('getSupplierById', () => {
    it('should return a supplier by id', async () => {
      const supplier = {
        supplier_id: 1,
        supplier_name: 'Supplier A',
        products: [{ product_id: 1, product_name: 'Product 1' }],
      };

      (db.query.suppliers.findFirst as jest.Mock).mockResolvedValueOnce(
        supplier,
      );

      const result = await service.getSupplierById(1);

      expect(result).toEqual(supplier);
      expect(db.query.suppliers.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException if supplier not found', async () => {
      (db.query.suppliers.findFirst as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      await expect(service.getSupplierById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.query.suppliers.findFirst).toHaveBeenCalled();
    });
  });

  describe('createSupplier', () => {
    it('should create a new supplier', async () => {
      const dto = {
        supplier_name: 'Supplier C',
        supplier_description: 'Description C',
      };
      const newSupplier = { supplier_id: 3, ...dto };

      const mockChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([newSupplier]),
      };
      (db.insert as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.createSupplier(dto);

      expect(result).toEqual(newSupplier);
      expect(db.insert).toHaveBeenCalled();
      expect(mockChain.values).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });
  });

  describe('updateSupplier', () => {
    it('should update an existing supplier', async () => {
      const dto = { supplier_name: 'Supplier A Updated' };
      const updatedSupplier = { supplier_id: 1, ...dto };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([updatedSupplier]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.updateSupplier(1, dto);

      expect(result).toEqual(updatedSupplier);
      expect(db.update).toHaveBeenCalled();
      expect(mockChain.set).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException if supplier not found', async () => {
      const dto = { supplier_name: 'Supplier A Updated' };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.updateSupplier(999, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteSupplier', () => {
    it('should delete an existing supplier', async () => {
      const deletedSupplier = { supplier_id: 1, supplier_name: 'Supplier A' };

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([deletedSupplier]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.deleteSupplier(1);

      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should throw NotFoundException if supplier not found', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.delete as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.deleteSupplier(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
