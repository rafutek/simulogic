import { Module } from '@nestjs/common';
import { CircuitsController } from './circuits.controller';
import { CircuitsService } from './circuits.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Circuit } from './circuit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Circuit])],
  providers: [CircuitsService],
  controllers: [CircuitsController],
})
export class CircuitsModule { }