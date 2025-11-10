import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from 'database';
import { carts, cart_items, product_variants, users } from 'db/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CartsService {
  // helper to resolve DB user id from Firebase UID
  private async getUserIdByFirebaseUid(firebaseUid: string): Promise<number> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebase_uid, firebaseUid));

    if (!user) {
      throw new NotFoundException(`User with UID ${firebaseUid} not found.`);
    }

    return user.user_id;
  }

  // helper to get cart id from Firebase UID
  async getCartByFirebaseUid(firebaseUid: string) {
    const userId = await this.getUserIdByFirebaseUid(firebaseUid);

    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, userId));

    if (!cart) {
      throw new NotFoundException(`Cart for user id ${userId} not found.`);
    }

    return cart;
  }

  async createCart(firebaseUid: string) {
    const userId = await this.getUserIdByFirebaseUid(firebaseUid);

    const [cart] = await db
      .insert(carts)
      .values({ user_id: userId })
      .returning();

    return cart;
  }

  async deleteCart(firebaseUid: string) {
    const userId = await this.getUserIdByFirebaseUid(firebaseUid);

    const [deletedCart] = await db
      .delete(carts)
      .where(eq(carts.user_id, userId))
      .returning();

    if (!deletedCart) {
      throw new NotFoundException(`Cart of user id ${userId} not found.`);
    }
  }

  // FUNCTION FOR DEBUG ROUTE TO GET ALL CARTS
  async getAllCarts(
    userId?: number,
  ): Promise<Awaited<ReturnType<typeof db.query.carts.findMany>>> {
    const where = userId ? eq(carts.user_id, userId) : undefined;

    return db.query.carts.findMany({
      where,
      with: {
        user: true,
        items: {
          with: {
            variant: true,
          },
        },
      },
    });
  } /*
  Cart Item functions below
  */

  async getCartItems(firebaseUid: string) {
    const cart = await this.getCartByFirebaseUid(firebaseUid);

    const items = await db
      .select()
      .from(cart_items)
      .where(eq(cart_items.cart_id, cart.cart_id));

    return items;
  }

  async getCartItemByVariantId(firebaseUid: string, productVariantId: number) {
    const cart = await this.getCartByFirebaseUid(firebaseUid);

    const [item] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cart.cart_id),
          eq(cart_items.product_variant_id, productVariantId),
        ),
      );

    if (!item) {
      throw new NotFoundException(
        `Cart item with product variant ${productVariantId} not found.`,
      );
    }

    return item;
  }

  async addCartItem(
    firebaseUid: string,
    productVariantId: number,
    quantity: number,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer.');
    }

    const cart = await this.getCartByFirebaseUid(firebaseUid);

    // verify variant exists
    const [variant] = await db
      .select()
      .from(product_variants)
      .where(eq(product_variants.product_variant_id, productVariantId));

    if (!variant) {
      throw new BadRequestException('Invalid product variant ID.');
    }

    // verify if right quantity is selected
    if (variant.stock < quantity) {
      throw new BadRequestException('Too much quantity. Not enough stock.');
    }

    if (!variant.is_active) {
      throw new BadRequestException('Product variant is inactive.');
    }

    // if already in cart, throw error
    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cart.cart_id),
          eq(cart_items.product_variant_id, productVariantId),
        ),
      );

    if (existingItem) {
      throw new BadRequestException('Item is already in cart.');
    }

    // insert new cart item if no errors.
    const [item] = await db
      .insert(cart_items)
      .values({
        cart_id: cart.cart_id,
        product_variant_id: productVariantId,
        quantity,
        unit_price: variant.price,
        discount_applied: variant.discount,
      })
      .returning();

    return item;
  }

  async updateCartItem(
    firebaseUid: string,
    productVariantId: number,
    quantity?: number,
  ) {
    const cart = await this.getCartByFirebaseUid(firebaseUid);

    // get latest product variant details
    const [variant] = await db
      .select()
      .from(product_variants)
      .where(eq(product_variants.product_variant_id, productVariantId));

    if (!variant) {
      throw new NotFoundException(
        `Product variant ${productVariantId} not found.`,
      );
    }

    // verify that product item is still active
    if (!variant.is_active) {
      throw new NotFoundException(
        `Product variant ${productVariantId} is inactive.`,
      );
    }

    // get existing cart item
    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cart.cart_id),
          eq(cart_items.product_variant_id, productVariantId),
        ),
      );

    if (!existingItem) {
      throw new NotFoundException(
        `Cart item with variant ${productVariantId} not found.`,
      );
    }

    // verify that quantity is valid
    if (quantity !== undefined) {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestException('Quantity must be a positive integer.');
      }
      if (variant.stock < quantity) {
        throw new BadRequestException('Too much quantity. Not enough stock.');
      }
    }

    // update cart item with latest variant info
    const [updated] = await db
      .update(cart_items)
      .set({
        quantity: quantity ?? existingItem.quantity,
        unit_price: variant.price,
        discount_applied: variant.discount,
        date_priced: new Date(), // always update to now
      })
      .where(eq(cart_items.cart_item_id, existingItem.cart_item_id))
      .returning();

    return updated;
  }

  async deleteCartItem(firebaseUid: string, productVariantId: number) {
    const cart = await this.getCartByFirebaseUid(firebaseUid);

    const [deleted] = await db
      .delete(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cart.cart_id),
          eq(cart_items.product_variant_id, productVariantId),
        ),
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException(
        `Cart item with variant ${productVariantId} not found.`,
      );
    }

    return deleted;
  }
}
