import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductVariantsService } from './product_variants.service';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) {}

  @Post()
  createProductVariant(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantsService.createProductVariant(createProductVariantDto);
  }

  @Get()
  getAllProductVariants() {
    return this.productVariantsService.getAllProductVariants();
  }

  @Get(':id')
  getProductVariantById(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantsService.getProductVariantById(id);
  }

  @Patch(':id')
  updateProductVariant(@Param('id', ParseIntPipe) id: number, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantsService.updateProductVariant(id, updateProductVariantDto);
  }

  @Delete(':id')
  deleteProductVariant(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantsService.deleteProductVariant(id);
  }
}
