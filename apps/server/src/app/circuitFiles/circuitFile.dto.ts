import { IsNotEmpty, IsString, Contains } from 'class-validator';

/**
 * Data Transfer Object for CircuitFile entity.
 */
export class CircuitFileDTO {

  /**
   * Name of the circuit file.
   */
  @IsNotEmpty()
  @IsString()
  @Contains(".logic")
  name: string;

  /**
   * Path of the circuit file.
   */
  @IsNotEmpty()
  @IsString()
  path: string;
}