import { IsBoolean, IsString, Min, IsOptional, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import {  DependsOnIfTrue } from '../validation-decorators/DependsOn';
import { Interval } from '@simulogic/core';
import { IntervalChecker } from '../validation-decorators/IntervalChecker';

export class SimulationGetterDTO {

  @IsNotEmpty()
  @IsUUID()
  uuid_simu: string;

  @IsOptional()
  @IsUUID()
  uuid_circuit: string;

  @IsOptional()
  @DependsOnIfTrue("uuid_circuit", { message: "'uuid_circuit' is missing" })
  @IsBoolean()
  result: boolean;

  @IsOptional()
  @IntervalChecker({ message: "'interval' object is not correct" })
  interval: Interval;

  @IsOptional()
  @IsString({ each: true })
  wires: string[];
}
