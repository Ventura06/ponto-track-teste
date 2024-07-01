import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleStatus } from './entities/vehicles_status.entity';

@Injectable()
export class VehiclesStatusService {
  constructor(
    @InjectRepository(VehicleStatus)
    private vehiclesRepository: Repository<VehicleStatus>,
  ) {}

  async findAll(): Promise<VehicleStatus[]> {
    return this.vehiclesRepository.query('SELECT * FROM t_vehicle_status');
  }
}
