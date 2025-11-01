import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppliersService {
    async getAllSuppliers() {}

    async getSupplierById(id: number) {}

    async createSupplier(supplierData: any) {}

    async updateSupplier(id: number, supplierData: any) {}

    async deleteSupplier(id: number) {}
    
}
