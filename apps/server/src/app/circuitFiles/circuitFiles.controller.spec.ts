import { Test, TestingModule } from '@nestjs/testing';
import { CircuitFilesService } from "./circuitFiles.service"
import { CircuitFile } from './circuitFile.entity';
import { CircuitFilesController } from './circuitFiles.controller';

const circuit1 = new CircuitFile("circuit 1", "/path/test", "sim/path/test");
const circuit2 = new CircuitFile("circuit 2", "/path/test", "sim/path/test");
const circuits: CircuitFile[] = [circuit1, circuit2];

const entity1 = { id: 13, name: "circuit test" };
const entity2 = { id: 17, name: "another circuit" };
const entities = [entity1, entity2];

describe("CircuitFilesController", () => {
  let controller: CircuitFilesController;
  let service: CircuitFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CircuitFilesController],
      providers: [
        {
          provide: CircuitFilesService,
          // Mock the service functions
          useValue: {
            insertOne: jest.fn(),
            getAll: jest.fn().mockResolvedValue(circuits),
            getAllByEntity: jest.fn().mockResolvedValue(entities),
            getOne: jest.fn().mockResolvedValue(circuit1),
            getOneByEntity: jest.fn().mockResolvedValue(entity1),
            deleteOne: jest.fn().mockReturnValue(true),
            findAndGetByEntity: jest.fn().mockResolvedValue(entities),
            renameOne: jest.fn().mockResolvedValue(true),
          }
        }
      ]
    }).compile();

    controller = module.get<CircuitFilesController>(CircuitFilesController);
    service = module.get<CircuitFilesService>(CircuitFilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadCircuits', () => {
    it('should insert circuits in database', async () => {
      // Given an array of test files and a spy on service insertOne function
      const valid_file: Express.Multer.File = {
        originalname: "test.logic", path: "test/path",
        filename: "", fieldname: "", encoding: "", mimetype: "",
        size: 0, stream: null, destination: "", buffer: null
      };
      const invalid_file1: Express.Multer.File = {
        originalname: "test", path: "test/path", // filename should have .logic extension
        filename: "", fieldname: "", encoding: "", mimetype: "",
        size: 0, stream: null, destination: "", buffer: null
      };
      const invalid_file2: Express.Multer.File = {
        originalname: "test.logic", path: "", // path should not be empty
        filename: "", fieldname: "", encoding: "", mimetype: "",
        size: 0, stream: null, destination: "", buffer: null
      };
      const files = [valid_file, valid_file, invalid_file1, invalid_file2];
      const service_spy = jest.spyOn(service, 'insertOne');

      // When uploading the circuit files
      const invalid_files = await controller.uploadCircuits(files);

      // Then spied function should be called twice
      // and there should be one file not uplaoded
      expect(service_spy).toBeCalledTimes(2);
      expect(invalid_files).toEqual([invalid_file1, invalid_file2]);
    });
  });

  describe('getCircuits', () => {
    it('should return all circuits', async () => {
      // Given a spy on service function
      const service_spy = jest.spyOn(service, 'getAllByEntity');

      // When getting the circuits
      const circuits_found = await controller.getCircuits();

      // Then we should get entities mocked value,
      // and spied function should be called once
      expect(circuits_found).toEqual(entities);
      expect(service_spy).toBeCalledTimes(1);
    });
  });

  describe('getCircuit', () => {
    it('should return one circuit', async () => {
      // Given a spy on service function
      const service_spy = jest.spyOn(service, 'getOneByEntity');

      // When getting the circuit
      const circuit_found = await controller.getCircuit("an id");

      // Then we should get entities mocked value,
      // and spied function should be called once
      expect(circuit_found).toEqual(entity1);
      expect(service_spy).toBeCalledTimes(1);
    });

    it('should throw an error', async () => {
      // Given service function that fails
      jest.spyOn(service, 'getOneByEntity').mockResolvedValue(undefined);

      // When getting a circuit
      let error: any, circuit_found: any;
      try {
        circuit_found = await controller.getCircuit("an id");
      } catch (err) {
        error = err;
      }

      // Then it should raise an error and no circuit should be found
      expect(error).toBeDefined();
      expect(circuit_found).toBeUndefined();
    });
  });

  describe('deleteCircuit', () => {
    it('should delete one circuit', async () => {
      // Given a spy on service function
      const service_spy = jest.spyOn(service, 'deleteOne');

      // When deletting the circuit
      await controller.deleteCircuit("an id");

      // Then spied function should be called once
      expect(service_spy).toBeCalledTimes(1);
    });

    it('should throw an error', async () => {
      // Given service function that fails
      jest.spyOn(service, 'deleteOne').mockResolvedValue(false);

      // When getting a circuit
      let error: any, circuit_found: any;
      try {
        await controller.deleteCircuit("an id");
      } catch (err) {
        error = err;
      }

      // Then it should raise an error
      expect(error).toBeDefined();
    });
  });

  describe('searchCircuits', () => {
    it('should return found circuits', async () => {
      // Given a spy on service function
      const service_spy = jest.spyOn(service, 'findAndGetByEntity');

      // When searching through the circuits
      const circuits_found = await controller.searchCircuits("an expression");

      // Then we should get mocked value,
      // and spied function should be called once
      expect(circuits_found).toEqual(entities);
      expect(service_spy).toBeCalledTimes(1);
    });

    it('should throw an error when no circuits are uploaded', async () => {
      // Given service function that returns no circuits
      jest.spyOn(service, 'getAll').mockResolvedValue([]);

      // When searching through the circuits
      let error: any, circuits_found: any;
      try {
        circuits_found = await controller.searchCircuits("an expression");
      } catch (err) {
        error = err;
      }

      // Then it should raise an error
      expect(error).toBeDefined();
    });

    it('should throw an error when no circuits were found', async () => {
      // Given service function that returns no circuits
      jest.spyOn(service, 'findAndGetByEntity').mockResolvedValue([]);

      // When searching through the circuits
      let error: any, circuits_found: any;
      try {
        circuits_found = await controller.searchCircuits("an expression");
      } catch (err) {
        error = err;
      }

      // Then it should raise an error
      expect(error).toBeDefined();
    });
  });

  describe('renameCircuit', () => {
    it('should not raise an error', async () => {
      // Given a spy on service function
      const service_spy = jest.spyOn(service, 'renameOne');

      // When renaming a circuit
      let error: any;
      try {
        await controller.renameCircuit("an id", "new name");
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

      // When renaming a circuit
      let error: any;
      try {
        await controller.renameCircuit("an id", "new name");
      } catch (err) {
        error = err;
      }

      // Then it should raise an error
      expect(error).toBeDefined();
    });
  });


})