import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
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

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const allOrders = [
        {
          order_id: 1,
          user_id: 1,
          grand_total: 50.99,
          region: 'NCR',
          province: 'Manila',
          city: 'Manila',
          barangay: 'Barangay 709',
          zip_code: '1000',
          payment_id: 'ABCD',
        },
        {
          order_id: 2,
          user_id: 1,
          grand_total: 20.99,
          region: 'NCR',
          province: 'Manila',
          city: 'Manila',
          barangay: 'Barangay 700',
          zip_code: '1000',
          payment_id: 'BCDA',
        },
      ];

      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(allOrders),
        }),
      });

      const result = await service.getAllOrders();
      expect(result).toEqual(allOrders);
      expect(db.select).toHaveBeenCalled();
    });
  });

  const valid = {
    order_id: 1,
    user_id: 1,
    grand_total: 50.99,
    region: 'NCR',
    province: 'Manila',
    city: 'Manila',
    barangay: 'Barangay 709',
    zip_code: '1000',
    payment_id: 'ABCD',
  };

  describe('getOrderById', () => {
    it('should return a order by id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([valid]),
        }),
      });

      const result = await service.getOrderById(1);
      expect(result).toEqual(valid);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getOrderById(-1)).rejects.toThrow(NotFoundException);
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return all orders by user id', async () => {
      const rows = [valid, { ...valid, order_id: 2 }];
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(rows),
        }),
      });

      const result = await service.getOrdersByUserId(2);

      expect(result).toEqual(rows);
      expect(db.select).toHaveBeenCalled();
    });
    it('should return a NotFoundException if user id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      await expect(service.getOrdersByUserId(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getOrderItems', () => {
    const orderItems = [
      {
        order_item_id: 1,
        order_id: 1,
        product_variant_id: 1,
        quantity: 2,
        unit_price: 4.99,
        discount_applied: 0,
      },
      {
        order_item_id: 2,
        order_id: 1,
        product_variant_id: 1,
        quantity: 2,
        unit_price: 4.99,
        discount_applied: 0,
      },
    ];

    it('should return all items for a specified order id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          innerJoin: jest.fn().mockReturnValueOnce({
            innerJoin: jest.fn().mockReturnValueOnce({
              where: jest.fn().mockResolvedValueOnce(orderItems),
            }),
          }),
        }),
      });
      const result = await service.getOrderItems(2);
      expect(result).toEqual(orderItems);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          innerJoin: jest.fn().mockReturnValueOnce({
            innerJoin: jest.fn().mockReturnValueOnce({
              where: jest.fn().mockResolvedValueOnce([]),
            }),
          }),
        }),
      });

      await expect(service.getOrderItems(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('getSupplierOrders', () => {
    const supplierOrders = [
      {
        supplier_order_id: 1,
        order_id: 1,
        supplier_id: 1,
        supplier_order_num: 'ABCD',
        subtotal: 20.99,
        shipping: 0,
        total_price: 20.99,
        status: OrderStatus.PENDING,
      },
    ];

    it('should return all supplier orders for a specific order id', async () => {
      (db.select as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(supplierOrders),
        }),
      });

      const result = await service.getSupplierOrders(1);
      expect(result).toEqual(supplierOrders);
      expect(db.select).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {});
  });

  describe('createOrder', () => {
    it.todo('should create an order');
  });

  describe('updateOrder', () => {
    const update = { status: OrderStatus.COMPLETE };
    it('should only update the status for an existing order', async () => {
      const updatedRow = {
        ...valid,
        order_id: 2,
        status: update.status,
      };
      (db.update as jest.Mock).mockReturnValueOnce({
        set: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockReturnValueOnce({
            returning: jest.fn().mockResolvedValueOnce([updatedRow]),
          }),
        }),
      });

      const result = await service.updateOrder(1, update);
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

      await expect(service.updateOrder(-1, update)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
