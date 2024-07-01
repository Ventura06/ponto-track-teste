import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesStatusService } from './vehicles_status.service';

@ApiBearerAuth()
@Controller('vehicles-status')
export class VehiclesStatusController {
  constructor(private readonly vehiclesStatusService: VehiclesStatusService) {}

  @Get()
  async findAll() {
    return await this.vehiclesStatusService.findAll();
  }
}
