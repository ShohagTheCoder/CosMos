import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDate,
} from 'class-validator';

export class CreateStockDto {
    @IsNotEmpty()
    @IsString()
    readonly SKU: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly stock: number;

    @IsOptional()
    @IsString()
    readonly lastSupplier?: string;

    @IsOptional()
    @IsString()
    readonly lastReceiver?: string;

    @IsOptional()
    @IsDate()
    readonly lastStockedDate?: Date;
}
