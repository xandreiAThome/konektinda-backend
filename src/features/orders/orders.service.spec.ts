import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { db } from 'database';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../../enums';

// Mock needed drizzle functions
jest.mock('database', () => ({
  db: {
    query: {
      orders: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn(),
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
          user: { user_id: 1, email: 'test@example.com' },
          payment: { payment_id: 'ABCD' },
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
          user: { user_id: 1, email: 'test@example.com' },
          payment: { payment_id: 'BCDA' },
        },
      ];

      (db.query.orders.findMany as jest.Mock).mockResolvedValueOnce(allOrders);

      const result = await service.getAllOrders();
      expect(result).toEqual(allOrders);
      expect(db.query.orders.findMany).toHaveBeenCalled();
    });

    it('should return filtered orders by status', async () => {
      const filteredOrders = [
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
          status: OrderStatus.PENDING,
          user: { user_id: 1, email: 'test@example.com' },
          payment: { payment_id: 'ABCD' },
        },
      ];

      (db.query.orders.findMany as jest.Mock).mockResolvedValueOnce(
        filteredOrders,
      );

      const result = await service.getAllOrders(OrderStatus.PENDING);
      expect(result).toEqual(filteredOrders);
      expect(db.query.orders.findMany).toHaveBeenCalled();
    });

    it('should return filtered orders by userId', async () => {
      const filteredOrders = [
        {
          order_id: 1,
          user_id: 2,
          grand_total: 50.99,
          region: 'NCR',
          province: 'Manila',
          city: 'Manila',
          barangay: 'Barangay 709',
          zip_code: '1000',
          payment_id: 'ABCD',
          user: { user_id: 2, email: 'user2@example.com' },
          payment: { payment_id: 'ABCD' },
        },
      ];

      (db.query.orders.findMany as jest.Mock).mockResolvedValueOnce(
        filteredOrders,
      );

      const result = await service.getAllOrders(undefined, 2);
      expect(result).toEqual(filteredOrders);
      expect(db.query.orders.findMany).toHaveBeenCalled();
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
    user: { user_id: 1, email: 'test@example.com' },
    payment: { payment_id: 'ABCD' },
  };

  describe('getOrderById', () => {
    it('should return a order by id', async () => {
      (db.query.orders.findFirst as jest.Mock).mockResolvedValueOnce(valid);

      const result = await service.getOrderById(1);
      expect(result).toEqual(valid);
      expect(db.query.orders.findFirst).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      (db.query.orders.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(service.getOrderById(-1)).rejects.toThrow(NotFoundException);
      expect(db.query.orders.findFirst).toHaveBeenCalled();
    });
  });

  /*
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
*/
  describe('getOrderItems', () => {
    const orderItems = [
      {
        orderItem: {
          order_item_id: 1,
          supplier_order_id: 1,
          product_variant_id: 1,
          quantity: 2,
          unit_price: 4.99,
          discount_applied: 0,
        },
        supplierOrder: {
          supplier_order_id: 1,
          order_id: 1,
          supplier_id: 1,
          supplier_order_num: 'SO-001',
          subtotal: 9.98,
          shipping: 0,
          total_price: 9.98,
          status: OrderStatus.PENDING,
        },
        order: {
          order_id: 1,
          user_id: 1,
          grand_total: 9.98,
          region: 'NCR',
          province: 'Manila',
          city: 'Manila',
          barangay: 'Barangay 709',
          zip_code: '1000',
          payment_id: 'ABCD',
        },
      },
      {
        orderItem: {
          order_item_id: 2,
          supplier_order_id: 1,
          product_variant_id: 2,
          quantity: 1,
          unit_price: 4.99,
          discount_applied: 0,
        },
        supplierOrder: {
          supplier_order_id: 1,
          order_id: 1,
          supplier_id: 1,
          supplier_order_num: 'SO-001',
          subtotal: 9.98,
          shipping: 0,
          total_price: 9.98,
          status: OrderStatus.PENDING,
        },
        order: {
          order_id: 1,
          user_id: 1,
          grand_total: 9.98,
          region: 'NCR',
          province: 'Manila',
          city: 'Manila',
          barangay: 'Barangay 709',
          zip_code: '1000',
          payment_id: 'ABCD',
        },
      },
    ];

    it('should return all items for a specified order id', async () => {
      const mockChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce(orderItems),
      };
      (db.select as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.getOrderItems(1);
      expect(result).toEqual(orderItems);
      expect(db.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalled();
      expect(mockChain.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockChain.where).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      const mockChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce([]),
      };
      (db.select as jest.Mock).mockReturnValueOnce(mockChain);

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
      const mockChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce(supplierOrders),
      };
      (db.select as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.getSupplierOrders(1);
      expect(result).toEqual(supplierOrders);
      expect(db.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      const mockChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce([]),
      };
      (db.select as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.getSupplierOrders(-1)).rejects.toThrow(
        NotFoundException,
      );
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createDto = {
        user_id: 1,
        grand_total: 19.96,
        region: 'NCR',
        province: 'Manila',
        city: 'Manila',
        barangay: 'Barangay 709',
        zip_code: '1000',
        payment_id: 'PAYMENT-123',
        order_date: '2025-01-01',
      };

      const cartId = 1;
      const cartItems = [
        {
          cartItemId: 1,
          productVariantId: 1,
          quantity: 2,
          unitPrice: 4.99,
          discount: 0,
          supplierId: 1,
        },
        {
          cartItemId: 2,
          productVariantId: 2,
          quantity: 2,
          unitPrice: 4.99,
          discount: 0,
          supplierId: 1,
        },
      ];

      // First select call - getting cart
      const cartSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce([{ cart_id: cartId }]),
      };

      (db.select as jest.Mock).mockReturnValueOnce(cartSelectChain);

      // Mock transaction
      const mockTx = {
        select: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
      };

      // Inside transaction - cart items select
      const cartItemsChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce(cartItems),
      };
      mockTx.select.mockReturnValueOnce(cartItemsChain);

      // Insert order
      const orderInsertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([{ order_id: 1 }]),
      };
      mockTx.insert.mockReturnValueOnce(orderInsertChain);

      // Insert supplier orders
      const supplierOrderInsertChain = {
        values: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockResolvedValueOnce([{ supplier_order_id: 1, supplier_id: 1 }]),
      };
      mockTx.insert.mockReturnValueOnce(supplierOrderInsertChain);

      // Insert order items
      const orderItemsInsertChain = {
        values: jest.fn().mockResolvedValueOnce(undefined),
      };
      mockTx.insert.mockReturnValueOnce(orderItemsInsertChain);

      // Delete cart items
      const deleteChain = {
        where: jest.fn().mockResolvedValueOnce(undefined),
      };
      mockTx.delete.mockReturnValueOnce(deleteChain);

      (db.transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTx);
      });

      const result = await service.createOrder(createDto);

      expect(result).toEqual({
        order_id: 1,
        grand_total: 19.96,
        supplier_orders: [1],
        items_count: 2,
      });
      expect(db.select).toHaveBeenCalled();
      expect(db.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if cart is not found', async () => {
      const createDto = {
        user_id: 999,
        grand_total: 19.98,
        region: 'NCR',
        province: 'Manila',
        city: 'Manila',
        barangay: 'Barangay 709',
        zip_code: '1000',
        payment_id: 'PAYMENT-123',
        order_date: '2025-01-01',
      };

      const mockChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce([]),
      };
      (db.select as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.createOrder(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if cart has no items', async () => {
      const createDto = {
        user_id: 1,
        grand_total: 0,
        region: 'NCR',
        province: 'Manila',
        city: 'Manila',
        barangay: 'Barangay 709',
        zip_code: '1000',
        payment_id: 'PAYMENT-123',
        order_date: '2025-01-01',
      };

      const cartId = 1;

      // First select - get cart
      const cartSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce([{ cart_id: cartId }]),
      };
      (db.select as jest.Mock).mockReturnValueOnce(cartSelectChain);

      // Mock transaction
      const mockTx = {
        select: jest.fn(),
      };

      // Inside transaction - empty cart items
      const cartItemsChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce([]),
      };
      mockTx.select.mockReturnValueOnce(cartItemsChain);

      (db.transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTx);
      });

      await expect(service.createOrder(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if grand_total mismatch', async () => {
      const createDto = {
        user_id: 1,
        grand_total: 999.99, // Wrong total
        region: 'NCR',
        province: 'Manila',
        city: 'Manila',
        barangay: 'Barangay 709',
        zip_code: '1000',
        payment_id: 'PAYMENT-123',
        order_date: '2025-01-01',
      };

      const cartId = 1;
      const cartItems = [
        {
          cartItemId: 1,
          productVariantId: 1,
          quantity: 2,
          unitPrice: 4.99,
          discount: 0,
          supplierId: 1,
        },
      ];

      // First select - get cart
      const cartSelectChain = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce([{ cart_id: cartId }]),
      };
      (db.select as jest.Mock).mockReturnValueOnce(cartSelectChain);

      // Mock transaction
      const mockTx = {
        select: jest.fn(),
      };

      // Inside transaction - cart items
      const cartItemsChain = {
        from: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValueOnce(cartItems),
      };
      mockTx.select.mockReturnValueOnce(cartItemsChain);

      (db.transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTx);
      });

      await expect(service.createOrder(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateOrder', () => {
    const update = { status: OrderStatus.COMPLETE };
    it('should only update the status for an existing order', async () => {
      const updatedRow = {
        ...valid,
        order_id: 1,
        status: update.status,
      };

      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([updatedRow]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      const result = await service.updateOrder(1, update);
      expect(result).toEqual(updatedRow);
      expect(db.update).toHaveBeenCalled();
      expect(mockChain.set).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockChain.returning).toHaveBeenCalled();
    });

    it('should return a NotFoundException if id is not found', async () => {
      const mockChain = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([]),
      };
      (db.update as jest.Mock).mockReturnValueOnce(mockChain);

      await expect(service.updateOrder(-1, update)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
