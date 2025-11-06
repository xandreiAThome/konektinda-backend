import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOrdersService } from './supplier_orders.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';

// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

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

  describe('getAllSupplierOrders', () => {
    it('should return all supplier orders', async () => {
      const allSupplierOrders = [
        {
          supplier_order_id: 1,
          order_id: 1,
          supplier_id: 2,
          supplier_order_num: '123ABCD',
          subtotal: 4.99,
          shipping: 20,
          total_price: 24.99,
          status: 'PENDING',
        },
        {
          supplier_order_id: 2,
          order_id: 1,
          supplier_id: 3,
          supplier_order_num: 'aaaaaaaa',
          subtotal: 20.99,
          shipping: 20,
          total_price: 40.99,
          status: 'PENDING',
        },
      ];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(allSupplierOrders),
        }),
      });

      const result = await service.getAllSupplierOrders();
      expect(result).toEqual(allSupplierOrders);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSupplierOrderById', () => {
    it.todo('should return a supplier order by id');
    it.todo('should return a NotFoundException if id is not found');
  });

  describe('getSupplierOrderBySupplierId', () => {
    it.todo('should return a supplier order by supplier id');
    it.todo('should return a NotFoundException if supplier id is not found');
  });

  describe('getSupplierOrderItems', () => {
    it.todo('should return all items for a specified supplier order id');
    it.todo('should return a NotFoundException if id is not found');
  });

  describe('updateSupplierOrder', () => {
    it.todo('should only update the status for an existing supplier order');
    it.todo('should return a NotFoundException if id is not found');
  });
});
