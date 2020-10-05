import { Test, TestingModule } from '@nestjs/testing';
import { UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { ExtractorService } from '../extractor/extractor.service';
import { ManipulatorService } from '../manipulator/manipulator.service';
import { MemoryService } from '../memory/memory.service';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';
import { SimulationFilesService } from '../simulationFiles/simulationFiles.service';
import { SimulatorDTO } from './simulator.dto';
import { SimulatorService } from "./simulator.service";

const uuid_test = "527161a0-0155-4d0c-9022-b6de2b921932";

const simulation1: SimulationFile = {
    uuid: uuid_test, name: "simu 1",
    path: "some/path/to/file", result_path: ""
};

const circuit1: CircuitFile = {
    uuid: uuid_test, name: "circ 1",
    path: "some/path/to/file", simulator_path: ""
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
    let memory: MemoryService;
    let simu_repo: SimulationFilesService;

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
                        getOne: jest.fn().mockResolvedValue(circuit1)
                    }
                }, 
                 ManipulatorService,
                {
                    provide: ExtractorService,
                    useValue: {
                        extractFile: jest.fn().mockResolvedValue(expected_wavedrom)
                    }
                },
                MemoryService,
            ],
        }).compile();

        simulator = module.get<SimulatorService>(SimulatorService);
        simu_repo = module.get<SimulationFilesService>(SimulationFilesService);
        memory = module.get<MemoryService>(MemoryService);
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
            expect(memory.simulation).toEqual(expected_uuidwavedrom)
        });



    });

});