import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './createsupplier.dto';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
