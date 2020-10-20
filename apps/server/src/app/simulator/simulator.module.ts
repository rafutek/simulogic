import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { ResultFilesService } from '../resultFiles/resultFiles.service';
import { ResultFile } from '../resultFiles/resultFile.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SimulationFile]), 
        TypeOrmModule.forFeature([CircuitFile]),
        TypeOrmModule.forFeature([ResultFile]) 
    ],
    providers: [
        SimulatorService,
        SimulationFilesService,
        CircuitFilesService,
        ResultFilesService,
        SimulationFileParserService,
        WaveDromManipulatorService,
        WaveDromSaverService],
    controllers: [SimulatorController]
})
export class SimulatorModule { }
