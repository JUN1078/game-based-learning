import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CorosUploadDto {
  @IsNumber()
  @Type(() => Number)
  activeCalories: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  trainingLoad?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  durationMinutes?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  avgHr?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxHr?: number;

  @IsOptional()
  @IsString()
  recoveryStatus?: string;

  @IsOptional()
  @IsString()
  rawText?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
