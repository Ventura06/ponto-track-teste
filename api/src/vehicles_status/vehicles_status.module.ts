import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { VehicleStatus } from './entities/vehicles_status.entity';
import { VehiclesStatusController } from './vehicles_status.controller';
import { VehiclesStatusService } from './vehicles_status.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleStatus])],
  providers: [
    VehiclesStatusService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [VehiclesStatusController],
})
export class VehiclesStatusModule {}
