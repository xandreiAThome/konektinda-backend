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
import type { Product } from 'interface/product';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id', ParseIntPipe) id: number): Product {
    return this.productsService.getSingleProduct(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() createProductDto: CreateProductsDto): Product {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductsDto,
  ): Product {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number): void {
    this.productsService.deleteProduct(id);
  }
}
