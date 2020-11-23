import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { ResultFileDTO } from './resultFile.dto';
import { ResultFile } from './resultFile.entity';
import * as fs from 'fs';

/**
 * Service to manage result files.
 */
@Injectable()
export class ResultFilesService {

    /**
     * Injects ResultFile Repository dependency.
     * @param results_repository database table of ResultFiles
     */
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

    /**
     * Deletes all the results linked to a circuit file entity.
     * @param circuit circuit entity associated to the results
     */
    async deleteByCircuit(circuit: CircuitFile) {
        const circuit_results: ResultFile[] = await this.results_repository.find({ where: { circuit_file: circuit } });
        circuit_results?.forEach(async result_file => {
            if (fs.existsSync(result_file.path)) fs.unlinkSync(result_file.path);
            await this.results_repository.delete(result_file);
        })
    }

    /**
     * Deletes all the results linked to a simulation file entity.
     * @param simulation simulation entity associated to the results
     */
    async deleteBySimulation(simulation: SimulationFile) {
        const simu_results: ResultFile[] = await this.results_repository.find({ where: { simulation_file: simulation } });
        simu_results?.forEach(async result_file => {
            if (fs.existsSync(result_file.path)) fs.unlinkSync(result_file.path);
            await this.results_repository.delete(result_file);
        })
    }
} 