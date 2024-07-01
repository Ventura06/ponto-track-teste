import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { generateLatitude } from 'src/core/shared/utils';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleFilterDto } from './dto/filter.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(current_token: string, createVehicleDto: CreateVehicleDto) {
    const user = (
      await this.userRepository.query(
        `SELECT id FROM t_user WHERE current_token = $1`,
        [current_token],
      )
    )[0];

    if (!user) {
      throw new Error('User not found');
    }

    const vehicle = (
      await this.vehicleRepository.query(
        `INSERT INTO t_vehicle ("ownerId", make, model, year, vin, license_plate, "vehicleStatusId", latitude, longitude) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING make, model, year, vin, license_plate`,
        [
          user.id,
          createVehicleDto.make.toUpperCase(),
          createVehicleDto.model.toUpperCase(),
          createVehicleDto.year,
          createVehicleDto.vin.toUpperCase(),
          createVehicleDto.license_plate.toUpperCase(),
          randomInt(1, 3),
          generateLatitude(),
          generateLatitude(),
        ],
      )
    )[0];

    return vehicle;
  }

  async update(vin: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = (
      await this.vehicleRepository.query(
        `UPDATE t_vehicle SET make = $1, model = $2, year = $3, vin = $4, license_plate = $5 
         WHERE vin = $6 
         RETURNING make, model, year, vin, license_plate`,
        [
          updateVehicleDto.make,
          updateVehicleDto.model,
          updateVehicleDto.year,
          updateVehicleDto.vin,
          updateVehicleDto.license_plate,
          vin,
        ],
      )
    )[0];

    return vehicle;
  }

  async findAll(current_token: string, filters: VehicleFilterDto) {
    const user = (
      await this.userRepository.query(
        `SELECT id FROM t_user WHERE current_token = $1`,
        [current_token],
      )
    )[0];

    if (!user) {
      return null;
    }

    let query = `
      SELECT tv.make, tv.model, tv.year, tv.vin, tv.license_plate, tv.latitude, tv.longitude, tv."vehicleStatusId", tvs.vehicle_status
      FROM t_vehicle tv 
      LEFT JOIN t_vehicle_status tvs ON tv."vehicleStatusId" = tvs.id 
      WHERE "ownerId" = $1
    `;
    const parameters = [user.id];

    if (filters.vin) {
      query += ` AND tv.vin LIKE $${parameters.length + 1}`;
      parameters.push(`%${filters.vin.toUpperCase()}%`);
    }

    if (filters.license_plate) {
      query += ` AND tv.license_plate LIKE $${parameters.length + 1}`;
      parameters.push(`%${filters.license_plate.toUpperCase()}%`);
    }

    if (filters.model) {
      query += ` AND tv.model LIKE $${parameters.length + 1}`;
      parameters.push(`%${filters.model.toUpperCase()}%`);
    }

    if (filters.vehicle_status_id) {
      query += ` AND tv."vehicleStatusId" = $${parameters.length + 1}`;
      parameters.push(filters.vehicle_status_id);
    }

    const vehicles = await this.vehicleRepository.query(query, parameters);
    return vehicles;
  }

  async findByVin(vin: string) {
    const vehicle = (
      await this.vehicleRepository.query(
        `SELECT * FROM t_vehicle WHERE vin = $1`,
        [vin],
      )
    )[0];

    if (!vehicle) {
      return null;
    }

    const safeData = {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
      license_plate: vehicle.license_plate,
    };

    return safeData;
  }

  async remove(vin: string) {
    const vehicle = (
      await this.vehicleRepository.query(
        `DELETE FROM t_vehicle WHERE vin = $1 RETURNING make, model, year, vin, license_plate`,
        [vin],
      )
    )[0];

    return vehicle;
  }
}
