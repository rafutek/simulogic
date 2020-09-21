import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Simulation } from './simulation.entity';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';
import { CircuitsService } from '../circuits/circuits.service';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorService } from '../extractor/extractor.service';
import { MemoryService } from '../memory/memory.service';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Simulation]), TypeOrmModule.forFeature([Circuit])],
  providers: [SimulationsService, CircuitsService, ExtractorService, ManipulatorService, MemoryService],
  controllers: [SimulationsController]
})
export class SimulationsModule { }
