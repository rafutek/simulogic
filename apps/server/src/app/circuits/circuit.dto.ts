import { IsNotEmpty, IsString, Contains } from 'class-validator';

export class CircuitDTO {

  @IsNotEmpty()
  @IsString()
  @Contains(".logic")
  name: string;

  @IsNotEmpty()
  @IsString()
  path: string;
}