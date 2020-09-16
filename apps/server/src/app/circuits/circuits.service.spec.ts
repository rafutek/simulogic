import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsService } from "./circuits.service"
import { Repository, Like, DeleteResult } from 'typeorm';
import { Circuit } from './circuit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CircuitDTO } from './circuit.dto';

const circuit1 = new Circuit("circuit 1", "/path/test", "sim/path/test");
const circuit2 = new Circuit("circuit 2", "/path/test", "sim/path/test");
const circuits: Circuit[] = [circuit1, circuit2];

describe("CircuitsService", () => {
  let service: CircuitsService;
  let repo: Repository<Circuit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CircuitsService,
        {
          provide: getRepositoryToken(Circuit),
          // Mock the repository functions
          useValue: {
            find: jest.fn().mockResolvedValue(circuits),
            findOne: jest.fn().mockResolvedValue(circuit1),
            create: jest.fn().mockReturnValue(circuit1),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          }
        }
      ]
    }).compile();

    service = module.get<CircuitsService>(CircuitsService);
    repo = module.get<Repository<Circuit>>(getRepositoryToken(Circuit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all circuits', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'find');
      // Call the function to test
      const circuits_found = await service.getAll();
      // Check result equals mocked value
      expect(circuits_found).toEqual(circuits);
      // Check repo find function has been called
      expect(repo_spy).toBeCalledTimes(1);
    });
  });

  describe('getAllByEntity', () => {
    it('should return all circuits by uuid and name', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'find');
      // Call the function to test
      const circuits_found = await service.getAllByEntity();
      // Check result equals mocked value
      expect(circuits_found).toEqual(circuits);
      // Check repo find function has been called with select option
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith({ select: ["uuid", "name"] });
    });
  });

  describe('getOne', () => {
    it('should return one circuit', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'findOne');
      // Call the function to test
      const circuit = await service.getOne("2");
      // Check result equals mocked value
      expect(circuit).toEqual(circuit1);
      // Check repo fondOne function has been called
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith("2");
    });
  });

  describe('getOneByEntity', () => {
    it('should return one circuit by uuid and name', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'findOne');
      // Call the function to test
      const circuit = await service.getOneByEntity("2");
      // Check result equals mocked value
      expect(circuit).toEqual(circuit1);
      // Check repo fondOne function has been called with select option
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith("2", { select: ["uuid", "name"] });
    });
  });

  describe('insertOne', () => {
    it('should insert one circuit', async () => {
      // Given a circuit DTO, and spies on repo functions
      // Note that DTO validation is done in end-to-end (e2e) tests
      const circuit_test_dto = new CircuitDTO();
      circuit_test_dto.name = "circuit name";
      circuit_test_dto.path = "circuit path";
      const repo_create_spy = jest.spyOn(repo, 'create');
      const repo_save_spy = jest.spyOn(repo, 'save');

      // When inserting the circuit
      const new_circuit = await service.insertOne(circuit_test_dto);

      // Then inserted value should be the mocked one,
      // create repo functions should be called once with given DTO
      expect(new_circuit).toEqual(circuit1);
      expect(repo_create_spy).toBeCalledTimes(1);
      expect(repo_create_spy).toBeCalledWith(circuit_test_dto);
      expect(repo_save_spy).toBeCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should update one circuit', async () => {
      // Given a circuit, and spies on repo functions
      const circuit_to_update: Circuit = {
        uuid: "12",
        name: "circuit name",
        path: "path",
        simulator_path: ""
      };
      const repo_spy = jest.spyOn(repo, 'update');

      // When updating the circuit
      const updated_circuit = await service.updateOne(circuit_to_update);

      // Then updated circuit should be the mocked one,
      // and update repository funtion should be called once with those parameters
      expect(updated_circuit).toEqual(circuit1);
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith(12, circuit_to_update);
    });
  });

  describe('deleteOne', () => {
    it('should delete a circuit', async () => {
      // When deleting a valid circuit
      const deleted = await service.deleteOne('an uuid');

      //Then it should be deleted
      expect(deleted).toBeTruthy();
    });

    it('should fail to delete a circuit', async () => {
      // Given mocked delete repo function that fails
      const bad_result: DeleteResult = {
        raw: "",
        affected: 0
      }
      const repo_spy = jest.spyOn(repo, 'delete').mockResolvedValueOnce(bad_result);

      // When deleting a 'bad' circuit
      const deleted = await service.deleteOne('a bad uuid');

      // Then it should fail, 
      // and the repo delete function should be called once with this parameter
      expect(deleted).toBeFalsy();
      expect(repo_spy).toBeCalledWith('a bad uuid');
      expect(repo_spy).toBeCalledTimes(1);
    });
  });

  describe('findAndGetByEntity', () => {
    it('should return found circuit', async () => {
      // Given an array of circuits, and spy on repo find function
      const repo_spy = jest.spyOn(repo, 'find');

      // When searching the circuits
      const found_circuits = await service.findAndGetByEntity("test expression");

      // Then found circuits should be the result of find mocked function,
      // and this repo funtion should be called once with those parameters
      expect(found_circuits).toEqual(circuits);
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith({
        where: { name: Like("test expression") },
        select: ["uuid", "name"]
      });
    });
  });

  describe('renameOne', () => {
    it('should rename one circuit', async () => {
      // Given a circuit, and spies on repo functions
      const circuit_to_rename: Circuit = {
        uuid: "12",
        name: "circuit name",
        path: "path",
        simulator_path: ""
      };
      const repo_find_spy = jest.spyOn(repo, 'findOne');
      const repo_update_spy = jest.spyOn(repo, 'update');

      // When renaming the circuit
      const renamed = await service.renameOne(circuit_to_rename.uuid, "new naame");

      // Then it should be successfully renamed,
      // and findOne funtion should be called twice
      // and update should be called once with those parameters
      expect(renamed).toBeTruthy();
      expect(repo_find_spy).toBeCalledTimes(2);
      expect(repo_update_spy).toBeCalledTimes(1);
      expect(repo_update_spy).toBeCalledWith(circuit_to_rename.uuid, circuit1);
    });

    it('should fail when circuit is not found', async () => {
      // Given a findOne repo function that finds nothing
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);

      // When renaming the circuit
      const renamed = await service.renameOne("an uuid", "neww name");

      // Then it should fail to rename
      expect(renamed).toBeFalsy();
    });
  });

})