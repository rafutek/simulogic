import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';

export class ResultFileDTO {

    @IsNotEmpty()
    @IsString()
    path: string;
  
    @ValidateNested()
    circuit_file: CircuitFile;
    
    @ValidateNested()
    simulation_file: SimulationFile;
}