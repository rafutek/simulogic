import { IsNotEmpty, IsString, Contains } from 'class-validator';

export class SimulationFileDTO {

  @IsNotEmpty()
  @IsString()
  @Contains(".simu")
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}
