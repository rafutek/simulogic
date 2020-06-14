import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { Circuit } from './circuit.entity';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuitsRepository: Repository<Circuit>,
  ) {}

  create(createCircuitDto: CreateCircuitDto): Promise<Circuit> {
    const circuit = new Circuit();
    circuit.name = createCircuitDto.name
    circuit.path = createCircuitDto.path;
    circuit.simulatorPath = '';
    
    return this.circuitsRepository.save(circuit);
  }

  update(circuit: Circuit): Promise<Circuit> {
    return this.circuitsRepository.save(circuit);
  }

  async findAll(): Promise<Circuit[]> {
    return this.circuitsRepository.find({
      select: ["id", "name"] // return only the circuit ids and filenames
    });
  }

  findOne(id: string): Promise<Circuit> {
    return this.circuitsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.circuitsRepository.delete(id);
  }
}
