import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from './simulationFile.entity';
import { SimulationFilesController } from './simulationFiles.controller';
import { SimulationFilesService } from './simulationFiles.service';
import { ResultFile } from '../resultFiles/resultFile.entity';
import { ResultFilesService } from '../resultFiles/resultFiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SimulationFile]),
    TypeOrmModule.forFeature([ResultFile])
  ],
  providers: [
    SimulationFilesService,
    ResultFilesService
  ],
  controllers: [SimulationFilesController]
})
export class SimulationFilesModule { }
