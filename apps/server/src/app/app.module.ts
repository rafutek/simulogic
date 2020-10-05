import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SimulationFilesModule } from './simulationFiles/simulationFiles.module';
import { CircuitFilesModule } from './circuitFiles/circuitFiles.module';
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
    SimulationFilesModule,
    CircuitFilesModule
  ]
})
export class AppModule {}
