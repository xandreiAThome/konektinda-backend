// products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id') id: string) {
    return this.productsService.getSingleProduct(+id);
  }

  @Post()
  createProduct(@Body('name') name: string, @Body('price') price: number) {
    return this.productsService.createProduct(name, price);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
  ) {
    return this.productsService.updateProduct(+id, name, price);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }
}
