import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from "./simulations.service"
import { Repository, Like, DeleteResult } from 'typeorm';
import { Simulation } from './simulation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SimulationDTO } from './simulation.dto';

const simu1 = new Simulation("simu 1", "/path/test", "result/path/test");
const simu2 = new Simulation("simu 2", "/path/test", "result/path/test");
const simulations: Simulation[] = [simu1, simu2];

describe("CircuitsService", () => {
    let service: SimulationsService;
    let repo: Repository<Simulation>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SimulationsService,
                {
                    provide: getRepositoryToken(Simulation),
                    // Mock the repository functions
                    useValue: {
                        find: jest.fn().mockResolvedValue(simulations),
                        findOne: jest.fn().mockResolvedValue(simu1),
                        create: jest.fn().mockReturnValue(simu1),
                        save: jest.fn(),
                        update: jest.fn().mockResolvedValue(true),
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),
                    }
                }
            ]
        }).compile();

        service = module.get<SimulationsService>(SimulationsService);
        repo = module.get<Repository<Simulation>>(getRepositoryToken(Simulation));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAll', () => {
        it('should return all simulations', async () => {
            // Spy the findOne repo function
            const repo_spy = jest.spyOn(repo, 'find');
            // Call the function to test
            const simulations_found = await service.getAll();
            // Check result equals mocked value
            expect(simulations_found).toEqual(simulations);
            // Check repo find function has been called
            expect(repo_spy).toBeCalledTimes(1);
        });
    });

    describe('getAllByEntity', () => {
        it('should return all simulations by id and name', async () => {
            // Spy the findOne repo function
            const repo_spy = jest.spyOn(repo, 'find');
            // Call the function to test
            const simulations_found = await service.getAllByEntity();
            // Check result equals mocked value
            expect(simulations_found).toEqual(simulations);
            // Check repo find function has been called with select option
            expect(repo_spy).toBeCalledTimes(1);
            expect(repo_spy).toBeCalledWith({ select: ["id", "name"] });
        });
    });

    describe('getOne', () => {
        it('should return one simulation', async () => {
            // Spy the findOne repo function
            const repo_spy = jest.spyOn(repo, 'findOne');
            // Call the function to test
            const simulation = await service.getOne(2);
            // Check result equals mocked value
            expect(simulation).toEqual(simu1);
            // Check repo fondOne function has been called
            expect(repo_spy).toBeCalledTimes(1);
            expect(repo_spy).toBeCalledWith(2);
        });
    });

    describe('getOneByEntity', () => {
        it('should return one simulation by id and name', async () => {
            // Spy the findOne repo function
            const repo_spy = jest.spyOn(repo, 'findOne');
            // Call the function to test
            const simulation = await service.getOneByEntity(2);
            // Check result equals mocked value
            expect(simulation).toEqual(simu1);
            // Check repo fondOne function has been called with select option
            expect(repo_spy).toBeCalledTimes(1);
            expect(repo_spy).toBeCalledWith(2, { select: ["id", "name"] });
        });
    });

    describe('insertOne', () => {
        it('should insert one simulation', async () => {
            // Given a simulation DTO, and spies on repo functions
            // Note that DTO validation is done in end-to-end (e2e) tests
            const simu_test_dto = new SimulationDTO();
            simu_test_dto.name = "simu name";
            simu_test_dto.path = "simu path";
            const repo_create_spy = jest.spyOn(repo, 'create');
            const repo_save_spy = jest.spyOn(repo, 'save');

            // When inserting the simulation
            const new_simu = await service.insertOne(simu_test_dto);

            // Then inserted value should be the mocked one,
            // create repo functions should be called once with given DTO
            expect(new_simu).toEqual(simu1);
            expect(repo_create_spy).toBeCalledTimes(1);
            expect(repo_create_spy).toBeCalledWith(simu_test_dto);
            expect(repo_save_spy).toBeCalledTimes(1);
        });
    });

    describe('updateOne', () => {
        it('should update one simulation', async () => {
            // Given a simulation, and spies on repo functions
            const simu_to_update: Simulation = {
                id: 12,
                name: "simu name",
                path: "path",
                result_path: ""
            };
            const repo_spy = jest.spyOn(repo, 'update');

            // When updating the simu
            const updated_simu = await service.updateOne(simu_to_update);

            // Then updated simu should be the mocked one,
            // and update repository funtion should be called once with those parameters
            expect(updated_simu).toEqual(simu1);
            expect(repo_spy).toBeCalledTimes(1);
            expect(repo_spy).toBeCalledWith(12, simu_to_update);
        });
    });

    describe('deleteOne', () => {
        it('should delete a simulation', async () => {
            // When deleting a valid simulation
            const deleted = await service.deleteOne('an id');

            //Then it should be deleted
            expect(deleted).toBeTruthy();
        });

        it('should fail to delete a simulation', async () => {
            // Given mocked delete repo function that fails
            const bad_result: DeleteResult = {
              raw: "",
              affected: 0
            }
            const repo_spy = jest.spyOn(repo, 'delete').mockResolvedValueOnce(bad_result);
      
            // When deleting a 'bad' simulation
            const deleted = await service.deleteOne('a bad id');
      
            // Then it should fail, 
            // and the repo delete function should be called once with this parameter
            expect(deleted).toBeFalsy();
            expect(repo_spy).toBeCalledWith('a bad id');
            expect(repo_spy).toBeCalledTimes(1);
          });
    });

    describe('findAndGetByEntity', () => {
        it('should return found simulation', async () => {
          // Given an array of simulations, and spy on repo find function
          const repo_spy = jest.spyOn(repo, 'find');
    
          // When searching the simulations
          const found_simulations = await service.findAndGetByEntity("test expression");
    
          // Then found simulations should be the result of find mocked function,
          // and this repo funtion should be called once with those parameters
          expect(found_simulations).toEqual(simulations);
          expect(repo_spy).toBeCalledTimes(1);
          expect(repo_spy).toBeCalledWith({
            where: { name: Like("test expression") },
            select: ["id", "name"]
          });
        });
      });

      describe('renameOne', () => {
        it('should rename one simulation', async () => {
          // Given a simulation, and spies on repo functions
          const simulation_to_rename: Simulation = {
            id: 12,
            name: "simulation name",
            path: "path",
            result_path: ""
          };
          const repo_find_spy = jest.spyOn(repo, 'findOne');
          const repo_update_spy = jest.spyOn(repo, 'update');
    
          // When renaming the simulation
          const renamed = await service.renameOne(simulation_to_rename.id, "new naame");
    
          // Then it should be successfully renamed,
          // and findOne funtion should be called twice
          // and update should be called once with those parameters
          expect(renamed).toBeTruthy();
          expect(repo_find_spy).toBeCalledTimes(2);
          expect(repo_update_spy).toBeCalledTimes(1);
          expect(repo_update_spy).toBeCalledWith(simulation_to_rename.id, simu1);
        });
    
        it('should fail when simulation is not found', async () => {
          // Given a findOne repo function that finds nothing
          jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
    
          // When renaming the simulation
          const renamed = await service.renameOne("an id", "neww name");
    
          // Then it should fail to rename
          expect(renamed).toBeFalsy();
        });
      });
});