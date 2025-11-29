import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/createsupplier.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: 200,
    description: 'List of all suppliers returned successfully.',
  })
  getAllSuppliers() {
    return this.suppliersService.getAllSuppliers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Supplier found and returned.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  getSupplierById(@Param('id') id: number) {
    return this.suppliersService.getSupplierById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({ status: 201, description: 'Supplier created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.createSupplier(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  updateSupplier(@Param('id') id: number, @Body() dto: CreateSupplierDto) {
    return this.suppliersService.updateSupplier(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  deleteSupplier(@Param('id') id: number) {
    return this.suppliersService.deleteSupplier(id);
  }
}
