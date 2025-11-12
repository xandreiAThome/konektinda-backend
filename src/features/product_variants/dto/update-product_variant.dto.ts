import { PartialType } from '@nestjs/mapped-types';
import { CreateProductVariantDto } from './create-product_variant.dto';

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
