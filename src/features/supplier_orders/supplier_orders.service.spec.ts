import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOrdersService } from './supplier_orders.service';
import { db } from 'database';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../enums';

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
    jest.clearAllMocks();
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

  const valid = {
    supplier_order_id: 1,
    order_id: 1,
    supplier_id: 2,
    supplier_order_num: '123ABCD',
    subtotal: 4.99,
    shipping: 20,
    total_price: 24.99,
    status: 'PENDING',
  };

  describe('getSupplierOrderById', () => {
    it('should return a supplier order by id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([valid]),
        }),
      });

      const result = await service.getSupplierOrderById(1);
      expect(result).toEqual(valid);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getSupplierOrderById(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSupplierOrdersBySupplierId', () => {
    it('should return all supplier orders by supplier id', async () => {
      const rows = [valid, { ...valid, supplier_order_id: 2 }];
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(rows),
        }),
      });

      const result = await service.getSupplierOrdersBySupplierId(2);

      expect(result).toEqual(rows);
      expect(db.select).toHaveBeenCalled();
    });
    it('should return a NotFoundException if supplier id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getSupplierOrdersBySupplierId(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSupplierOrderItems', () => {
    const orderItems = [
      {
        order_item_id: 1,
        supplier_order_id: 1,
        product_variant_id: 1,
        quantity: 2,
        unit_price: 4.99,
        discount_applied: 0,
      },
      {
        order_item_id: 2,
        supplier_order_id: 1,
        product_variant_id: 1,
        quantity: 2,
        unit_price: 4.99,
        discount_applied: 0,
      },
    ];

    it('should return all items for a specified supplier order id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(orderItems),
        }),
      });
      const result = await service.getSupplierOrderItems(2);
      expect(result).toEqual(orderItems);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getSupplierOrderItems(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('updateSupplierOrder', () => {
    const update = { status: OrderStatus.COMPLETE };
    it('should only update the status for an existing supplier order', async () => {
      const updatedRow = { ...valid, status: update.status };
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedRow]),
          }),
        }),
      });

      const result = await service.updateSupplierOrder(1, update);
      expect(result).toEqual(updatedRow);
      expect(db.update).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      await expect(service.updateSupplierOrder(-1, update)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
