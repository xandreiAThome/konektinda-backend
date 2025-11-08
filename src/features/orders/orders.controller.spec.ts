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

      mockService.getAllOrders.mockResolvedValue(allOrders);
      const res = await controller.getAllOrders();
      expect(res).toEqual(allOrders);
      expect(mockService.getAllOrders).toHaveBeenCalledTimes(1);
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

    it('should return all items of a specified order id', async () => {
      mockService.getOrderItems.mockResolvedValueOnce(orderItems);
      const res = await mockService.getOrderItems(1);
      expect(res).toEqual(orderItems);
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
      const res = await mockService.getSupplierOrders(1);
      expect(res).toEqual(supplierOrders);
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
    it.todo('should create a new order');
  });
});
