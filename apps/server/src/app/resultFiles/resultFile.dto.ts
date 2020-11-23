import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';

/**
 * Data Transfer Object for ResultFile entity.
 */
export class ResultFileDTO {

    /**
     * Path of result file.
     */
    @IsNotEmpty()
    @IsString()
    path: string;
  
    /**
     * CircuitFile entity linked to ResultFile entity.
     */
    @ValidateNested()
    circuit_file: CircuitFile;
    
    /**
     * SimulationFile entity linked to ResultFile entity.
     */
    @ValidateNested()
    simulation_file: SimulationFile;
}