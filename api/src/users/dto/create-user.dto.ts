import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    example: 'email@mail.com',
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  @ApiProperty({
    example: 'John',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  first_name: string;
  @ApiProperty({
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  last_name: string;
}
