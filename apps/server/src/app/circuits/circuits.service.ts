import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { Circuit } from './circuit.entity';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuitsRepository: Repository<Circuit>,
  ) { }

  create(createCircuitDto: CreateCircuitDto): Promise<Circuit> {
    const circuit = new Circuit();
    circuit.name = createCircuitDto.name
    circuit.path = createCircuitDto.path;
    circuit.simulator_path = '';

    return this.circuitsRepository.save(circuit);
  }

  update(circuit: Circuit): Promise<Circuit> {
    return this.circuitsRepository.save(circuit);
  }

  findAll(): Promise<Circuit[]> {
    return this.circuitsRepository.find({
      select: ["id", "name"] // return only the circuits ids and filenames
    });
  }

  findOne(id: string | number): Promise<Circuit> {
    return this.circuitsRepository.findOne(id);
  }


  findEntity(id: string | number): Promise<Circuit> {
    return this.circuitsRepository.findOne(id, {
      select: ["id", "name"]
    });
  }

  async remove(id: string | number): Promise<void> {
    await this.circuitsRepository.delete(id);
  }

  searchNames(search_expr: string): Promise<Circuit[]> {
    return this.circuitsRepository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }
}
