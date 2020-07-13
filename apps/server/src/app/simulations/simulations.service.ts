import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { Simulation } from './simulation.entity';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectRepository(Simulation)
    private readonly simulationsRepository: Repository<Simulation>,
  ) { }

  create(createSimulationDto: CreateSimulationDto): Promise<Simulation> {
    const simulation = new Simulation();
    simulation.name = createSimulationDto.name
    simulation.path = createSimulationDto.path;
    simulation.result_path = '';

    return this.simulationsRepository.save(simulation);
  }

  update(simulation: Simulation): Promise<Simulation> {
    return this.simulationsRepository.save(simulation);
  }

  async findAll(): Promise<Simulation[]> {
    return this.simulationsRepository.find({
      select: ["id", "name"] // return only the simulations ids and filenames
    });
  }

  findOne(id: string | number): Promise<Simulation> {
    return this.simulationsRepository.findOne(id, {
      select: ["id", "name"]
    });
  }

  async remove(id: string | number): Promise<void> {
    await this.simulationsRepository.delete(id);
  }
}
