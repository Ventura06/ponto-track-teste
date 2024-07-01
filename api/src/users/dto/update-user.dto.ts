import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  first_name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  last_name: string;
  @ApiPropertyOptional()
  @IsOptional()
  current_password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  new_password?: string;
}
