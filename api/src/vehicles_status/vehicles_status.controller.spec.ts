import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesStatusController } from './vehicles_status.controller';
import { VehiclesStatusService } from './vehicles_status.service';

describe('VehiclesStatusController', () => {
  let controller: VehiclesStatusController;
  let service: VehiclesStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesStatusController],
      providers: [
        {
          provide: VehiclesStatusService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehiclesStatusController>(VehiclesStatusController);
    service = module.get<VehiclesStatusService>(VehiclesStatusService);
  });

  describe('findAll', () => {
    it('should return all vehicle statuses', async () => {
      const result = [
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

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
