import { IsBoolean, IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import {  DependsOnIfTrue } from '../validation-decorators/DependsOnIfTrue';
import { Interval } from '@simulogic/core';
import { IntervalChecker } from '../validation-decorators/IntervalChecker';

/**
 * Data Transfer Object for Simulator.
 */
export class SimulatorDTO {

  /**
   * UUID of SimulationFile entity to use.
   */
  @IsNotEmpty()
  @IsUUID()
  uuid_simu: string;

  /**
   * UUID of CircuitFile entity to use.
   * Required if you want to execute simulation with this circuit simulator.
   */
  @IsOptional()
  @IsUUID()
  uuid_circuit?: string;

  /**
   * Boolean used to get simulation execution result.
   * If true, uuid_circuit is necessary for simulator execution.
   * If false or undefined, only simulation input is returned.
   */
  @IsOptional()
  @DependsOnIfTrue("uuid_circuit", { message: "'uuid_circuit' is missing" })
  @IsBoolean()
  result?: boolean;

  /**
   * Variable used to get simulation interval.
   * If undefined, full simulation is returned.
   */
  @IsOptional()
  @IntervalChecker({ message: "'interval' object is not correct" })
  interval?: Interval;

  /**
   * Variable used to get some simulation signals by their name.
   * If undefined, all signals are returned.
   */
  @IsOptional()
  @IsString({ each: true })
  wires?: string[];
}
