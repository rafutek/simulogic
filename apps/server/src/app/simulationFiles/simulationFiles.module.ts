import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from './simulationFile.entity';
import { SimulationFilesController } from './simulationFiles.controller';
import { SimulationFilesService } from './simulationFiles.service';
import { ResultFile } from '../resultFiles/resultFile.entity';
import { ResultFilesService } from '../resultFiles/resultFiles.service';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SimulationFile]),
    TypeOrmModule.forFeature([ResultFile])
  ],
  providers: [
    SimulationFilesService,
    ResultFilesService,
    WaveDromManipulatorService,
    WaveDromSaverService
  ],
  controllers: [SimulationFilesController]
})
export class SimulationFilesModule { }
