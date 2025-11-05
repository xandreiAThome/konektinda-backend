import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateProductVariantDto {
    @IsInt()
    product_id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    variant_name: string;

    @IsInt()
    stock: number;

    @IsNumber()
    price: number;

    @IsInt()
    discount: number;

    @IsBoolean()
    is_active: boolean;
}
