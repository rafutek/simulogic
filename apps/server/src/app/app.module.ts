import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SimulationFilesModule } from './simulationFiles/simulationFiles.module';
import { CircuitFilesModule } from './circuitFiles/circuitFiles.module';
import { SimulatorModule } from './simulator/simulator.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../config/validation';

/**
 * Path to the environment config file.
 * Environment variable NODE_ENV (used to set this filepath)
 * should be defined automatically before by your command as you can see below.
 * 
 * 'yarn start' -> NODE_ENV=development
 * 
 * 'yarn test' -> NODE_ENV=test
 * 
 * 'yarn build --prod' -> NODE_ENV=production
 */
const env_filepath = `${__dirname}/assets/.env.${process.env.NODE_ENV}`;

/**
 * Main application module.
 * Loads environment variables via ConfigModule,
 * TypeOrmModule for database,
 * SimulationFilesModule and CircuitFilesModule for respective files management,
 * and SimulatorModule for simulation management.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env_filepath,
      validationSchema: validationSchema,
      validationOptions: { abortEarly: true }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    SimulationFilesModule,
    CircuitFilesModule,
    SimulatorModule
  ]
})
export class AppModule { }
