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
import {
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseCategoryDto } from './dto/response-product_category.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @ApiOperation({ summary: 'Creates and returns a new product category' })
  @ApiOkResponse({
    description: 'Product category is created',
    type: ResponseCategoryDto,
  })
  @Post()
  createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoriesService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @ApiOperation({
    summary: 'Returns an array of all product categories in the system',
  })
  @ApiOkResponse({
    description: 'Successfully fetched all product categories',
    type: ResponseCategoryDto,
    isArray: true,
  })
  @Get()
  getAllProductCategories() {
    return this.productCategoriesService.getAllProductCategories();
  }

  @ApiOperation({
    summary: 'Returns a single product category based on product category id',
  })
  @ApiOkResponse({
    description: 'Successfully fetched the specified product category',
    type: ResponseCategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Product category not found' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product category ID',
    example: 1,
  })
  @Get(':id')
  getProductCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.getProductCategoryById(id);
  }

  @ApiOperation({
    summary:
      'Updates and returns a product category based on product category id',
  })
  @ApiOkResponse({
    description: 'Successfully updated the product category',
    type: ResponseCategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Product category not found',
  })
  @ApiBody({
    type: UpdateProductCategoryDto,
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product category ID',
    example: 42,
  })
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

  @ApiOperation({
    summary: 'Deletes a product category based on product category id',
  })
  @ApiNoContentResponse({
    description: 'Successfully deleted the product category',
  })
  @ApiNotFoundResponse({
    description: 'Product category not found',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product category ID',
    example: 42,
  })
  @Delete(':id')
  deleteProductCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.deleteProductCategory(+id);
  }
}
