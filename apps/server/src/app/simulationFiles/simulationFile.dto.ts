import { IsNotEmpty, IsString, Contains } from 'class-validator';

/**
 * Data Transfer Object for SimulationFile entity.
 */
export class SimulationFileDTO {

  /**
   * Name of the simulation file.
   */
  @IsNotEmpty()
  @IsString()
  @Contains(".simu")
  name: string;

  /**
   * Path of the simulation file.
   */
  @IsNotEmpty()
  @IsString()
  path: string;
}
