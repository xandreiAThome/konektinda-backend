import { IsBoolean, IsDecimal, IsInt, IsString, MaxLength } from "class-validator";

export class CreateProductVariantDto {
    @IsInt()
    product_id: number;

    @IsString()
    @MaxLength(100)
    variant_name: string;

    @IsInt()
    stock: number;

    @IsDecimal()
    price: number;

    @IsInt()
    discount: number;

    @IsBoolean()
    is_active: boolean;
}
