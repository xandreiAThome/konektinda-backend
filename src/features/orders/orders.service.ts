import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from 'src/enums';
import {
  cart_items,
  carts,
  order_items,
  orders,
  product_variants,
  products,
  supplier_orders,
} from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from 'database';
const money = (n: number) => Number(n.toFixed(2));

@Injectable()
export class OrdersService {
  async getAllOrders(
    status?: OrderStatus,
    userId?: number,
  ): Promise<Awaited<ReturnType<typeof db.query.orders.findMany>>> {
    const filter = and(
      status !== undefined ? eq(orders.status, status) : undefined,
      userId !== undefined ? eq(orders.user_id, userId) : undefined,
    );

    return db.query.orders.findMany({
      where: filter,
      with: {
        user: true,
        payment: true,
      },
    });
  }

  async getOrderById(
    id: number,
  ): Promise<Awaited<ReturnType<typeof db.query.orders.findFirst>>> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.order_id, id),
      with: {
        user: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found.`);
    }

    return order;
  }

  /*
  async getOrdersByUserId(id: number, status?: OrderStatus) {
    const filter =
      status !== undefined
        ? and(eq(orders.user_id, id), eq(orders.status, status))
        : eq(orders.user_id, id);

    const rows = await db.select().from(orders).where(filter);

    if (rows.length === 0) {
      throw new NotFoundException(`Order with user id ${id} not found.`);
    }

    return rows;
  }
    */

  async getOrderItems(id: number) {
    const orderItems = await db
      .select({
        orderItem: order_items,
        supplierOrder: supplier_orders,
        order: orders,
      })
      .from(order_items)
      .innerJoin(
        supplier_orders,
        eq(order_items.supplier_order_id, supplier_orders.supplier_order_id),
      )
      .innerJoin(orders, eq(supplier_orders.order_id, orders.order_id))
      .where(eq(orders.order_id, id));

    if (orderItems.length === 0) {
      throw new NotFoundException(
        `Order with id ${id} not found or has no items.`,
      );
    }

    return orderItems;
  }

  async getSupplierOrders(id: number) {
    const rows = await db
      .select()
      .from(supplier_orders)
      .where(eq(supplier_orders.order_id, id));

    if (rows.length === 0) {
      throw new NotFoundException(
        `Order with id ${id} not found or has no supplier orders.`,
      );
    }

    return rows;
  }

  // I'm dying. We should refactor this function bruh frfr
  async createOrder(dto: CreateOrderDto) {
    // Check if the cart for the user exists
    const userCart = await db
      .select({ cart_id: carts.cart_id })
      .from(carts)
      .where(eq(carts.user_id, dto.user_id))
      .limit(1);

    if (userCart.length === 0) {
      throw new NotFoundException(`Cart for user ${dto.user_id} not found.`);
    }

    const cartId = userCart[0].cart_id;

    // Create the order in a single transaction
    return db.transaction(async (tx) => {
      // Pull cart items joined to variants so we know supplier_id
      const rows = await tx
        .select({
          cartItemId: cart_items.cart_item_id,
          productVariantId: cart_items.product_variant_id,
          quantity: cart_items.quantity,
          unitPrice: cart_items.unit_price,
          discount: cart_items.discount_applied,
          supplierId: products.supplier_id,
        })
        .from(cart_items)
        .innerJoin(
          product_variants,
          eq(
            cart_items.product_variant_id,
            product_variants.product_variant_id,
          ),
        )
        .innerJoin(
          products,
          eq(product_variants.product_id, products.product_id),
        )
        .where(eq(cart_items.cart_id, cartId));

      if (rows.length === 0) {
        throw new NotFoundException(`Cart ${cartId} has no items.`);
      }

      // Compute totals
      type Row = (typeof rows)[number];
      const bySupplier = new Map<number, Row[]>();
      for (const r of rows) {
        if (!bySupplier.has(r.supplierId)) bySupplier.set(r.supplierId, []);
        bySupplier.get(r.supplierId)!.push(r);
      }

      const supplierSubtotals: Array<{ supplierId: number; subtotal: number }> =
        [];
      for (const [supplierId, items] of bySupplier.entries()) {
        const subtotal = money(
          items.reduce(
            (sum, i) => sum + i.unitPrice * i.quantity - (i.discount ?? 0),
            0,
          ),
        );
        supplierSubtotals.push({ supplierId, subtotal });
      }

      const computedGrandTotal = money(
        supplierSubtotals.reduce((sum, s) => sum + s.subtotal, 0),
      );

      // Validate client-sent grand_total
      if (
        dto.grand_total != null &&
        money(dto.grand_total) !== computedGrandTotal
      ) {
        throw new BadRequestException(
          `grand_total mismatch. expected ${computedGrandTotal}, got ${dto.grand_total}`,
        );
      }

      // Create the order (use computed grand total; order_date can default)
      const [orderRow] = await tx
        .insert(orders)
        .values({
          user_id: dto.user_id,
          grand_total: computedGrandTotal,
          payment_id: dto.payment_id,
        })
        .returning({ order_id: orders.order_id });

      const orderId = orderRow.order_id;

      // Create supplier orders
      const supplierOrderValues = supplierSubtotals.map((s) => ({
        order_id: orderId,
        supplier_id: s.supplierId,
        subtotal: s.subtotal,
        supplier_order_num: crypto.randomUUID(),
        shipping: 0, // I realized I don't know how to compute shipping so it's just perma 0 for now. We might need an extra table for shipping rates
        total_price: s.subtotal,
      }));

      const insertedSupplierOrders = await tx
        .insert(supplier_orders)
        .values(supplierOrderValues)
        .returning({
          supplier_order_id: supplier_orders.supplier_order_id,
          supplier_id: supplier_orders.supplier_id,
        });

      const supplierOrderIdBySupplier = new Map<number, number>();
      for (const so of insertedSupplierOrders) {
        supplierOrderIdBySupplier.set(so.supplier_id, so.supplier_order_id);
      }

      // Transfer cart items to order items
      const orderItemValues = rows.map((r) => ({
        supplier_order_id: supplierOrderIdBySupplier.get(r.supplierId)!,
        product_variant_id: r.productVariantId,
        quantity: r.quantity,
        unit_price: r.unitPrice,
        discount_applied: r.discount ?? 0,
      }));

      await tx.insert(order_items).values(orderItemValues);

      // Clear the cart now that it’s checked out
      await tx.delete(cart_items).where(eq(cart_items.cart_id, cartId));

      // Return summary
      return {
        order_id: orderId,
        grand_total: computedGrandTotal,
        supplier_orders: insertedSupplierOrders.map((x) => x.supplier_order_id),
        items_count: orderItemValues.length,
      };
    });
  }

  async updateOrder(id: number, statusDto: UpdateOrderDto) {
    const [updatedRow] = await db
      .update(orders)
      .set({ ...statusDto })
      .where(eq(orders.order_id, id))
      .returning();

    if (!updatedRow) {
      throw new NotFoundException(`Order with id ${id} not found.`);
    }

    return updatedRow;
  }
}
