import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { CreateVehicleDto } from './create-vehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  make?: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  model?: string;

  @ApiPropertyOptional({ example: '2023' })
  @IsString()
  @IsOptional()
  @Length(4)
  year?: string;

  @ApiPropertyOptional({ example: '1HGCM82633A123456' })
  @IsString()
  @IsOptional()
  @Length(17)
  vin?: string;

  @ApiPropertyOptional({ example: 'ABC1234' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  license_plate?: string;
}
