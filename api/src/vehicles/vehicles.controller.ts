import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleFilterDto } from './dto/filter.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return this.vehiclesService.create(accessToken, createVehicleDto);
  }

  @Get()
  async findAll(@Query() filters: VehicleFilterDto, @Req() request: Request) {
    const accessToken = request.headers.authorization.split(' ')[1];
    return this.vehiclesService.findAll(accessToken, filters);
  }

  @Get(':vin')
  async findByVin(@Param('vin') vin: string) {
    return this.vehiclesService.findByVin(vin);
  }

  @Patch(':vin')
  async update(
    @Param('vin') vin: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(vin, updateVehicleDto);
  }

  @Delete(':vin')
  async remove(@Param('vin') vin: string) {
    return this.vehiclesService.remove(vin);
  }
}
