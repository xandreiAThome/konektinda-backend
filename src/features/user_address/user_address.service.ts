import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { user_addresses } from 'db/schema';
import type { UserAddress } from 'db/schema';
import { eq } from 'drizzle-orm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressService {
  async create(dto: CreateUserAddressDto): Promise<UserAddress> {
    const [address] = await db.insert(user_addresses).values(dto).returning();
    return address;
  }

  async findAll(): Promise<
    Awaited<ReturnType<typeof db.query.user_addresses.findMany>>
  > {
    return db.query.user_addresses.findMany({
      with: {
        user: true,
      },
    });
  }

  async findMyAddresses(): Promise<
    Awaited<ReturnType<typeof db.query.user_addresses.findMany>>
  > {
    // Placeholder user ID; replace with actual authenticated user ID retrieval logic
    const authenticatedUserId = 1;
    return db.query.user_addresses.findMany({
      where: eq(user_addresses.user_id, authenticatedUserId),
      with: {
        user: true,
      },
    });
  }

  async findById(
    id: number,
  ): Promise<Awaited<ReturnType<typeof db.query.user_addresses.findFirst>>> {
    const address = await db.query.user_addresses.findFirst({
      where: eq(user_addresses.address_id, id),
      with: {
        user: true,
      },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async findByUserId(
    userId: number,
  ): Promise<Awaited<ReturnType<typeof db.query.user_addresses.findMany>>> {
    return db.query.user_addresses.findMany({
      where: eq(user_addresses.user_id, userId),
      with: {
        user: true,
      },
    });
  }

  async update(id: number, dto: UpdateUserAddressDto): Promise<UserAddress> {
    const [address] = await db
      .update(user_addresses)
      .set(dto)
      .where(eq(user_addresses.address_id, id))
      .returning();

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async delete(id: number): Promise<string> {
    const result = await db
      .delete(user_addresses)
      .where(eq(user_addresses.address_id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return `Address with ID ${id} has been deleted.`;
  }
}
