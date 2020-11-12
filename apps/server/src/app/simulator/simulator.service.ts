import { Injectable } from "@nestjs/common";
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';
import { SimulatorDTO } from './simulator.dto';
import { isEmpty, isUUID } from 'class-validator';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { SignalNamesGroup, UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';
import { ResultFilesService } from '../resultFiles/resultFiles.service';
import { ResultFileDTO } from '../resultFiles/resultFile.dto';
import { ResultFile } from '../resultFiles/resultFile.entity';
import * as path from 'path';

const parser_bin_path = "simulator/common/circuitCreator/bin/";
const lib = "../../../../common/simulator/lib/simulib.a";
const headers_path = "../../../../common/simulator/src/";
const makefile_path = headers_path;
const user_simulator_folder = "simulator/home/user1/simulator/";
const simulator_src_folder = user_simulator_folder + "src/";
export const simulator_bin_folder = user_simulator_folder + "bin/";
const simulator_out_folder = user_simulator_folder + "out/";

@Injectable()
export class SimulatorService {
    constructor(
        private readonly simulations_service: SimulationFilesService,
        private readonly circuits_service: CircuitFilesService,
        private readonly results_service: ResultFilesService,
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
        let simu_file_wavedrom: WaveDrom;
        let rslt_file_wavedrom: WaveDrom;
        console.log(simulatorDTO)

        if (isEmpty(simulatorDTO)) {
            throw new Error(`SimulatorDTO '${simulatorDTO}' cannot be empty`);
        }
        const simulation = await this.getSimulation(simulatorDTO.uuid_simu);
        this.saver_service.simulation = await this.parseIfNotSaved(simulation, this.saver_service.simulation);
        wavedrom = simu_file_wavedrom = this.saver_service.simulation.wavedrom;

        if (simulatorDTO.result) {
            const circuit = await this.getCircuit(simulatorDTO.uuid_circuit);
            const result = await this.simulate(circuit, simulation);
            this.saver_service.result = await this.parseIfNotSaved(result, this.saver_service.result);
            rslt_file_wavedrom = this.saver_service.result.wavedrom;
            // Combine simulation input and output and save it
            wavedrom = this.manipulator_service.combineWaveDroms(simu_file_wavedrom, rslt_file_wavedrom);
            this.saver_service.full_simulation = { uuid: result.uuid, wavedrom: wavedrom };
        }

        if (simulatorDTO.wires?.length > 0) {
            wavedrom = this.manipulator_service.selectSignals(wavedrom, simulatorDTO.wires);
        }
        if (!isEmpty(simulatorDTO.interval)) {
            wavedrom = this.manipulator_service.cutWaveDrom(wavedrom, simulatorDTO.interval);
        }
        if (simulatorDTO.result) {
            wavedrom = this.manipulator_service.groupInputOutput(wavedrom, simu_file_wavedrom, rslt_file_wavedrom);
        }

        this.saver_service.simulation_sent = wavedrom;
        return this.saver_service.simulation_sent;
    }

    /**
     * Checks if simulation or result (entity) WaveDrom is already saved.
     * If not, parses the entity file and saves the created WaveDrom.
     * Returns the saved WaveDrom.
     * @param entity variable containing entity uuid and path
     * @param saved_wavedrom saved variable to check
     */
    private async parseIfNotSaved(entity: SimulationFile | ResultFile, saved_wavedrom: UUIDWaveDrom):
        Promise<UUIDWaveDrom> {
        if (isEmpty(saved_wavedrom) || saved_wavedrom.uuid != entity.uuid) {
            const wavedrom = await this.parser_service.parseFile(entity.path);
            return { uuid: entity.uuid, wavedrom: wavedrom };
        }
        return saved_wavedrom;
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
        if (!fs.existsSync(circuit.path)) {
            throw new Error(`Circuit '${circuit.path}' not found`);
        }

        const relative_path = "../".repeat(parser_bin_path.split('/').length - 1);
        const circuit_filepath = relative_path + circuit.path;
        const output_path = relative_path + simulator_src_folder;
        let output: string;
        try {
            output = execSync(`
            java LogicToCpp "${headers_path}" "${output_path}" "${circuit_filepath}"
            `, {
                cwd: parser_bin_path,
                encoding: "utf8"
            });
        } catch (error) {
            throw new Error(`Failed to create circuit '${circuit.name}' simulator source files`);
        }
    }

    /**
     * Creates simulator source files, and calls C++ compiler to create simulator executable.
     * Returns simulator full path if no error was thrown before.
     * @param circuit circuit entity from database
     * @param executable_name name of the executable to create
     */
    private createSimulator(circuit: CircuitFile, executable_name: string): string {
        this.createSimulatorSrcFiles(circuit);
        const full_path = simulator_bin_folder + executable_name;
        const relative_path = `../bin/${executable_name}`;
        let output: string;
        try {
            output = execSync(`
                make -f "${makefile_path}/Makefile" \
                LIB="${lib}" HEADERS_PATH="${headers_path}" PROGRAM="${relative_path}"
                `, {
                cwd: simulator_src_folder,
                encoding: "utf8"
            });
        } catch (error) {
            throw new Error(`Failed to compile circuit '${circuit.name}' simulator`);
        }

        if (!fs.existsSync(full_path)) {
            throw new Error(`Simulator path '${full_path}' doesnt exist`);
        }
        return full_path;
    }

    /**
     * Creates simulator source files, compiles them into an executable,
     * and and its path in the database. Returns updated circuit entity.
     * @param circuit circuit entity from database
     * @param executable_name name of the executable to create
     */
    async createAndSaveSimulator(circuit: CircuitFile, executable_name: string): Promise<CircuitFile> {
        if (isEmpty(executable_name)) {
            throw new Error(`Simulator name '${executable_name}' cannot be empty`);
        }

        circuit.simulator_path = this.createSimulator(circuit, executable_name);
        await this.circuits_service.updateOne(circuit);
        return circuit;
    }

    /**
     * If not already saved, creates and saves the executable.
     * If not already saved, executes a simulation on a circuit and saves its result.
     * Returns saved result file entity.
     * Throws an error if something fails.
     * @param circuit circuit entity from database
     * @param simulation simulation entity from database
     */
    private async simulate(circuit: CircuitFile, simulation: SimulationFile): Promise<ResultFile> {
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
        const rslt_filepath = simulator_out_folder + simulation_filename; // TODO: Generate random name

        if (isEmpty(circuit.simulator_path)) {
            circuit = await this.createAndSaveSimulator(circuit, circuit_filename);
        }
        let saved_result_file = await this.results_service.getOneByCircuitAndSimulation(circuit, simulation);
        if (isEmpty(saved_result_file)) {
            this.executeSimulator(circuit.simulator_path, simulation.path, rslt_filepath);
            saved_result_file = await this.saveResult(rslt_filepath, circuit, simulation);
        }
        return saved_result_file;
    }

    /**
     * Executes given simulator with given simulation file, and outputs to the given result file.
     * Throws an error if execution fails, or if result file does not exist.
     * @param simulator_filepath path from project root to the circuit simulator executable
     * @param simu_filepath path from project root to the simulation file
     * @param rslt_filepath path from project root to simulation result file
     */
    executeSimulator(simulator_filepath: string, simu_filepath: string, rslt_filepath: string) {
        if (!fs.existsSync(simulator_filepath)) {
            throw new Error(`Simulator filepath '${simulator_filepath}' not found`);
        }
        if (!fs.existsSync(simu_filepath)) {
            throw new Error(`Simulation filepath '${simu_filepath}' not found`);
        }
        const rslt_folder = path.dirname(rslt_filepath);
        if (!fs.statSync(rslt_folder).isDirectory()) {
            throw new Error(`Result filepath directory '${rslt_folder}' not found or not a directory`);
        }

        try {
            execSync(`./"${simulator_filepath}" "${simu_filepath}" > "${rslt_filepath}"`);
        } catch (error) {
            throw new Error(`Failed to simulate circuit '${simulator_filepath}' ` +
                `with simulation '${simu_filepath}' and output to '${rslt_filepath}'`);
        }

        if (!fs.existsSync(rslt_filepath)) {
            throw new Error(`Simulation result file '${rslt_filepath}' does not exist`);
        }
    }

    /**
     * Inserts a new result file entity in ResultFile table, if not already inserted.
     * Throws an error if result file to save is not found or if insertion fails.
     * @param result_filepath path to the result file
     * @param circuit circuit entity from CircuitFile table
     * @param simulation simulation entity from SimulationFile table
     */
    async saveResult(result_filepath: string, circuit: CircuitFile, simulation: SimulationFile)
        : Promise<ResultFile> {
        let saved_result: ResultFile;
        saved_result = await this.results_service.getOneByCircuitAndSimulation(circuit, simulation);
        if (!saved_result) {
            if (!fs.existsSync(result_filepath)) {
                throw new Error(`Result file to save '${result_filepath}' not found`);
            }
            const new_result: ResultFileDTO = {
                path: result_filepath,
                circuit_file: circuit,
                simulation_file: simulation
            };
            saved_result = await this.results_service.insertOne(new_result);
        }
        return saved_result;
    }


    /**
    * Returns an array containing the signals names of the last sent WaveDrom, grouped by name.
    * Returns undefined if last sent WaveDrom is empty.
    */
    getSentWaveDromSignalsNames(): SignalNamesGroup[] {
        if (this.saver_service.simulation_sent?.signal?.length > 0) {
            return this.manipulator_service.getWaveDromSignalsNames(this.saver_service.simulation_sent);
        }
        return undefined;
    }

    /**
     * Returns an array containing the signals names of the last sent WaveDrom, grouped by name,
     * which contain search expression.
     * @param search_expression string to search in signals names
     */
    searchSentWaveDromSignals(search_expression: string): SignalNamesGroup[] {
        const signal_groups = this.getSentWaveDromSignalsNames();
        return this.manipulator_service.searchSignals(signal_groups, search_expression);
    }

    /**
     * Returns the interval of the actual simulation,
     * so its beginning and end time.
     */
    getSimulationLimits() {
        return this.manipulator_service.getLastSimulationLimits();
    }
}