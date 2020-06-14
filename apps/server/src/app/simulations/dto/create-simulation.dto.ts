import { IsNotEmpty, IsString, Contains } from 'class-validator';

export class CreateSimulationDto {

  @IsNotEmpty()
  @IsString()
  @Contains(".simu")
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}
