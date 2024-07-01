import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { generateLatitude } from 'src/core/shared/utils';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleFilterDto } from './dto/filter.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomInt: jest.fn(),
}));

jest.mock('src/core/shared/utils', () => ({
  generateLatitude: jest.fn(),
}));

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehicleRepository: Repository<Vehicle>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: {
            query: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    vehicleRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a vehicle and return the vehicle data', async () => {
      const currentToken = 'token123';
      const createVehicleDto: CreateVehicleDto = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: '1HGCM82633A123456',
        license_plate: 'ABC123',
      };

      const mockUser = { id: 1 };
      const mockVehicle = {
        make: 'TOYOTA',
        model: 'COROLLA',
        year: '2020',
        vin: '1HGCM82633A123456',
        license_plate: 'ABC123',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([mockUser]);
      (randomInt as jest.Mock).mockReturnValue(1);
      (generateLatitude as jest.Mock).mockReturnValue(40.7128);
      jest
        .spyOn(vehicleRepository, 'query')
        .mockResolvedValueOnce([mockVehicle]);

      const result = await service.create(currentToken, createVehicleDto);

      expect(result).toEqual(mockVehicle);
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT id FROM t_user WHERE current_token = $1`,
        [currentToken],
      );
      expect(vehicleRepository.query).toHaveBeenCalledWith(
        `INSERT INTO t_vehicle ("ownerId", make, model, year, vin, license_plate, "vehicleStatusId", latitude, longitude) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING make, model, year, vin, license_plate`,
        [
          mockUser.id,
          createVehicleDto.make.toUpperCase(),
          createVehicleDto.model.toUpperCase(),
          createVehicleDto.year,
          createVehicleDto.vin.toUpperCase(),
          createVehicleDto.license_plate.toUpperCase(),
          1,
          40.7128,
          40.7128,
        ],
      );
    });

    it('should throw an error if user is not found', async () => {
      const currentToken = 'token123';
      const createVehicleDto: CreateVehicleDto = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: '1HGCM82633A123456',
        license_plate: 'ABC123',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([]);

      await expect(
        service.create(currentToken, createVehicleDto),
      ).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update the vehicle data', async () => {
      const vin = '1HGCM82633A123456';
      const updateVehicleDto: UpdateVehicleDto = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2021',
        vin: '1HGCM82633A123457',
        license_plate: 'DEF456',
      };

      const mockVehicle = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2021',
        vin: '1HGCM82633A123457',
        license_plate: 'DEF456',
      };

      jest
        .spyOn(vehicleRepository, 'query')
        .mockResolvedValueOnce([mockVehicle]);

      const result = await service.update(vin, updateVehicleDto);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.query).toHaveBeenCalledWith(
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
      );
    });
  });

  describe('findAll', () => {
    it('should return all vehicles for the user', async () => {
      const currentToken = 'token123';
      const filters: VehicleFilterDto = {};
      const mockUser = { id: 1 };
      const mockVehicles = [
        {
          make: 'Toyota',
          model: 'Corolla',
          year: '2020',
          vin: '1HGCM82633A123456',
          license_plate: 'ABC123',
          latitude: 40.7128,
          longitude: 74.006,
          vehicleStatusId: 1,
          vehicle_status: 'Available',
        },
      ];

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([mockUser]);
      jest
        .spyOn(vehicleRepository, 'query')
        .mockResolvedValueOnce(mockVehicles);

      const result = await service.findAll(currentToken, filters);

      expect(result).toEqual(mockVehicles);
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT id FROM t_user WHERE current_token = $1`,
        [currentToken],
      );
      expect(vehicleRepository.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT tv.make, tv.model, tv.year, tv.vin, tv.license_plate, tv.latitude, tv.longitude, tv."vehicleStatusId", tvs.vehicle_status',
        ),
        expect.arrayContaining([mockUser.id]),
      );
    });

    it('should return null if user is not found', async () => {
      const currentToken = 'token123';
      const filters: VehicleFilterDto = {};

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([]);

      const result = await service.findAll(currentToken, filters);

      expect(result).toBeNull();
    });
  });

  describe('findByVin', () => {
    it('should return the vehicle by VIN', async () => {
      const vin = '1HGCM82633A123456';
      const mockVehicle = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: vin,
        license_plate: 'ABC123',
      };

      jest
        .spyOn(vehicleRepository, 'query')
        .mockResolvedValueOnce([mockVehicle]);

      const result = await service.findByVin(vin);

      expect(result).toEqual({
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: vin,
        license_plate: 'ABC123',
      });
      expect(vehicleRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_vehicle WHERE vin = $1`,
        [vin],
      );
    });

    it('should return null if vehicle is not found', async () => {
      const vin = '1HGCM82633A123456';

      jest.spyOn(vehicleRepository, 'query').mockResolvedValueOnce([]);

      const result = await service.findByVin(vin);

      expect(result).toBeNull();
      expect(vehicleRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_vehicle WHERE vin = $1`,
        [vin],
      );
    });
  });

  describe('remove', () => {
    it('should remove the vehicle by VIN', async () => {
      const vin = '1HGCM82633A123456';
      const mockVehicle = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: vin,
        license_plate: 'ABC123',
      };

      jest
        .spyOn(vehicleRepository, 'query')
        .mockResolvedValueOnce([mockVehicle]);

      const result = await service.remove(vin);

      expect(result).toEqual(mockVehicle);
      expect(vehicleRepository.query).toHaveBeenCalledWith(
        `DELETE FROM t_vehicle WHERE vin = $1 RETURNING make, model, year, vin, license_plate`,
        [vin],
      );
    });
  });
});
