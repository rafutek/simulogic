import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from './simulationFile.entity';
import { SimulationFilesController } from './simulationFiles.controller';
import { SimulationFilesService } from './simulationFiles.service';
import { CircuitsService } from '../circuits/circuits.service';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorService } from '../extractor/extractor.service';
import { MemoryService } from '../memory/memory.service';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationFile]), TypeOrmModule.forFeature([Circuit])],
  providers: [SimulationFilesService, CircuitsService, ExtractorService, ManipulatorService, MemoryService],
  controllers: [SimulationFilesController]
})
export class SimulationFilesModule { }
