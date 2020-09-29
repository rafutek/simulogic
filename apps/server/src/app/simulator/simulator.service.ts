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
import * as fs from 'fs';

const lib = "../../../../common/simulator/lib/simulib.a";
const headers_path = "../../../../common/simulator/src/";
const src_path = "simulator/home/user1/simulator/src/";
const bin_path = "simulator/home/user1/simulator/bin/";
const rslt_path = "simulator/home/user1/simulator/out/";

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
        const simulation = await this.simulations_service.getOne(simulatorDTO.uuid_simu);
        const file_wavedrom = await this.getSimuFileWaveDrom(simulation);
        wavedrom = file_wavedrom;

        if (simulatorDTO.result) {
            const circuit = await this.getCircuit(simulatorDTO.uuid_circuit);
            simulation.result_path = this.simulate(circuit, simulation);
            const rslt_file_wavedrom = await this.getSimuFileWaveDrom(simulation, true);
            // combine
            wavedrom = rslt_file_wavedrom;

        }
        return wavedrom;
    }

    /**
     * Returns the WaveDrom variable of the simulation file, or the simulation result file,
     * if no error was thrown before. Extracts it from the file if not saved, and saves it.
     * @param uuid_simu UUID of the simulation to get
     * @param result boolean to get simulation result or not
     */
    private async getSimuFileWaveDrom(simulation: Simulation, result?: boolean): Promise<WaveDrom> {
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

    /**
     * Returns the wanted circuit from the database.
     * Throws an error if it fails.
     * @param uuid_circuit UUID of the circuit to get
     */
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

    /**
     * Calls Java binary to create the simulator C++ source files.
     * @param circuit circuit entity from database
     */
    private createSimulatorSrcFiles(circuit: Circuit): void {
        if (isEmpty(circuit.path)) {
            throw new Error(`Circuit path '${circuit.path}' cannot be empty`);
        }

        const circuit_filepath = circuit.path.replace("simulator", "../../../");
        const output_path = src_path.replace("simulator", "../../../");
        let output: string;
        try {
            output = execSync(`
            java LogicToCpp "${headers_path}" "${output_path}" "${circuit_filepath}"
            `, {
                cwd: "simulator/common/circuitCreator/bin",
                encoding: "utf8"
            });
        } catch (error) {
            throw new Error(`Failed to create circuit '${circuit.uuid}' simulator source files`);
        }
        console.log(output);
    }

    /**
     * Creates simulator source files, and calls C++ compiler to create simulator executable.
     * Returns simulator full path if no error was thrown before.
     * @param circuit circuit entity from database
     * @param executable name of the executable to create
     */
    private createSimulator(circuit: Circuit, executable: string): string {
        this.createSimulatorSrcFiles(circuit);
        const full_path = bin_path + executable;
        const relative_path = `../bin/${executable}`;
        let output: string;
        try {
            output = execSync(
                `make LIB="${lib}" HEADERS_PATH="${headers_path}" PROGRAM="${relative_path}"`,
                {
                    cwd: src_path,
                    encoding: "utf8"
                });
        } catch (error) {
            throw new Error(`Failed to compile circuit '${circuit.uuid}' simulator`);
        }
        console.log(output);

        if (!fs.existsSync(full_path)) {
            throw new Error(`Simulator path '${full_path}' doesnt exist`);
        }
        return full_path;
    }

    /**
     * Creates simulator source files, compiles them into an executable,
     * and and its path in the database.
     * @param circuit circuit entity from database
     * @param executable name of the executable to create
     */
    private async createAndSaveSimulator(circuit: Circuit, executable: string) {
        if (isEmpty(executable)) {
            throw new Error(`Simulator name '${executable}' cannot be empty`);
        }
        
        circuit.simulator_path = this.createSimulator(circuit, executable);
        await this.circuits_service.updateOne(circuit);
    }

    /**
     * Creates and saves the executable if it was not saved.
     * Executes a simulation on a circuit and returns result full path.
     * Throws an error if something fails.
     * @param circuit circuit entity from database
     * @param simulation simulation entity from database
     */
    private simulate(circuit: Circuit, simulation: Simulation): string {
        if (isEmpty(circuit) || isEmpty(simulation)) {
            throw new Error(`Circuit '${circuit}' and simulation '${simulation}' cannot be empty`);
        }
        const circuit_filename = circuit.path.split('/').pop();
        const simulation_filename = simulation.path.split('/').pop();
        const simu_relative_path = `../data/${simulation_filename}`;
        const rslt_full_path = rslt_path + simulation_filename;
        const rslt_relative_path = `../out/${simulation_filename}`;

        if (isEmpty(circuit.simulator_path)) {
            this.createAndSaveSimulator(circuit, circuit_filename);
        }

        let output: string;
        try {
            output = execSync(
                `./${circuit_filename} ${simu_relative_path} > ${rslt_relative_path}`,
                {
                    cwd: bin_path,
                    encoding: "utf8"
                });
        } catch (error) {
            throw new Error(`Failed to simulate circuit '${circuit_filename}' ` +
                `with simulation '${simu_relative_path}'`);
        }
        console.log(output);

        if (!fs.existsSync(rslt_full_path)) {
            throw new Error(`Simulation result file '${rslt_full_path}' doesnt exist`);
        }
        return rslt_full_path;
    }

}