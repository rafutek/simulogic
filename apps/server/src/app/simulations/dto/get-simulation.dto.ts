import { IsBoolean, IsString, Min, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { IsGreaterThan } from '../../validation-decorators/IsGreaterThan';
import { DependsOn, DependsOnIfTrue } from '../../validation-decorators/DependsOn';
import { Interval } from '@simulogic/core';
import { IntervalChecker } from '../../validation-decorators/IntervalChecker';

export class GetSimulationDto {

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  id_simu: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  id_circuit: number;

  @IsOptional()
  @DependsOnIfTrue("id_circuit", { message: "'id_circuit' is missing" })
  @IsBoolean()
  result: boolean;

  @IsOptional()
  @IntervalChecker({ message: "'interval' object is not correct" })
  interval: Interval;

  @IsOptional()
  @IsString({ each: true })
  wires: string[];
}
