import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class InBodyUploadDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skeletalMuscleMass?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bodyFatMass?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bodyFatPercent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fatFreeMass?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBodyWater?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bmr?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  visceralFat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ecwRatio?: number;

  @IsOptional()
  @IsString()
  rawText?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
