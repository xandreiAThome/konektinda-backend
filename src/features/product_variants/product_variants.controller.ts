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
import {
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseProductVariantDto } from './dto/response-product_variant.dto';
import { ResponseBasicProductVariantDto } from './dto/response-basic-product_variant.dto';
@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @ApiOperation({ summary: 'Creates and returns a new product variant' })
  @ApiOkResponse({
    description: 'Product variant is created',
    type: ResponseBasicProductVariantDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProductVariant(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    return this.productVariantsService.createProductVariant(
      createProductVariantDto,
    );
  }

  @ApiOperation({
    summary: 'Returns an array of all product variants in the system',
  })
  @ApiOkResponse({
    description: 'Successfully fetched all product variants',
    type: ResponseProductVariantDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    type: Boolean,
    description: 'Filter by active status (true/false)',
  })
  @Get()
  getAllProductVariants(@Query('is_active') is_active?: boolean) {
    return this.productVariantsService.getAllProductVariants(is_active);
  }

  @ApiOperation({
    summary: 'Returns a single product variant based on product variant id',
  })
  @ApiOkResponse({
    description: 'Successfully fetched the specified product variant',
    type: ResponseProductVariantDto,
  })
  @ApiNotFoundResponse({ description: 'Product variant not found' })
  @ApiQuery({
    name: 'is_active',
    required: false,
    type: Boolean,
    description: 'Filter by active status (true/false)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product variant ID',
    example: 1,
  })
  @Get(':id')
  getProductVariantById(
    @Param('id', ParseIntPipe) id: number,
    @Query('is_active') is_active?: boolean,
  ) {
    return this.productVariantsService.getProductVariantById(id, is_active);
  }

  @ApiOperation({
    summary:
      'Updates and returns a product variant based on product variant id',
  })
  @ApiOkResponse({
    description: 'Successfully updated the product variant',
    type: ResponseBasicProductVariantDto,
  })
  @ApiNotFoundResponse({
    description: 'Product variant not found',
  })
  @ApiBody({
    type: UpdateProductVariantDto,
    required: false,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product variant ID',
    example: 42,
  })
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

  @ApiOperation({
    summary: 'Deletes a product variant based on product variant id',
  })
  @ApiNoContentResponse({
    description: 'Successfully deleted the product variant',
  })
  @ApiNotFoundResponse({
    description: 'Product variant not found',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The product variant ID',
    example: 42,
  })
  @Delete(':id')
  deleteProductVariant(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantsService.deleteProductVariant(id);
  }
}
