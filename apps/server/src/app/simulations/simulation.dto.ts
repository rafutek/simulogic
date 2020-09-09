import { IsNotEmpty, IsString, Contains } from 'class-validator';

export class SimulationDTO {

  @IsNotEmpty()
  @IsString()
  @Contains(".simu")
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}
