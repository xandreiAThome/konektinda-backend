import { Injectable } from '@nestjs/common';
import { db } from 'database';
import { NewUser, User, users } from 'db/schema';
import { eq } from 'drizzle-orm';

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
}
