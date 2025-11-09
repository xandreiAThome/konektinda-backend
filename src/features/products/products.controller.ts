import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import type { CreateProductsDto } from './dto/createproducts.dto';
import type { UpdateProductsDto } from './dto/updateprodcuts.dto';
import { Product } from 'db/schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getSingleProduct(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductsDto): Promise<Product> {
    return this.productsService.createProduct(dto);
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductsDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}
