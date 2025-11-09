import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { carts, users } from 'db/schema';
import { eq } from 'drizzle-orm';

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
}
