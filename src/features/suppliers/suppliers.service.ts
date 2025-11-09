import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'database';
import { Supplier, suppliers } from 'db/schema';
import { eq } from 'drizzle-orm';
import { CreateSupplierDto } from './dto/createsupplier.dto';
import { UpdateSupplierDto } from './dto/updatesupplier.dto';

@Injectable()
export class SuppliersService {
  async getAllSuppliers(): Promise<Supplier[]> {
    return db.select().from(suppliers);
  }

  async getSupplierById(id: number): Promise<Supplier> {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.supplier_id, id));

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
    const [supplier] = await db
      .insert(suppliers)
      .values({
        supplier_name: dto.supplier_name,
        supplier_description: dto.supplier_description,
      })
      .returning();

    return supplier;
  }

  async updateSupplier(
    id: number,
    supplierData: UpdateSupplierDto,
  ): Promise<Supplier> {
    const [supplier] = await db
      .update(suppliers)
      .set(supplierData)
      .where(eq(suppliers.supplier_id, id))
      .returning();

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async deleteSupplier(id: number) {
    const [deleted] = await db
      .delete(suppliers)
      .where(eq(suppliers.supplier_id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  }
}
