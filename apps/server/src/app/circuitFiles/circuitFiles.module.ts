import { Module } from '@nestjs/common';
import { CircuitFilesController } from './circuitFiles.controller';
import { CircuitFilesService } from './circuitFiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircuitFile } from './circuitFile.entity';
import { ResultFile } from '../resultFiles/resultFile.entity';
import { ResultFilesService } from '../resultFiles/resultFiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CircuitFile]),
    TypeOrmModule.forFeature([ResultFile])
  ],
  providers: [CircuitFilesService, ResultFilesService],
  controllers: [CircuitFilesController],
})
export class CircuitFilesModule { }