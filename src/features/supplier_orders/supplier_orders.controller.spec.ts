import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOrdersController } from './supplier_orders.controller';
import { SupplierOrdersService } from './supplier_orders.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../../enums';

const mockService = {
  getAllSupplierOrders: jest.fn(),
  getSupplierOrderById: jest.fn(),
  getSupplierOrdersBySupplierId: jest.fn(),
  getSupplierOrderItems: jest.fn(),
  updateSupplierOrder: jest.fn(),
};

describe('SupplierOrdersController', () => {
  let controller: SupplierOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierOrdersController],
      providers: [
        {
          provide: SupplierOrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SupplierOrdersController>(SupplierOrdersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /supplier-orders', () => {
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

      mockService.getAllSupplierOrders.mockResolvedValue(allSupplierOrders);
      const res = await controller.getAllSupplierOrders();
      expect(res).toEqual(allSupplierOrders);
      expect(mockService.getAllSupplierOrders).toHaveBeenCalledTimes(1);
    });
  });

  // Constant product variant used in tests below
  const valid = {
    order_id: 1,
    supplier_id: 2,
    supplier_order_num: '123ABCD',
    subtotal: 4.99,
    shipping: 20,
    total_price: 24.99,
    status: 'PENDING',
  };

  describe('GET /supplier-orders/:id', () => {
    it('should return the correct supplier order based on id', async () => {
      mockService.getSupplierOrderById.mockResolvedValue(valid);
      const res = await controller.getSupplierOrderById(1);
      expect(res).toEqual(valid);
      expect(mockService.getSupplierOrderById).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if supplier order does not exist', async () => {
      mockService.getSupplierOrderById.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(controller.getSupplierOrderById(-1)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(mockService.getSupplierOrderById).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /supplier-orders/:supplierId', () => {
    it('should return all supplier orders by the specified supplier id', async () => {
      const rows = [valid, { ...valid, supplier_order_id: 2 }];
      mockService.getSupplierOrdersBySupplierId.mockResolvedValue(rows);
      const res = await controller.getSupplierOrdersBySupplierId(2);
      expect(res).toEqual(rows);
      expect(mockService.getSupplierOrdersBySupplierId).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return a NotFoundExcept if supplier id is not found', async () => {
      mockService.getSupplierOrdersBySupplierId.mockRejectedValueOnce(
        new NotFoundException(),
      );

      await expect(
        controller.getSupplierOrdersBySupplierId(-1),
      ).rejects.toThrow(new NotFoundException());

      expect(mockService.getSupplierOrdersBySupplierId).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('GET /supplier-orders/:id/items', () => {
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

    it('should return all items of a specified supplier order id', async () => {
      mockService.getSupplierOrderItems.mockResolvedValueOnce(orderItems);
      const res = await mockService.getSupplierOrderItems(1);
      expect(res).toEqual(orderItems);
      expect(mockService.getSupplierOrderItems).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if id is not found', async () => {
      mockService.getSupplierOrderItems.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(controller.getSupplierOrderItems(-1)).rejects.toThrow(
        new NotFoundException(),
      );
      expect(mockService.getSupplierOrderItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /supplier-orders/:id', () => {
    const update = { status: OrderStatus.COMPLETE };
    const updatedRow = {
      supplier_order_id: 1,
      ...valid,
      status: update.status,
    };

    it('should update the status of an existing supplier order', async () => {
      mockService.updateSupplierOrder.mockResolvedValueOnce(updatedRow);
      const res = await controller.updateSupplierOrder(1, update);

      expect(res).toEqual(updatedRow);
      expect(mockService.updateSupplierOrder).toHaveBeenCalledTimes(1);
    });

    it('should return a NotFoundException if variant does not exist', async () => {
      mockService.updateSupplierOrder.mockRejectedValueOnce(
        new NotFoundException('Product variant not found.'),
      );

      await expect(controller.updateSupplierOrder(-1, update)).rejects.toThrow(
        new NotFoundException('Product variant not found.'),
      );
    });
  });
});
