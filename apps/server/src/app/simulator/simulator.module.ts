import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { CircuitsService } from '../circuits/circuits.service';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorService } from '../extractor/extractor.service';
import { MemoryService } from '../memory/memory.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';

@Module({
    imports: [TypeOrmModule.forFeature([SimulationFile]), TypeOrmModule.forFeature([Circuit])],
    providers: [
        SimulatorService,
        SimulationFilesService,
        CircuitsService,
        ExtractorService,
        ManipulatorService,
        MemoryService],
    controllers: [SimulatorController]
})
export class SimulatorModule { }
