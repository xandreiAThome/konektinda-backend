import { Injectable } from '@nestjs/common';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';

@Injectable()
export class SupplierOrdersService {
  create(createSupplierOrderDto: CreateSupplierOrderDto) {
    return 'This action adds a new supplierOrder';
  }

  getAllSupplierOrders() {
    return `This action returns all supplierOrders`;
  }

  getSupplierOrderById(id: number) {
    return `This action returns a #${id} supplierOrder`;
  }

  getSupplierOrdersBySupplierId(supplierId: number) {
    return `This action returns a supplier #${supplierId} supplierOrder`;
  }

  getSupplierOrderItems(id: number) {
    return 'balls';
  }

  update(id: number, statusDto: UpdateSupplierOrderDto) {
    return `This action updates a #${id} supplierOrder`;
  }
}
