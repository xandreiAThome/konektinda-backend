import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'database';
import { Cart, carts } from 'db/carts/carts.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  async createCart(dto: CreateCartDto): Promise<Cart> {
    const [newCart] = await db
      .insert(carts)
      .values({
        user_id: dto.user_id,
      })
      .returning();
    return newCart;
  }

  async getAllCarts(): Promise<Cart[]> {
    return db.select().from(carts);
  }

  async getCartById(id: number): Promise<Cart> {
    const [cart] = await db.select().from(carts).where(eq(carts.cart_id, id));
    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }
    return cart;
  }

  async getCartByUserId(userId: number): Promise<Cart> {
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.user_id, userId));
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }
    return cart;
  }

  async updateCart(id: number, dto: UpdateCartDto): Promise<Cart> {
    const updateData: Partial<Cart> = {};
    if (dto.user_id !== undefined) {
      updateData.user_id = dto.user_id;
    }

    const [updatedCart] = await db
      .update(carts)
      .set(updateData)
      .where(eq(carts.cart_id, id))
      .returning();

    if (!updatedCart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }
    return updatedCart;
  }

  async deleteCart(id: number): Promise<void> {
    const [deletedCart] = await db
      .delete(carts)
      .where(eq(carts.cart_id, id))
      .returning();
    if (!deletedCart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }
  }
}
