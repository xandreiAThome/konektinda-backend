import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../enums';

const mockService = {
  getAllOrders: jest.fn(),
  getOrderById: jest.fn(),
  getOrdersByUserId: jest.fn(),
  getSupplierOrders: jest.fn(),
  getOrderItems: jest.fn(),
  updateOrder: jest.fn(),
  createOrder: jest.fn(),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /orders', () => {
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

      mockService.getAllOrders.mockResolvedValue(allOrders);
      const res = await controller.getAllOrders();
      expect(res).toEqual(allOrders);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(undefined, undefined);
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

      mockService.getAllOrders.mockResolvedValue(filteredOrders);
      const res = await controller.getAllOrders(OrderStatus.PENDING);
      expect(res).toEqual(filteredOrders);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(OrderStatus.PENDING, undefined);
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

      mockService.getAllOrders.mockResolvedValue(filteredOrders);
      const res = await controller.getAllOrders(undefined, 2);
      expect(res).toEqual(filteredOrders);
      expect(mockService.getAllOrders).toHaveBeenCalledWith(undefined, 2);
    });
  });

  // Constant product variant used in tests below
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

  describe('GET /orders/:id', () => {
    it('should return the correct order based on id', async () => {
      mockService.getOrderById.mockResolvedValue(valid);
      const res = await controller.getOrderById(1);
      expect(res).toEqual(valid);
      expect(mockService.getOrderById).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if order does not exist', async () => {
      mockService.getOrderById.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getOrderById(-1)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(mockService.getOrderById).toHaveBeenCalledTimes(1);
    });
  });

  /*
  describe('GET /orders/:userId', () => {
    it('should return all orders by the specified user id', async () => {
      const rows = [valid, { ...valid, order_id: 2 }];
      mockService.getOrdersByUserId.mockResolvedValue(rows);
      const res = await controller.getOrdersByUserId(2);
      expect(res).toEqual(rows);
      expect(mockService.getOrdersByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundExcept if user id is not found', async () => {
      mockService.getOrdersByUserId.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(controller.getOrdersByUserId(-1)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(mockService.getOrdersByUserId).toHaveBeenCalledTimes(1);
    });
  });
  */

  describe('GET /orders/:id/items', () => {
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
    ];

    it('should return all items of a specified order id', async () => {
      mockService.getOrderItems.mockResolvedValueOnce(orderItems);
      const res = await controller.getOrderItems(1);
      expect(res).toEqual(orderItems);
      expect(mockService.getOrderItems).toHaveBeenCalledWith(1);
      expect(mockService.getOrderItems).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if id is not found', async () => {
      mockService.getOrderItems.mockRejectedValueOnce(new NotFoundException());
      await expect(controller.getOrderItems(-1)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(mockService.getOrderItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /orders/:id/supplier-orders', () => {
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

    it('should return all supplier orders of a specified order id', async () => {
      mockService.getSupplierOrders.mockResolvedValueOnce(supplierOrders);
      const res = await controller.getSupplierOrders(1);
      expect(res).toEqual(supplierOrders);
      expect(mockService.getSupplierOrders).toHaveBeenCalledWith(1);
      expect(mockService.getSupplierOrders).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if order id is not found', async () => {
      mockService.getSupplierOrders.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(controller.getSupplierOrders(-1)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(mockService.getSupplierOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /orders/:id', () => {
    const update = { status: OrderStatus.COMPLETE };
    const updatedRow = {
      ...valid,
      status: update.status,
    };

    it('should update the status of an existing order', async () => {
      mockService.updateOrder.mockResolvedValueOnce(updatedRow);
      const res = await controller.updateOrder(1, update);

      expect(res).toEqual(updatedRow);
      expect(mockService.updateOrder).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if variant does not exist', async () => {
      mockService.updateOrder.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateOrder(-1, update)).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
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

      const expectedResult = {
        order_id: 1,
        grand_total: 19.96,
        supplier_orders: [1],
        items_count: 2,
      };

      mockService.createOrder.mockResolvedValueOnce(expectedResult);
      const res = await controller.createOrder(createDto);
      expect(res).toEqual(expectedResult);
      expect(mockService.createOrder).toHaveBeenCalledWith(createDto);
      expect(mockService.createOrder).toHaveBeenCalledTimes(1);
    });
  });
});
