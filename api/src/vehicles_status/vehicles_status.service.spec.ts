import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleStatus } from './entities/vehicles_status.entity';
import { VehiclesStatusService } from './vehicles_status.service';

describe('VehiclesStatusService', () => {
  let service: VehiclesStatusService;
  let vehiclesRepository: Repository<VehicleStatus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesStatusService,
        {
          provide: getRepositoryToken(VehicleStatus),
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesStatusService>(VehiclesStatusService);
    vehiclesRepository = module.get<Repository<VehicleStatus>>(
      getRepositoryToken(VehicleStatus),
    );
  });

  describe('findAll', () => {
    it('should return all vehicle statuses', async () => {
      const mockStatuses = [
        {
          id: 1,
          vehicle_status: 'Parado',
          description: 'Veículo parado',
        },
        {
          id: 2,
          vehicle_status: 'Sem Sinal',
          description: 'Veículo sem sinal',
        },
        {
          id: 3,
          vehicle_status: 'Em Movimento',
          description: 'Veículo em movimento',
        },
      ];

      jest.spyOn(vehiclesRepository, 'query').mockResolvedValue(mockStatuses);

      const result = await service.findAll();

      expect(result).toEqual(mockStatuses);
      expect(vehiclesRepository.query).toHaveBeenCalledWith(
        'SELECT * FROM t_vehicle_status',
      );
    });
  });
});
