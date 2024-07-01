import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  make: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  model: string;

  @ApiProperty({ example: '2023' })
  @IsString()
  @IsNotEmpty()
  @Length(4)
  year: string;

  @ApiProperty({ example: '1HGCM82633A123456' })
  @IsString()
  @IsNotEmpty()
  @Length(17)
  vin: string;

  @ApiProperty({ example: 'ABC1234' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  license_plate: string;
}
