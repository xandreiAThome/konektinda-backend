import { Controller } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @Get()
    getAllSuppliers() {
        return this.suppliersService.getAllSuppliers();
    }


}
