import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/createsupplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  getAllSuppliers() {
    return this.suppliersService.getAllSuppliers();
  }

  @Get(':id')
  getSupplierById(@Param('id') id: number) {
    return this.suppliersService.getSupplierById(id);
  }

  @Post()
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.createSupplier(dto);
  }

  @Patch(':id')
  updateSupplier(@Param('id') id: number, @Body() dto: CreateSupplierDto) {
    return this.suppliersService.updateSupplier(id, dto);
  }

  @Delete(':id')
  deleteSupplier(@Param('id') id: number) {
    return this.suppliersService.deleteSupplier(id);
  }
}
