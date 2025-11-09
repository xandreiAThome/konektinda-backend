import { Injectable } from '@nestjs/common';
import { db } from 'database';
import { NewUser, User, users } from 'db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/updateuser.dto';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  async findById(id: number): Promise<User> {
    const results = await db.select().from(users).where(eq(users.user_id, id));
    return results[0];
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const cleanDto = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(cleanDto).length === 0) {
      throw new Error('No values provided to update');
    }

    const [user] = await db
      .update(users)
      .set(cleanDto)
      .where(eq(users.user_id, id))
      .returning();

    return user;
  }

  async deleteUser(id: number): Promise<String> {
    await db.delete(users).where(eq(users.user_id, id));
    return `User with id ${id} has been deleted.`;
  }

}
