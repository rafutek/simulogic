import { Injectable } from "@nestjs/common";
import { CircuitsService } from '../circuits/circuits.service';
import { ExtractorService } from '../extractor/extractor.service';
import { MemoryService } from '../memory/memory.service';
import { SimulatorDTO } from './simulator.dto';
import { isEmpty, isUUID } from 'class-validator';
import { SimulationsService } from '../simulations/simulations.service';
import { UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { Simulation } from '../simulations/simulation.entity';
import { Circuit } from '../circuits/circuit.entity';
import { execSync } from 'child_process';

@Injectable()
export class SimulatorService {
    constructor(
        private readonly simulations_service: SimulationsService,
        private readonly circuits_service: CircuitsService,
        private readonly memory_service: MemoryService,
        private readonly extractor_service: ExtractorService,
    ) { }

    /**
     * Reads the simulation details and computes what is asked.
     * Depending on the details, and on memory service, extraction and manupulation can be done.
     * Whatever the simulatorDTO variable contains, a WaveDrom variable will be returned,
     * if no error was thrown before.
     * @param simulatorDTO variable containing the simulation details
     */
    async manage(simulatorDTO: SimulatorDTO): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        if (isEmpty(simulatorDTO)) {
            throw new Error(`SimulatorDTO '${simulatorDTO}' cannot be empty`);
        }
        const file_wavedrom = await this.getSimuFileWaveDrom(simulatorDTO.uuid_simu);
        wavedrom = file_wavedrom;

        if (simulatorDTO.result) {
            // get circuit
            const circuit = await this.getCircuit(simulatorDTO.uuid_circuit);

            // execute simulation
            this.createSimulatorSrcFiles(circuit);

            // extract variable
            // const rslt_file_wavedrom = await this.getSimuFileWaveDrom(simulatorDTO.uuid_simu, true);

            // combine

        }
        return wavedrom;
    }

    /**
     * Returns the WaveDrom variable of the simulation file, or the simulation result file,
     * if no error was thrown before. Extracts it from the file if not saved, and saves it.
     * @param uuid_simu UUID of the simulation to get
     * @param result boolean to get simulation result or not
     */
    private async getSimuFileWaveDrom(uuid_simu: string, result?: boolean): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        if (!isUUID(uuid_simu)) {
            throw new Error(`Simulation UUID '${uuid_simu}' must be a UUID`);
        }
        const simulation = await this.simulations_service.getOne(uuid_simu);
        if (isEmpty(simulation.path)) {
            throw new Error(`Simulation path '${simulation.path}' cannot be empty`);
        }
        if (result) {
            if (isEmpty(simulation.result_path)) {
                throw new Error(`Simulation result path '${simulation.result_path}' cannot be empty`);
            }
            this.memory_service.simulation_result =
                await this.extractIfNotSaved(simulation, this.memory_service.simulation_result, result);
            return this.memory_service.simulation_result.wavedrom;
        }
        else {
            this.memory_service.simulation =
                await this.extractIfNotSaved(simulation, this.memory_service.simulation);
            return this.memory_service.simulation.wavedrom;
        }
    }

    /**
     * Checks if simulation is already saved so extraction is not necessary.
     * If not, reads the associated file and returns the created variable.
     * @param simu_to_get variable containing simulation uuid and path
     * @param simu_memo memory variable to check
     * @param result boolean to extract simulation input or output file
     */
    async extractIfNotSaved(simu_to_get: Simulation, simu_memo: UUIDWaveDrom, result?: boolean): Promise<UUIDWaveDrom> {
        if (isEmpty(simu_memo) || simu_memo.uuid != simu_to_get.uuid) {
            const filepath = result ? simu_to_get.result_path : simu_to_get.path;
            const wavedrom = await this.extractor_service.extractFile(filepath);
            return { uuid: simu_to_get.uuid, wavedrom: wavedrom };
        }
        return simu_memo;
    }

    private async getCircuit(uuid_circuit: string): Promise<Circuit> {
        if (!isUUID(uuid_circuit)) {
            throw new Error(`Circuit UUID '${uuid_circuit}' must be a UUID`);
        }
        const circuit = await this.circuits_service.getOne(uuid_circuit);
        if (isEmpty(circuit)) {
            throw new Error(`Could not find circuit with UUID '${uuid_circuit}' in circuits table`);
        }
        return circuit;
    }

    private createSimulatorSrcFiles(circuit: Circuit) {
        if (isEmpty(circuit.path)) {
            throw new Error(`Circuit path '${circuit.path}' cannot be empty`);
        }

        const circuit_filepath = circuit.path.replace("simulator", "../../../");
        const output_path = "../../../home/user1/simulator/src/";
        const headers_path = "../../../../common/simulator/src/";
        let output: string;
        try {
            output = execSync(`
            java LogicToCpp "${headers_path}" "${output_path}" "${circuit_filepath}"
            `, {
                cwd: "simulator/common/circuitCreator/bin",
                encoding: "utf8"
            });
        } catch (error) {
            throw new Error(`Failed to create circuit '${circuit.uuid}' simulator`);
        }
        console.log(output);
    }
    
}