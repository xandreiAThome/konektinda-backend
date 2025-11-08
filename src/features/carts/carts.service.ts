import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { db } from 'database';
import { carts } from 'db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CartsService {
  async getCartByUserId(userId: number) {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, userId));
    if (!cart) {
      throw new NotFoundException(`Cart for user id ${userId} not found.`);
    }
    return cart;
  }

  // dto should ideally contain logged in user id
  async createCart(dto: CreateCartDto) {
    const [cart] = await db
      .insert(carts)
      .values({ ...dto })
      .returning();

    return cart;
  }

  // This should delete all cart items as well due to cascade delete in schema
  async deleteCart(userId: number) {
    const [deletedCart] = await db
      .delete(carts)
      .where(eq(carts.user_id, userId))
      .returning();

    if (!deletedCart) {
      throw new NotFoundException(`Cart of user id ${userId} not found.`);
    }
  }
}
