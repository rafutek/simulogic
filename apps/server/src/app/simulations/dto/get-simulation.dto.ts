import { IsBoolean, IsString, Min, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { IsGreaterThan } from '../../validation-decorators/IsGreaterThan';
import { DependsOn, DependsOnIfTrue } from '../../validation-decorators/DependsOn';

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
  @DependsOn("to", { message: "'to' value is missing" })
  @Min(0)
  from: number;

  @IsOptional()
  @DependsOn("from", { message: "'from' value is missing" })
  @IsGreaterThan("from", { message: "'to' must be greater than 'from'" })
  to: number;

  @IsOptional()
  @IsString({ each: true })
  wires: string[];
}
