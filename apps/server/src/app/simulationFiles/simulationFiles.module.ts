import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from './simulationFile.entity';
import { SimulationFilesController } from './simulationFiles.controller';
import { SimulationFilesService } from './simulationFiles.service';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationFile]), TypeOrmModule.forFeature([CircuitFile])],
  providers: [SimulationFilesService, CircuitFilesService, SimulationFileParserService, WaveDromManipulatorService, WaveDromSaverService],
  controllers: [SimulationFilesController]
})
export class SimulationFilesModule { }
