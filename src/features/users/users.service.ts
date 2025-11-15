import { Injectable } from '@nestjs/common';
import { db } from 'database';
import { NewUser, User, users } from 'db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/updateuser.dto';

@Injectable()
export class UsersService {
  async findByEmail(
    email: string,
  ): Promise<Awaited<ReturnType<typeof db.query.users.findFirst>>> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        addresses: true,
        supplier: true,
      },
    });
    return result;
  }

  async createUser(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async findAll(): Promise<
    Awaited<ReturnType<typeof db.query.users.findMany>>
  > {
    return db.query.users.findMany({
      with: {
        addresses: true,
        supplier: true,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<Awaited<ReturnType<typeof db.query.users.findFirst>>> {
    return db.query.users.findFirst({
      where: eq(users.firebase_uid, id),
      with: {
        addresses: true,
        supplier: true,
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const [user] = await db
      .update(users)
      .set(dto)
      .where(eq(users.firebase_uid, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<string> {
    await db.delete(users).where(eq(users.firebase_uid, id));
    return `User with firebase_uid ${id} has been deleted.`;
  }
}
