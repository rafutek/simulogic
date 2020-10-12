import { Injectable } from "@nestjs/common";
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';
import { SimulatorDTO } from './simulator.dto';
import { isEmpty, isUUID } from 'class-validator';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';

const lib = "../../../../common/simulator/lib/simulib.a";
const headers_path = "../../../../common/simulator/src/";
const makefile_path = headers_path;
const src_path = "simulator/home/user1/simulator/src/";
const bin_path = "simulator/home/user1/simulator/bin/";
const rslt_path = "simulator/home/user1/simulator/out/";

@Injectable()
export class SimulatorService {
    constructor(
        private readonly simulations_service: SimulationFilesService,
        private readonly circuits_service: CircuitFilesService,
        private readonly parser_service: SimulationFileParserService,
        private readonly manipulator_service: WaveDromManipulatorService,
        private readonly saver_service: WaveDromSaverService
    ) { }

    /**
     * Reads the simulation details and computes what is asked.
     * Depending on the details and saver service, parsing and manupulation might be done.
     * Whatever the simulatorDTO variable contains, a WaveDrom variable will be returned,
     * if no error was thrown before.
     * @param simulatorDTO variable containing the simulation details
     */
    async process(simulatorDTO: SimulatorDTO): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        let file_wavedrom: WaveDrom;
        let rslt_file_wavedrom: WaveDrom;

        if (isEmpty(simulatorDTO)) {
            throw new Error(`SimulatorDTO '${simulatorDTO}' cannot be empty`);
        }
        const simulation = await this.getSimulation(simulatorDTO.uuid_simu);
        file_wavedrom = await this.getSimuFileWaveDrom(simulation);
        wavedrom = file_wavedrom;

        if (simulatorDTO.result) {
            const circuit = await this.getCircuit(simulatorDTO.uuid_circuit);
            simulation.result_path = this.simulate(circuit, simulation);
            rslt_file_wavedrom = await this.getSimuFileWaveDrom(simulation, true);
            wavedrom = this.manipulator_service.combineWaveDroms(file_wavedrom, rslt_file_wavedrom);
            wavedrom = this.manipulator_service.groupInputOutput(wavedrom, file_wavedrom, rslt_file_wavedrom);
        }

        this.saver_service.simulation_sent = wavedrom;
        // const util = require('util')
        // console.log(util.inspect(wavedrom, { showHidden: false, depth: null }))
        return this.saver_service.simulation_sent;
    }

    /**
     * Returns the WaveDrom variable of the simulation file, or the simulation result file,
     * if no error was thrown before. Parses it from the file if not saved, and saves it.
     * @param uuid_simu UUID of the simulation to get
     * @param result boolean to get simulation result or not
     */
    private async getSimuFileWaveDrom(simulation: SimulationFile, result?: boolean): Promise<WaveDrom> {
        if (isEmpty(simulation.path)) {
            throw new Error(`Simulation path '${simulation.path}' cannot be empty`);
        }
        if (result) {
            if (isEmpty(simulation.result_path)) {
                throw new Error(`Simulation result path '${simulation.result_path}' cannot be empty`);
            }
            this.saver_service.simulation_result =
                await this.parseIfNotSaved(simulation, this.saver_service.simulation_result, result);
            return this.saver_service.simulation_result.wavedrom;
        }
        else {
            this.saver_service.simulation =
                await this.parseIfNotSaved(simulation, this.saver_service.simulation);
            return this.saver_service.simulation.wavedrom;
        }
    }

    /**
     * Checks if simulation is already saved so parsing is not necessary.
     * If not, reads the associated file and returns the created variable.
     * @param simu_to_get variable containing simulation uuid and path
     * @param saved_simu saved variable to check
     * @param result boolean to parse simulation input or output file
     */
    private async parseIfNotSaved(simu_to_get: SimulationFile, saved_simu: UUIDWaveDrom, result?: boolean): Promise<UUIDWaveDrom> {
        if (isEmpty(saved_simu) || saved_simu.uuid != simu_to_get.uuid) {
            const filepath = result ? simu_to_get.result_path : simu_to_get.path;
            const wavedrom = await this.parser_service.parseFile(filepath);
            return { uuid: simu_to_get.uuid, wavedrom: wavedrom };
        }
        return saved_simu;
    }


    /**
     * Returns the wanted simulation from the database.
     * Throws an error if it fails.
     * @param uuid_simu UUID of the simulation to get
     */
    private async getSimulation(uuid_simu: string): Promise<SimulationFile> {
        if (!isUUID(uuid_simu)) {
            throw new Error(`Simulation UUID '${uuid_simu}' must be a UUID`);
        }
        const simulation = await this.simulations_service.getOne(uuid_simu);
        if (isEmpty(simulation)) {
            throw new Error(`Could not find simulation with UUID '${uuid_simu}' in simulations table`);
        }
        return simulation;
    }

    /**
     * Returns the wanted circuit from the database.
     * Throws an error if it fails.
     * @param uuid_circuit UUID of the circuit to get
     */
    private async getCircuit(uuid_circuit: string): Promise<CircuitFile> {
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
    private createSimulatorSrcFiles(circuit: CircuitFile): void {
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
    private createSimulator(circuit: CircuitFile, executable: string): string {
        this.createSimulatorSrcFiles(circuit);
        const full_path = bin_path + executable;
        const relative_path = `../bin/${executable}`;
        let output: string;
        try {
            output = execSync(`
                make -f "${makefile_path}/Makefile" LIB="${lib}" HEADERS_PATH="${headers_path}" PROGRAM="${relative_path}"
                `, {
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
    async createAndSaveSimulator(circuit: CircuitFile, executable: string) {
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
    private simulate(circuit: CircuitFile, simulation: SimulationFile): string {
        if (isEmpty(circuit) || isEmpty(simulation)) {
            throw new Error(`Circuit '${circuit}' and simulation '${simulation}' cannot be empty`);
        }
        if (!fs.existsSync(simulation.path)) {
            throw new Error(`Simulation file '${simulation.path}' not found`);
        }
        if (!fs.existsSync(circuit.path)) {
            throw new Error(`Circuit file '${circuit.path}' not found`);
        }
        const circuit_filename = circuit.path.split('/').pop();
        const simulation_filename = simulation.path.split('/').pop();
        const simu_relative_path = `../data/${simulation_filename}`;
        const rslt_full_path = rslt_path + simulation_filename;
        const rslt_relative_path = `../out/${simulation_filename}`;

        if (isEmpty(circuit.simulator_path)) {
            this.createAndSaveSimulator(circuit, circuit_filename);
        }
        this.executeSimulator(circuit_filename, simu_relative_path, rslt_relative_path, rslt_full_path);
        return rslt_full_path;
    }

    /**
     * Executes given simulator with given simulation file, and outputs to the given result file.
     * Throws an error if execution fails, or if full result filepath doesn't exist.
     * Relative paths are from the user simulator bin folder (where simulator should be).
     * @param simulator_filepath relative path to the circuit simulator executable
     * @param simu_relative_filepath relative path to the simulation file
     * @param rslt_relative_filepath relative path to the simulation result file to generate (or overwrite)
     * @param rslt_full_filepath path from project root to simulation result file
     */
    executeSimulator(simulator_filepath: string, simu_relative_filepath: string,
        rslt_relative_filepath: string, rslt_full_filepath: string) {
        let output: string;
        try {
            output = execSync(
                `./"${simulator_filepath}" "${simu_relative_filepath}" > "${rslt_relative_filepath}"`,
                {
                    cwd: bin_path,
                    encoding: "utf8"
                });
        } catch (error) {
            throw new Error(`Failed to simulate circuit '${simulator_filepath}' ` +
                `with simulation '${simu_relative_filepath}'`);
        }
        console.log(output);

        if (!fs.existsSync(rslt_full_filepath)) {
            throw new Error(`Simulation result file '${rslt_full_filepath}' doesnt exist`);
        }
    }

}