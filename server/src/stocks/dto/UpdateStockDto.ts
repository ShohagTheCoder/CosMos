import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class UpdateStockDto {
    @IsOptional()
    @IsString()
    readonly SKU?: string;

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsNumber()
    readonly stock?: number;

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
