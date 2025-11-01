import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { db } from 'database';

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersService],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAllSuppliers", () => {
    it("should return an array of suppliers", async () => {
      const allSuppliers = [{ supplier_id: 1, supplier_name: "Supplier A" }, { supplier_id: 2, supplier_name: "Supplier B" }];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValueOnce(allSuppliers),
      });

      const results = await service.getAllSuppliers();
      expect(results).toEqual(allSuppliers);
      expect(db.select).toHaveBeenCalled();
    });

  })

  describe("getSupplierById", () => {
    it("should return a supplier by id", async () => {
      const supplier = { supplier_id: 1, supplier_name: "Supplier A" };
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValueOnce([supplier]),
      });

      const result = await service.getSupplierById(1);
      expect(result).toEqual(supplier);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("createSupplier", () => {
    it("should create a new supplier", async () => {
      const newSupplier = { supplier_name: "Supplier C" };
      (db.insert as jest.Mock).mockReturnValueOnce({
        into: jest.fn().mockResolvedValueOnce(newSupplier),
      });

      const result = await service.createSupplier(newSupplier);
      expect(result).toEqual(newSupplier);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("updateSupplier", () => {
    it("should update an existing supplier", async () => {
      const updatedSupplier = { supplier_id: 1, supplier_name: "Supplier A Updated" };
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockResolvedValueOnce(updatedSupplier),
      });
      const result = await service.updateSupplier(1, { supplier_name: "Supplier A Updated" });
      expect(result).toEqual(updatedSupplier);
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("deleteSupplier", () => {
    it("should delete an existing supplier", async () => {
      (db.delete as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockResolvedValueOnce(undefined),
      });
      const result = await service.deleteSupplier(1);
      expect(result).toBeUndefined();
      expect(db.delete).toHaveBeenCalled();
    });
  }); 
});
