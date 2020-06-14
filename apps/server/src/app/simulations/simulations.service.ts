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
    simulation.resultPath = '';

    return this.simulationsRepository.save(simulation);
  }

  update(simulation: Simulation): Promise<Simulation> {
    return this.simulationsRepository.save(simulation);
  }

  async findAll(): Promise<Simulation[]> {
    return this.simulationsRepository.find({
      select: ["id", "name"] // return only the simulation ids and filenames
    });
  }

  findOne(id: string): Promise<Simulation> {
    return this.simulationsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.simulationsRepository.delete(id);
  }
}
