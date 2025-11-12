import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';
import { db } from 'database';
import { order_items, supplier_orders } from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { OrderStatus } from 'src/enums';

@Injectable()
export class SupplierOrdersService {
  async getAllSupplierOrders(status?: OrderStatus, supplierId?: number) {
    const filter = and(
      status !== undefined ? eq(supplier_orders.status, status) : undefined,
      supplierId !== undefined
        ? eq(supplier_orders.supplier_id, supplierId)
        : undefined,
    );

    return db.select().from(supplier_orders).where(filter);
  }

  async getSupplierOrderById(id: number) {
    const [row] = await db
      .select()
      .from(supplier_orders)
      .where(eq(supplier_orders.supplier_order_id, id));

    if (!row) {
      throw new NotFoundException(`Supplier order with id ${id} not found.`);
    }

    return row;
  }

  async getSupplierOrdersBySupplierId(
    supplierId: number,
    status?: OrderStatus,
  ) {
    const filter =
      status !== undefined
        ? and(
            eq(supplier_orders.supplier_id, supplierId),
            eq(supplier_orders.status, status),
          )
        : eq(supplier_orders.supplier_id, supplierId);

    const rows = await db.select().from(supplier_orders).where(filter);

    if (rows.length === 0) {
      throw new NotFoundException(
        `Supplier order with supplier id ${supplierId} not found.`,
      );
    }

    return rows;
  }

  async getSupplierOrderItems(id: number) {
    const items = await db
      .select()
      .from(order_items)
      .where(eq(order_items.supplier_order_id, id));

    if (items.length === 0) {
      throw new NotFoundException(`Supplier order with id ${id} not found.`);
    }

    return items;
  }

  async updateSupplierOrder(id: number, statusDto: UpdateSupplierOrderDto) {
    const [updatedRow] = await db
      .update(supplier_orders)
      .set({ ...statusDto })
      .where(eq(supplier_orders.supplier_order_id, id))
      .returning();

    if (!updatedRow) {
      throw new NotFoundException(`Supplier order with id ${id} not found.`);
    }

    return updatedRow;
  }
}
