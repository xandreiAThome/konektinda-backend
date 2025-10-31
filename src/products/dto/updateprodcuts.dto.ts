import { IsBoolean, IsNumber, IsString } from "class-validator";


export class UpdateProductsDto {
    @IsNumber()
    product_category_id?: number;

    @IsNumber()
    supplier_id?: number;

    @IsString()
    product_name?: string;

    @IsString()
    product_description?: string;

    @IsBoolean()
    is_active?: boolean;
}