import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SimulationsModule } from './simulations/simulations.module';
import { CircuitsModule } from './circuits/circuits.module';
import { SimulatorModule } from './simulator/simulator.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SimulatorModule,
    SimulationsModule,
    CircuitsModule
  ]
})
export class AppModule {}
