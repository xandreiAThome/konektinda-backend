import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseCategoryDto } from '../../product_categories/dto/response-product_category.dto';
import { ResponseSupplierDto } from '../../suppliers/dto/response-supplier.dto';
import { ResponseProductVariantDto } from 'src/features/product_variants/dto/response-product_variant.dto';
import { ResponseProductImageDto } from './respose-product_image.dto';

export class ResponseProductDto {
  @ApiProperty({ example: 1 })
  product_id: number;

  @ApiProperty({ example: 1 })
  product_category_id: number;

  @ApiProperty({ example: 1 })
  supplier_id: number;

  @ApiProperty({ example: 'Organic Apples' })
  product_name: string;

  @ApiPropertyOptional({ example: 'Fresh organic apples from local farms' })
  product_description: string | null;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiPropertyOptional({ type: () => ResponseCategoryDto })
  category?: ResponseCategoryDto;

  @ApiPropertyOptional({ type: () => [ResponseProductVariantDto] })
  variants?: ResponseProductVariantDto[];

  @ApiPropertyOptional({ type: () => ResponseSupplierDto })
  supplier?: ResponseSupplierDto;

  @ApiPropertyOptional({ type: () => [ResponseProductImageDto] })
  images?: ResponseProductImageDto[];
}
