import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from './simulationFile.entity';
import { SimulationFilesController } from './simulationFiles.controller';
import { SimulationFilesService } from './simulationFiles.service';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { MemoryService } from '../memory/memory.service';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationFile]), TypeOrmModule.forFeature([CircuitFile])],
  providers: [SimulationFilesService, CircuitFilesService, SimulationFileParserService, ManipulatorService, MemoryService],
  controllers: [SimulationFilesController]
})
export class SimulationFilesModule { }
