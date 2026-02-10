import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FoodLogItemDto {
  @IsString()
  foodName: string;

  @IsOptional()
  @IsString()
  portion?: string;

  @IsNumber()
  @Type(() => Number)
  calories: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  confidenceScore?: number;
}

export class FoodLogRequestDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodLogItemDto)
  items?: FoodLogItemDto[];

  @IsOptional()
  @IsString()
  rawText?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
