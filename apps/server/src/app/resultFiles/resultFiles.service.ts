import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { ResultFileDTO } from './resultFile.dto';
import { ResultFile } from './resultFile.entity';

@Injectable()
export class ResultFilesService {
    constructor(
        @InjectRepository(ResultFile)
        private readonly results_repository: Repository<ResultFile>
    ) { }

    /** 
     * Inserts a result file entity in the ResultFile table of the database, and returns it.
     * @param new_result valid result file DTO
     */
    async insertOne(new_result: ResultFileDTO): Promise<ResultFile> {
        const new_rslt_entity = this.results_repository.create(new_result);
        await this.results_repository.save(new_rslt_entity);
        return new_rslt_entity;
    }

    /**
     * Returns all the result file entities present in the ResultFile table of the database.
     */
    getAll(): Promise<ResultFile[]> {
        return this.results_repository.find();
    }

    /**
     * Returns the first result file entity of ResultFile table containing circuit and simulation keys.
     * @param circuit circuit entity of CircuitFile table
     * @param simulation simulation entity of SimulationFile table
     */
    getOneByCircuitAndSimulation(circuit: CircuitFile, simulation: SimulationFile): Promise<ResultFile> {
        return this.results_repository.findOne({ where: { circuit_file: circuit, simulation_file: simulation } });
    }
}