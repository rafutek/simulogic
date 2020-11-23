import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SimulationFilesModule } from './simulationFiles/simulationFiles.module';
import { CircuitFilesModule } from './circuitFiles/circuitFiles.module';
import { SimulatorModule } from './simulator/simulator.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/validation';

const env_filepath = `${__dirname}/assets/.env.${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env_filepath,
      validationSchema: validationSchema,
      load: [configuration],
      validationOptions: {
        abortEarly: true,
      }
    }),
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
export class AppModule { }
