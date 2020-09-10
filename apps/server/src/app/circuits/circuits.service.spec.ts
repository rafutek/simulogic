import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsService } from "./circuits.service"
import { Repository, Like } from 'typeorm';
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
            delete: jest.fn().mockResolvedValue(true),
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
    it('should return all circuits by id and name', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'find');
      // Call the function to test
      const circuits_found = await service.getAllByEntity();
      // Check result equals mocked value
      expect(circuits_found).toEqual(circuits);
      // Check repo find function has been called with select option
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith({ select: ["id", "name"] });
    });
  });

  describe('getOne', () => {
    it('should return one circuit', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'findOne');
      // Call the function to test
      const circuit = await service.getOne(2);
      // Check result equals mocked value
      expect(circuit).toEqual(circuit1);
      // Check repo fondOne function has been called
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith(2);
    });
  });

  describe('getOneByEntity', () => {
    it('should return one circuit by id and name', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'findOne');
      // Call the function to test
      const circuit = await service.getOneByEntity(2);
      // Check result equals mocked value
      expect(circuit).toEqual(circuit1);
      // Check repo fondOne function has been called with select option
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith(2, { select: ["id", "name"] });
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
        id: 12,
        name: "circuit name",
        path: "path",
        simulator_path: ""
      };
      const repo_spy = jest.spyOn(repo, 'update');

      // When inserting the circuit
      const updated_circuit = await service.updateOne(circuit_to_update);

      // Then updated circuit should be the mocked one,
      // and update repository funtion should be called once with those parameters
      expect(updated_circuit).toEqual(circuit1);
      expect(repo_spy).toBeCalledTimes(1);
      expect(repo_spy).toBeCalledWith({ id: 12 }, circuit_to_update);
    });
  });

  describe('deleteOne', () => {
    it('should return {deleted: true}', async () => {
      // Given mocked delete repo function
      // When deleting a circuit
      const result_delete = await service.deleteOne('an id');
      
      // Then it should success
      expect(result_delete).toEqual({ deleted: true });
    });

    it('should return {deleted: false, message: err.message}', async () => {
      // Given mocked delete repo function that fails
      const repo_spy = jest.spyOn(repo, 'delete').mockRejectedValueOnce(new Error('Bad Delete Method.'));

      // When deleting a 'bad' circuit
      const result_delete = await service.deleteOne('a bad id');

      // Then this should be the result, 
      // and the repo delete function should be called once with this parameterr
      expect(result_delete).toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
      expect(repo_spy).toBeCalledWith('a bad id');
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
        select: ["id", "name"]
      });
    });
  });

  describe('renameOne', () => {
    it('should rename one circuit', async () => {
      // Given a circuit, and spies on repo functions
      const circuit_to_rename: Circuit = {
        id: 12,
        name: "circuit name",
        path: "path",
        simulator_path: ""
      };
      const repo_find_spy = jest.spyOn(repo, 'findOne');
      const repo_update_spy = jest.spyOn(repo, 'update');

      // When renaming the circuit
      const renamed_circuit = await service.renameOne(circuit_to_rename.id, "new name");

      // Then updated circuit should be the mocked one,
      // and repo funtions should be called once with those parameters
      expect(renamed_circuit).toEqual(circuit1);
      expect(repo_find_spy).toBeCalledTimes(2);
      expect(repo_update_spy).toBeCalledTimes(1);
      expect(repo_update_spy).toBeCalledWith(12, circuit1);
    });
  });

})