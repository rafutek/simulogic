import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { Circuit } from './circuit.entity';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuits_repository: Repository<Circuit>,
  ) { }

  async create(create_circuit_dto: CreateCircuitDto) {
    const circuit = new Circuit();
    circuit.name = create_circuit_dto.name
    circuit.path = create_circuit_dto.path;
    circuit.simulator_path = '';
    await this.circuits_repository.save(circuit);
  }

  async update(circuit: Circuit) {
    await this.circuits_repository.save(circuit);
  }

  findAll(): Promise<Circuit[]> {
    return this.circuits_repository.find({
      select: ["id", "name"] // return only the circuits ids and filenames
    });
  }

  findOne(id: string | number): Promise<Circuit> {
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
