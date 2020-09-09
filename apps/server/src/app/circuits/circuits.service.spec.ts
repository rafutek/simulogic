import { Test, TestingModule } from '@nestjs/testing';
import { CircuitsService } from "./circuits.service"
import { Repository } from 'typeorm';
import { Circuit } from './circuit.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CircuitDTO } from './circuit.dto';

const circuit_test = new Circuit("circuit test", "/path/test", "sim/path/test");


describe("CircuitService", () => {
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
            findOne: jest.fn().mockResolvedValue(circuit_test),
            create: jest.fn().mockReturnValue(circuit_test),
            save: jest.fn(),
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

  describe('getOne', () => {
    it('should return one circuit', async () => {
      // Spy the findOne repo function
      const repo_spy = jest.spyOn(repo, 'findOne');
      // Call the function to test
      const circuit = await service.getOne(2);
      // Check result equals mocked value
      expect(circuit).toEqual(circuit_test);
      // Check repo function has been called
      expect(repo_spy).toBeCalledWith(2);
    });
  });

  describe('insertOne', () => {
    it('should insert one circuit', async () => {
      // Given a circuit DTO, and spies on repo functions
      const circuit_test_dto = new CircuitDTO();
      circuit_test_dto.name = "circuit name";
      circuit_test_dto.path = "circuit path";
      const repo_create_spy = jest.spyOn(repo, 'create');
      const repo_save_spy = jest.spyOn(repo, 'save');

      // When inserting the circuit
      const new_circuit = await service.insertOne(circuit_test_dto);

      // Then inserted value must be the mocked one,
      // create repo function must be called once with given DTO,
      // and 
      expect(new_circuit).toEqual(circuit_test);
      expect(repo_create_spy).toBeCalledTimes(1);
      expect(repo_create_spy).toBeCalledWith(circuit_test_dto);
      expect(repo_save_spy).toBeCalledTimes(1);
    });
  });

})