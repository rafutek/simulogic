import { IsNotEmpty, IsString, Contains } from 'class-validator';

export class CircuitFileDTO {

  @IsNotEmpty()
  @IsString()
  @Contains(".logic")
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}