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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/createproducts.dto';
import { UpdateProductsDto } from './dto/updateprodcuts.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { Product } from 'db/schema';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves all products with their categories and variants',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products',
    type: [ResponseProductDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single product',
    description: 'Retrieves a product by ID with its category and variants',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product',
    type: ResponseProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  getSingleProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getSingleProduct(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product in the system',
  })
  @ApiBody({ type: CreateProductsDto })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ResponseProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  createProduct(@Body() dto: CreateProductsDto): Promise<Product> {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing product by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiBody({ type: UpdateProductsDto })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ResponseProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or ID format',
  })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductsDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a product by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Product successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}
