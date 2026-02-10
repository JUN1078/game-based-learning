import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class EnergyQueryDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  neatAdjustment?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  recoveryModifier?: number;
}
