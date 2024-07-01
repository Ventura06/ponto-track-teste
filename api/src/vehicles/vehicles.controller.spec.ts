import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleFilterDto } from './dto/filter.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByVin: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  describe('create', () => {
    it('should create a vehicle and return the vehicle data', async () => {
      const createVehicleDto: CreateVehicleDto = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: '1HGCM82633A123456',
        license_plate: 'ABC123',
      };
      const mockRequest = {
        headers: {
          authorization: 'Bearer token123',
        },
      } as any;

      const result = { id: 1, ...createVehicleDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(mockRequest, createVehicleDto)).toEqual(
        result,
      );
      expect(service.create).toHaveBeenCalledWith('token123', createVehicleDto);
    });
  });

  describe('findAll', () => {
    it('should return all vehicles for the user', async () => {
      const filters: VehicleFilterDto = {};
      const mockRequest = {
        headers: {
          authorization: 'Bearer token123',
        },
      } as any;

      const result = [{ id: 1, make: 'Toyota', model: 'Corolla' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(filters, mockRequest)).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith('token123', filters);
    });
  });

  describe('findByVin', () => {
    it('should return the vehicle by VIN', async () => {
      const vin = '1HGCM82633A123456';
      const result = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: vin,
        license_plate: 'ABC123',
      };

      jest.spyOn(service, 'findByVin').mockResolvedValue(result);

      expect(await controller.findByVin(vin)).toEqual(result);
      expect(service.findByVin).toHaveBeenCalledWith(vin);
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
      const result = { ...updateVehicleDto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(vin, updateVehicleDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(vin, updateVehicleDto);
    });
  });

  describe('remove', () => {
    it('should remove the vehicle by VIN', async () => {
      const vin = '1HGCM82633A123456';
      const result = {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        vin: vin,
        license_plate: 'ABC123',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(vin)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(vin);
    });
  });
});
