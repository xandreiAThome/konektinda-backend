import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductsDto {

    @IsNumber()
    @IsNotEmpty()
    product_category_id: number;

    @IsNumber()
    @IsNotEmpty()
    supplier_id: number;

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    product_description: string;

    @IsBoolean()
    is_active: boolean;
}