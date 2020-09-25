import { SimulatorController } from './simulator.controller'
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryService } from '../memory/memory.service';
import { SimulatorDTO } from './simulator.dto';
import { ExtractorService } from '../extractor/extractor.service';
import { SimulationsService } from '../simulations/simulations.service';
import {  UUIDWaveDrom, WaveDrom } from '@simulogic/core';

const uuid_test = "527161a0-0155-4d0c-9022-b6de2b921932";

const simulation1 = {uuid: uuid_test, path: "some/path/to/file"};

const expected_wavedrom: WaveDrom = {
    signal: [{ name: "s1", wave: "x010x" }],
    foot: { tick: "- 0 10 100 +" }
}
const expected_uuidwavedrom: UUIDWaveDrom = {
    uuid: uuid_test,
    wavedrom: expected_wavedrom
}

describe("SimulatorController", () => {
    let simulator: SimulatorController;
    let memory: MemoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SimulatorController],
            providers: [
                {
                    provide: SimulationsService,
                    // Mock simulation service functions
                    useValue: {
                        getOne: jest.fn().mockResolvedValue(simulation1)
                    }
                },
                MemoryService,
                {
                    provide: ExtractorService,
                    useValue: {
                        extractFile: jest.fn().mockResolvedValue(expected_wavedrom)
                    }
                },
            ],

        }).compile();

        simulator = module.get<SimulatorController>(SimulatorController);
        memory = module.get<MemoryService>(MemoryService);
    });

    it('should be defined', () => {
        expect(simulator).toBeDefined();
    });

    describe("manage", () => {

        let simuDTO: SimulatorDTO;

        beforeEach(() => {
            simuDTO = {
                uuid_simu: ""
            };
        })

        it("should throw an error when simulatorDTO is null", async () => {
            // Given a null DTO
            // When calling manage function
            let error: any;
            try {
                await simulator.manage(null);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should throw an error when simulatorDTO is undefined", async () => {
            // Given an undefined DTO
            // When calling manage function
            let error: any;
            try {
                await simulator.manage(undefined);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should throw an error when simulatorDTO uuid_simu is not a UUID", async () => {
            // Given a DTO with a bad uuid_simu
            simuDTO.uuid_simu = "azqsdf";

            // When calling manage function
            let error: any;
            try {
                await simulator.manage(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should throw an error
            expect(error).toBeDefined();
        });

        it("should not throw an error when simulatorDTO uuid_simu is a UUID", async () => {
            // Given a DTO with a valid uuid_simu
            simuDTO.uuid_simu = uuid_test;

            // When calling manage function
            let error: any;
            try {
                await simulator.manage(simuDTO);
            } catch (e) {
                error = e;
            }
            // it should not throw an error
            expect(error).toBeUndefined();
        });

        it("should return extracted WaveDrom and save it", async () => {
            // Given a DTO with a valid uuid_simu
            simuDTO.uuid_simu = expected_uuidwavedrom.uuid;

            // When calling manage function
            const wavedrom = await simulator.manage(simuDTO);

            // it should return the expected WaveDrom, and save it in memory
            expect(wavedrom).toEqual(expected_wavedrom);
            expect(memory.simulation).toEqual(expected_uuidwavedrom)
        });

        

    })
});