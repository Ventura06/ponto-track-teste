import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VehicleFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by Vehicle Identification Number (VIN)',
  })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ description: 'Filter by license plate' })
  @IsOptional()
  @IsString()
  license_plate?: string;

  @ApiPropertyOptional({ description: 'Filter by model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Filter by vehicle status' })
  @IsOptional()
  @IsString()
  vehicle_status_id?: string;
}
