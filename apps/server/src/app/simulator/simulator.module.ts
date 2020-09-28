import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulation } from '../simulations/simulation.entity';
import { SimulationsService } from '../simulations/simulations.service';
import { CircuitsService } from '../circuits/circuits.service';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorService } from '../extractor/extractor.service';
import { MemoryService } from '../memory/memory.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';

@Module({
    imports: [TypeOrmModule.forFeature([Simulation]), TypeOrmModule.forFeature([Circuit])],
    providers: [
        SimulatorService,
        SimulationsService,
        CircuitsService,
        ExtractorService,
        ManipulatorService,
        MemoryService],
    controllers: [SimulatorController]
})
export class SimulatorModule { }
