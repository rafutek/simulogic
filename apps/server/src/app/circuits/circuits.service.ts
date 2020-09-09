import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CircuitDTO } from './circuit.dto';
import { Circuit } from './circuit.entity';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuits_repository: Repository<Circuit>,
  ) { }

  /**
   * Creates a circuit in the database 
   * filling the filename and filepath fields
   * @param create_circuit_dto valid circuit variable
   */
  async insertOne(create_circuit_dto: CircuitDTO) {
    const new_circuit = this.circuits_repository.create(create_circuit_dto);
    // const circuit = new Circuit();
    // circuit.name = create_circuit_dto.name
    // circuit.path = create_circuit_dto.path;
    // circuit.simulator_path = '';
    await this.circuits_repository.save(new_circuit);
    return new_circuit;
  }

  async update(circuit: Circuit) {
    await this.circuits_repository.save(circuit);
  }

  findAll(): Promise<Circuit[]> {
    return this.circuits_repository.find({
      select: ["id", "name"] // return only the circuits ids and filenames
    });
  }

  getOne(id: string | number): Promise<Circuit> {
    return this.circuits_repository.findOne(id);
  }


  findEntity(id: string | number): Promise<Circuit> {
    return this.circuits_repository.findOne(id, {
      select: ["id", "name"]
    });
  }

  async remove(id: string | number): Promise<void> {
    await this.circuits_repository.delete(id);
  }

  searchNames(search_expr: string): Promise<Circuit[]> {
    return this.circuits_repository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }

  async rename(id: string | number, new_name: string) {
    const circuit = await this.circuits_repository.findOne(id);
    if (circuit) {
      circuit.name = new_name;
      await this.circuits_repository.save(circuit);
    }
  }
}
