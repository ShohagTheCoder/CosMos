// import {
//     IsNotEmpty,
//     IsString,
//     IsNumber,
//     IsArray,
//     IsOptional,
//     IsMongoId,
//     ValidateNested,
//     IsMap,
//     IsObject,
//     IsDate,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { Unit } from './unit.dto'; // Adjust path if needed
// import { Price } from './price.dto'; // Adjust path if needed
// import { Measurement } from './measurement.dto'; // Adjust path if needed

// export class CreateProductDto {
//     @IsNotEmpty()
//     @IsString()
//     readonly name: string;

//     @IsNotEmpty()
//     @IsString()
//     readonly description: string;

//     @IsNotEmpty()
//     @IsMap()
//     @ValidateNested({ each: true })
//     @Type(() => Unit) // Transform plain objects to instances of Unit class
//     readonly units: Map<string, Unit>;

//     @IsNotEmpty()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => Price) // Transform plain objects to instances of Price class
//     readonly prices: Price[];

//     @IsNotEmpty()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => Measurement) // Transform plain objects to instances of Measurement class
//     readonly measurements: Measurement[];

//     @IsNotEmpty()
//     @IsNumber()
//     readonly price: number;

//     @IsOptional()
//     @IsNumber()
//     readonly discount?: number;

//     @IsOptional()
//     @IsNumber()
//     readonly extraDiscount?: number;

//     @IsOptional()
//     @IsNumber()
//     readonly quantity?: number;

//     @IsOptional()
//     @IsMongoId()
//     readonly stock?: string; // Assuming stock is an ObjectId

//     @IsOptional()
//     @IsString()
//     readonly createdBy?: string;

//     @IsOptional()
//     @IsDate()
//     readonly createdAt?: Date;

//     @IsOptional()
//     @IsDate()
//     readonly updatedAt?: Date;
// }
