import { Module } from '@nestjs/common';
import { CircuitFilesController } from './circuitFiles.controller';
import { CircuitFilesService } from './circuitFiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircuitFile } from './circuitFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CircuitFile])],
  providers: [CircuitFilesService],
  controllers: [CircuitFilesController],
})
export class CircuitFilesModule { }