import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { validatedEnv } from './core/shared/validate-env';
import { UsersModule } from './users/users.module';

import { VehiclesModule } from './vehicles/vehicles.module';
import { VehiclesStatusModule } from './vehicles_status/vehicles_status.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    VehiclesModule,
    VehiclesStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule],
})
export class AppModule {
  constructor() {
    Logger.log('Validating enviroment variables', 'AppModule Creation');
    validatedEnv();
  }
}
