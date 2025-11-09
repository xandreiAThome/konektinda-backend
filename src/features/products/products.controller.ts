import { Controller, Get, ParseIntPipe, Post, HttpCode, HttpStatus, Body, Patch, Delete, Param } from "@nestjs/common";
import { CreateProductsDto } from "./dto/createproducts.dto";
import { UpdateProductsDto } from "./dto/updateprodcuts.dto";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getSingleProduct(id);
  }

  @Post()
  createProduct(@Body() dto: CreateProductsDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductsDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
