import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductVariantsService } from './product_variants.service';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProductVariant(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    return this.productVariantsService.createProductVariant(
      createProductVariantDto,
    );
  }

  @Get()
  getAllProductVariants(@Query('is_active') is_active: boolean) {
    return this.productVariantsService.getAllProductVariants(is_active);
  }

  @Get(':id')
  getProductVariantById(
    @Param('id', ParseIntPipe) id: number,
    @Query('is_active') is_active: boolean,
  ) {
    return this.productVariantsService.getProductVariantById(id, is_active);
  }

  @Patch(':id')
  updateProductVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.updateProductVariant(
      id,
      updateProductVariantDto,
    );
  }

  @Delete(':id')
  deleteProductVariant(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantsService.deleteProductVariant(id);
  }
}
