import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsDto } from './createproducts.dto';

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}