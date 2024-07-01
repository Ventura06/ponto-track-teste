import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipAuth } from 'src/skip-auth/skip-auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findByCurrentToken(@Req() request: Request) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return await this.usersService.findByCurrentToken(accessToken);
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return await this.usersService.update(accessToken, updateUserDto);
  }

  @Delete()
  async delete(@Req() request: Request) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return await this.usersService.delete(accessToken);
  }
}
