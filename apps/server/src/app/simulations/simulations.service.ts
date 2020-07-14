import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { Simulation } from './simulation.entity';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectRepository(Simulation)
    private readonly simulationsRepository: Repository<Simulation>,
  ) { }

  async create(createSimulationDto: CreateSimulationDto) {
    const simulation = new Simulation();
    simulation.name = createSimulationDto.name
    simulation.path = createSimulationDto.path;
    simulation.result_path = '';
    await this.simulationsRepository.save(simulation);
  }

  async update(simulation: Simulation) {
    await this.simulationsRepository.save(simulation);
  }

  async findAll(): Promise<Simulation[]> {
    return this.simulationsRepository.find({
      select: ["id", "name"] // return only the simulations ids and filenames
    });
  }

  findEntity(id: string | number): Promise<Simulation> {
    return this.simulationsRepository.findOne(id, {
      select: ["id", "name"]
    });
  }

  findOne(id: string | number): Promise<Simulation> {
    return this.simulationsRepository.findOne(id);
  }

  async remove(id: string | number): Promise<void> {
    await this.simulationsRepository.delete(id);
  }

  searchNames(search_expr: string): Promise<Simulation[]> {
    return this.simulationsRepository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }

  async rename(id: string | number, new_name: string) {
    const simulation = await this.simulationsRepository.findOne(id);
    if(simulation){
      simulation.name = new_name;
      await this.simulationsRepository.save(simulation);
    }
  }
}
