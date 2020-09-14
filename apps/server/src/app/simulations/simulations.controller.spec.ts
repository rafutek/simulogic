import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from "./simulations.service"
import { Simulation } from './simulation.entity';
import { SimulationsController } from './simulations.controller';
import { CircuitsService } from '../circuits/circuits.service';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorsService } from '../extractors/extractors.service';

const simulation1 = new Simulation("simulation 1", "/path/test", "sim/path/test");
const simulation2 = new Simulation("simulation 2", "/path/test", "sim/path/test");
const simulations: Simulation[] = [simulation1, simulation2];

const circuit1 = new Circuit("circuit 1", "/path/test", "sim/path/test");
const circuit2 = new Circuit("circuit 2", "/path/test", "sim/path/test");
const circuits: Circuit[] = [circuit1, circuit2];

const entity1 = { id: 13, name: "simulation test" };
const entity2 = { id: 17, name: "another simulation" };
const entities = [entity1, entity2];

describe("CircuitsController", () => {
    let controller: SimulationsController;
    let service: SimulationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SimulationsController],
            providers: [
                {
                    provide: SimulationsService,
                    // Mock simulation service functions
                    useValue: {
                        insertOne: jest.fn(),
                        getAll: jest.fn().mockResolvedValue(simulations),
                        getAllByEntity: jest.fn().mockResolvedValue(entities),
                        getOne: jest.fn().mockResolvedValue(simulation1),
                        getOneByEntity: jest.fn().mockResolvedValue(entity1),
                        deleteOne: jest.fn().mockReturnValue(true),
                        findAndGetByEntity: jest.fn().mockResolvedValue(entities),
                        renameOne: jest.fn().mockResolvedValue(true),
                    }
                },
                {
                    provide: CircuitsService,
                    // Mock simulations service functions
                    useValue: {}
                },
                {
                    provide: ExtractorsService,
                    // Mock extractor service functions
                    useValue: {}
                }
            ]
        }).compile();

        controller = module.get<SimulationsController>(SimulationsController);
        service = module.get<SimulationsService>(SimulationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('uploadSimulations', () => {
        it('should insert simulations in database', async () => {
            // Given an array of test files and a spy on service insertOne function
            const valid_file: Express.Multer.File = {
                originalname: "test.simu", path: "test/path",
                filename: "", fieldname: "", encoding: "", mimetype: "",
                size: 0, stream: null, destination: "", buffer: null
            };
            const invalid_file1: Express.Multer.File = {
                originalname: "test", path: "test/path", // filename should have .simu extension
                filename: "", fieldname: "", encoding: "", mimetype: "",
                size: 0, stream: null, destination: "", buffer: null
            };
            const invalid_file2: Express.Multer.File = {
                originalname: "test.simu", path: "", // path should not be empty
                filename: "", fieldname: "", encoding: "", mimetype: "",
                size: 0, stream: null, destination: "", buffer: null
            };
            const files = [valid_file, valid_file, invalid_file1, invalid_file2];
            const service_spy = jest.spyOn(service, 'insertOne');

            // When uploading the simulation files
            const invalid_files = await controller.uploadSimulations(files);

            // Then spied function should be called twice
            // and there should be one file not uplaoded
            expect(service_spy).toBeCalledTimes(2);
            expect(invalid_files).toEqual([invalid_file1, invalid_file2]);
        });
    });

    describe('getSimulations', () => {
        it('should return all simulations', async () => {
            // Given a spy on service function
            const service_spy = jest.spyOn(service, 'getAllByEntity');

            // When getting the simulations
            const simulations_found = await controller.getSimulations();

            // Then we should get entities mocked value,
            // and spied function should be called once
            expect(simulations_found).toEqual(entities);
            expect(service_spy).toBeCalledTimes(1);
        });
    });

    describe('getSimulation', () => {
        it('should return one simulation', async () => {
            // Given a spy on service function
            const service_spy = jest.spyOn(service, 'getOneByEntity');

            // When getting the simulation
            const simulation_found = await controller.getSimulation("an id");

            // Then we should get entities mocked value,
            // and spied function should be called once
            expect(simulation_found).toEqual(entity1);
            expect(service_spy).toBeCalledTimes(1);
        });

        it('should throw an error', async () => {
            // Given service function that fails
            jest.spyOn(service, 'getOneByEntity').mockResolvedValue(undefined);

            // When getting a simulation
            let error: any, simulation_found: any;
            try {
                simulation_found = await controller.getSimulation("an id");
            } catch (err) {
                error = err;
            }

            // Then it should raise an error and no simulation should be found
            expect(error).toBeDefined();
            expect(simulation_found).toBeUndefined();
        });
    });

    describe('deleteSimulation', () => {
        it('should delete one simulation', async () => {
            // Given a spy on service function
            const service_spy = jest.spyOn(service, 'deleteOne');

            // When deletting the simulation
            await controller.deleteSimulation("an id");

            // Then spied function should be called once
            expect(service_spy).toBeCalledTimes(1);
        });

        it('should throw an error', async () => {
            // Given service function that fails
            jest.spyOn(service, 'deleteOne').mockResolvedValue(false);

            // When getting a simulation
            let error: any, simulation_found: any;
            try {
                await controller.deleteSimulation("an id");
            } catch (err) {
                error = err;
            }

            // Then it should raise an error
            expect(error).toBeDefined();
        });
    });

    describe('searchSimulations', () => {
        it('should return found simulations', async () => {
            // Given a spy on service function
            const service_spy = jest.spyOn(service, 'findAndGetByEntity');

            // When searching through the simulations
            const simulations_found = await controller.searchSimulations("an expression");

            // Then we should get mocked value,
            // and spied function should be called once
            expect(simulations_found).toEqual(entities);
            expect(service_spy).toBeCalledTimes(1);
        });

        it('should throw an error when no simulations are uploaded', async () => {
            // Given service function that returns no simulations
            jest.spyOn(service, 'getAll').mockResolvedValue([]);

            // When searching through the simulations
            let error: any, simulations_found: any;
            try {
                simulations_found = await controller.searchSimulations("an expression");
            } catch (err) {
                error = err;
            }

            // Then it should raise an error
            expect(error).toBeDefined();
        });
    });

    describe('renameSimulation', () => {
        it('should not raise an error', async () => {
            // Given a spy on service function
            const service_spy = jest.spyOn(service, 'renameOne');

            // When renaming a simulation
            let error: any;
            try {
                await controller.renameSimulation("an id", "new name");
            } catch (err) {
                error = err;
            }
            // Then it should not raise an error,
            // and spied function should be called once
            expect(error).toBeUndefined();
            expect(service_spy).toBeCalledTimes(1);
        });

        it('should raise an error', async () => {
            // Given a renameOne function that fails
            jest.spyOn(service, 'renameOne').mockResolvedValue(false);

            // When renaming a simulation
            let error: any;
            try {
                await controller.renameSimulation("an id", "new name");
            } catch (err) {
                error = err;
            }

            // Then it should raise an error
            expect(error).toBeDefined();
        });
    });

});