import { Test, TestingModule } from '@nestjs/testing';
import { UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import { WaveDromManipulatorService } from '../waveDromManipulator/waveDromManipulator.service';
import { WaveDromSaverService } from '../waveDromSaver/waveDromSaver.service';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { SimulatorDTO } from './simulator.dto';
import { SimulatorService, bin_path } from "./simulator.service";
import * as fs from 'fs';
import { simu_rslt_files_wavedrom, filenameToFilepath } from "@simulogic/test"

const uuid_test = "527161a0-0155-4d0c-9022-b6de2b921932";

const simulation1: SimulationFile = {
    uuid: uuid_test, name: "simu 1",
    path: "some/path/to/simufile", result_path: ""
};

const circuit1: CircuitFile = {
    uuid: uuid_test, name: "circ 1",
    path: "some/path/to/circfile", simulator_path: ""
};

const expected_wavedrom: WaveDrom = {
    signal: [{ name: "s1", wave: "x010x" }],
    foot: { tick: "- 0 10 100 +" }
}
const expected_uuidwavedrom: UUIDWaveDrom = {
    uuid: uuid_test,
    wavedrom: expected_wavedrom
}

describe("SimulatorService", () => {
    let simulator: SimulatorService;
    let saver: WaveDromSaverService;
    let simu_repo: SimulationFilesService;
    let circuit_repo: CircuitFilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SimulatorService,
                {
                    provide: SimulationFilesService,
                    useValue: {
                        getOne: jest.fn().mockResolvedValue(simulation1)
                    }
                },
                {
                    provide: CircuitFilesService,
                    useValue: {
                        getOne: jest.fn().mockResolvedValue(circuit1),
                        updateOne: jest.fn().mockResolvedValue(circuit1)
                    }
                },
                WaveDromManipulatorService,
                {
                    provide: SimulationFileParserService,
                    useValue: {
                        parseFile: jest.fn().mockResolvedValue(expected_wavedrom)
                    }
                },
                WaveDromSaverService,
            ],
        }).compile();

        simulator = module.get<SimulatorService>(SimulatorService);
        simu_repo = module.get<SimulationFilesService>(SimulationFilesService);
        circuit_repo = module.get<CircuitFilesService>(CircuitFilesService);
        saver = module.get<WaveDromSaverService>(WaveDromSaverService);
    });

    it('should be defined', () => {
        expect(simulator).toBeDefined();
    });

    describe("process", () => {

        let simuDTO: SimulatorDTO;

        beforeEach(() => {
            simuDTO = {
                uuid_simu: ""
            };
        })

        it("should throw an error when simulatorDTO is null", async () => {
            // Given a null DTO
            // When calling process function
            let error: any;
            try {
                await simulator.process(null);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should throw an error when simulatorDTO is undefined", async () => {
            // Given an undefined DTO
            // When calling process function
            let error: any;
            try {
                await simulator.process(undefined);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should throw an error when simulatorDTO uuid_simu is not a UUID", async () => {
            // Given an undefined DTO
            // When calling process function
            simuDTO.uuid_simu = "adzlsdl";
            let error: any;
            try {
                await simulator.process(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should throw an error when simulation is not found", async () => {
            // Given a valid uuid_smi and a getOne function that returns undefined
            simuDTO.uuid_simu = uuid_test;
            jest.spyOn(simu_repo, "getOne").mockResolvedValue(undefined);

            // When calling process function
            let error: any;
            try {
                await simulator.process(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should not throw an error when simulation is found", async () => {
            // Given a valid uuid_simu and a getOne function that returns a simulation
            // When calling process function
            simuDTO.uuid_simu = uuid_test;
            let error: any;
            try {
                await simulator.process(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should not throw an error
            expect(error).toBeUndefined();
        });

        it("should return extracted WaveDrom and save it", async () => {
            // Given a DTO with a valid uuid_simu
            simuDTO.uuid_simu = expected_uuidwavedrom.uuid;

            // When calling process function
            const wavedrom = await simulator.process(simuDTO);

            // it should return the expected WaveDrom, and save it in memory
            expect(wavedrom).toEqual(expected_wavedrom);
            expect(saver.simulation).toEqual(expected_uuidwavedrom)
        });

        it("should fail to execute a simulation when uuid_circuit is undefined", async () => {
            // Given a DTO with a valid uuid_simu and result variable set to true
            simuDTO.uuid_simu = expected_uuidwavedrom.uuid;
            simuDTO.result = true;

            // When calling process function
            let error: any;
            try {
                await simulator.process(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should fail to execute a simulation when simulation and circuit files are not present", async () => {
            // Given a DTO with a valid uuid_simu
            // a valid uuid_circuit and result variable set to true
            simuDTO.uuid_simu = expected_uuidwavedrom.uuid;
            simuDTO.uuid_circuit = circuit1.uuid;
            simuDTO.result = true;

            // When calling process function
            let error: any;
            try {
                await simulator.process(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        let spy_creation: any;
        let spy_execution: any;

        /**
         * Sets simulation DTO for a simulation, and spies on simulator creation and execution.
         * The spies are also mocks, so creation and execution are fake.
         */
        const setSpiesAndDTO = () => {
            simuDTO.uuid_simu = simulation1.uuid;
            simuDTO.uuid_circuit = circuit1.uuid;
            simuDTO.result = true;
            spy_creation = jest.spyOn(simulator, "createAndSaveSimulator").mockResolvedValue(undefined);
            spy_execution = jest.spyOn(simulator, "executeSimulator").mockReturnThis();
        }
        /**
         * Makes CircuitsService 'getOne' function return wanted CircuitFile as if it was uploaded.
         * @param circuit_filename name of the circuit file
         */
        const mockGetOneCircuit = (circuit_filename: string) => {
            const circ_filepath = filenameToFilepath(circuit_filename);
            const circ: CircuitFile = {
                uuid: simuDTO.uuid_circuit,
                name: "some_name",
                path: circ_filepath,
                simulator_path: undefined
            };
            jest.spyOn(circuit_repo, "getOne").mockResolvedValue(circ);
        };

        /**
         * Makes SimulationsService 'getOne' function return wanted SimulationFile as if it was uploaded.
         * @param simulation_filename name of the simulation file
         */
        const mockGetOneSimulation = (simulation_filename: string) => {
            const simu_filepath = filenameToFilepath(simulation_filename);
            const simu: SimulationFile = {
                uuid: simuDTO.uuid_simu,
                name: "some_name",
                path: simu_filepath,
                result_path: undefined
            };
            jest.spyOn(simu_repo, "getOne").mockResolvedValue(simu);
        }

        it("should not fail to execute a simulation when simulation and circuit files are present", async () => {
            // Given a DTO with a valid uuid_simu
            // a valid uuid_circuit, a result variable set to true,
            // and mocked function responsible for simulator creation and execution
            setSpiesAndDTO();

            // When faking the simulation of valid files
            let num_exceptions = 0;
            for (let i = 0; i < simu_rslt_files_wavedrom.length; i++) {
                const simu_rslt_file = simu_rslt_files_wavedrom[i];
                mockGetOneCircuit(simu_rslt_file.circuit_filename);
                mockGetOneSimulation(simu_rslt_file.simu_file_wavedrom.filename);
                try {
                    await simulator.process(simuDTO); // function to test
                } catch (e) {
                    num_exceptions++;
                }
            }

            // it should throw no exception and call mocked functions for every simulation
            expect(num_exceptions).toEqual(0);
            expect(spy_creation).toBeCalledTimes(simu_rslt_files_wavedrom.length);
            expect(spy_execution).toBeCalledTimes(simu_rslt_files_wavedrom.length);
        });

        it("should fail to execute a simulation when simulation files are not present", async () => {
            // Given a DTO with a valid uuid_simu
            // a valid uuid_circuit, a result variable set to true,
            // and mocked function responsible for simulator creation and execution
            setSpiesAndDTO();

            // When trying to simulate present circuit files with absent simulation files
            let num_exceptions = 0;
            for (let i = 0; i < simu_rslt_files_wavedrom.length; i++) {
                const simu_rslt_file = simu_rslt_files_wavedrom[i];
                mockGetOneCircuit(simu_rslt_file.circuit_filename);
                try {
                    await simulator.process(simuDTO); // function to test
                } catch (e) {
                    num_exceptions++;
                }
            }

            // it should throw an exception for each tried simulation
            // and creation and execution functions should never be called
            expect(num_exceptions).toEqual(simu_rslt_files_wavedrom.length);
            expect(spy_creation).toBeCalledTimes(0);
            expect(spy_execution).toBeCalledTimes(0);
        });

        it("should fail to execute a simulation when circuit files are not present", async () => {
            // Given a DTO with a valid uuid_simu
            // a valid uuid_circuit, a result variable set to true,
            // and mocked function responsible for simulator creation and execution
            setSpiesAndDTO();

            // When trying to simulate present simulation files with absent circuit files
            let num_exceptions = 0;
            for (let i = 0; i < simu_rslt_files_wavedrom.length; i++) {
                const simu_rslt_file = simu_rslt_files_wavedrom[i];
                mockGetOneSimulation(simu_rslt_file.simu_file_wavedrom.filename);
                try {
                    await simulator.process(simuDTO); // function to test
                } catch (e) {
                    num_exceptions++;
                }
            }

            // it should throw an exception for each tried simulation
            // and creation and execution functions should never be called
            expect(num_exceptions).toEqual(simu_rslt_files_wavedrom.length);
            expect(spy_creation).toBeCalledTimes(0);
            expect(spy_execution).toBeCalledTimes(0);
        });

    });

    describe("createAndSaveSimulator", () => {

        it("should throw an error when circuit is null or undefined", async () => {
            // Given a spy on updateOne function
            const spy_update = jest.spyOn(circuit_repo, "updateOne");

            // When creating and saving associated simulator
            const bad_circuits: CircuitFile[] = [null, undefined];
            let num_exceptions = 0;
            for (let i = 0; i < bad_circuits.length; i++) {
                const bad_circ = bad_circuits[i];
                try {
                    await simulator.createAndSaveSimulator(bad_circ, "simulator");
                } catch (e) { num_exceptions++ };   
            }

            // Then it should throw errors and updateOne function should not be called
            expect(num_exceptions).toEqual(bad_circuits.length);
            expect(spy_update).toBeCalledTimes(0);
        });

        it("should throw an error when circuit file is not present", async () => {
            // Given an absent circuit file returned by mocked getOne function
            // and a spy on updateOne function
            const circ: CircuitFile = {
                uuid: uuid_test,
                name: "some_name",
                path: "bad_path",
                simulator_path: undefined
            };
            jest.spyOn(circuit_repo, "getOne").mockResolvedValue(circ);
            const spy_update = jest.spyOn(circuit_repo, "updateOne");

            // When creating and saving associated simulator
            let error: any;
            try {
                await simulator.createAndSaveSimulator(circ, "simulator");
            } catch (e) { error = e };

            // Then it should throw an error and updateOne function should not be called
            expect(error).toBeDefined();
            expect(spy_update).toBeCalledTimes(0);
        });

        it("should throw an error when executable name is empty, null or undefined", async () => {
            // Given a present circuit file returned by mocked getOne function
            // and a spy on updateOne function
            const circ_filepath = filenameToFilepath(simu_rslt_files_wavedrom[0].circuit_filename);
            const circ: CircuitFile = {
                uuid: uuid_test,
                name: "some_name",
                path: circ_filepath,
                simulator_path: undefined
            };
            jest.spyOn(circuit_repo, "getOne").mockResolvedValue(circ);
            const spy_update = jest.spyOn(circuit_repo, "updateOne");

            // When trying to create associated simulator with bad executable names
            let num_exceptions = 0;
            const bad_names = ["", null, undefined];
            for (let i = 0; i < bad_names.length; i++) {
                const bad_name = bad_names[i];
                try {
                    await simulator.createAndSaveSimulator(circ, bad_name);
                } catch (e) { num_exceptions++ };
            }

            // Then it should throw errors and updateOne function should not be called
            expect(num_exceptions).toEqual(bad_names.length);
            expect(spy_update).toBeCalledTimes(0);
        });

        it("should create and save circuit simulators", async () => {
            const spy_update = jest.spyOn(circuit_repo, "updateOne");
            for (let i = 0; i < simu_rslt_files_wavedrom.length; i++) {

                // Given a present circuit file returned by mocked getOne function
                const circ_filepath = filenameToFilepath(simu_rslt_files_wavedrom[i].circuit_filename);
                const circ: CircuitFile = {
                    uuid: uuid_test,
                    name: "some_name",
                    path: circ_filepath,
                    simulator_path: undefined
                };
                jest.spyOn(circuit_repo, "getOne").mockResolvedValue(circ);

                // When creating and saving associated simulator
                const updated_circ = await simulator.createAndSaveSimulator(circ, "simulator");

                // Then updated circuit entity should contain expected simulator path,
                // simulator should exist, and updateOne function should have been called once
                const expected_simulator_path = bin_path + "simulator";
                circ.simulator_path = expected_simulator_path;
                expect(updated_circ).toEqual(circ);
                expect(fs.existsSync(circ.simulator_path)).toBeTruthy();
                fs.unlinkSync(circ.simulator_path); // delete created simulator file
            }
            expect(spy_update).toBeCalledTimes(simu_rslt_files_wavedrom.length);
        });
    });

    // describe("executeSimulator", () => {

    // });
});