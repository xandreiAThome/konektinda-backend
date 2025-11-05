import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ProductCategoriesService } from './product_categories.service';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoriesService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @Get()
  getAllProductCategories() {
    return this.productCategoriesService.getAllProductCategories();
  }

  @Get(':id')
  getProductCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.getProductCategoryById(id);
  }

  @Patch(':id')
  updateProductCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.updateProductCategory(
      +id,
      updateProductCategoryDto,
    );
  }

  @Delete(':id')
  deleteProductCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.deleteProductCategory(+id);
  }
}
