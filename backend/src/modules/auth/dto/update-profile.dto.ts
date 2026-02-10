import { IsOptional, IsString, IsDateString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weightKg?: number;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsIn(['metric', 'imperial'])
  preferredUnits?: 'metric' | 'imperial';
}
