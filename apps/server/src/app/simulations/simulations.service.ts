import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SimulationDTO } from './simulation.dto';
import { Simulation } from './simulation.entity';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectRepository(Simulation)
    private readonly simulations_repository: Repository<Simulation>,
  ) { }

  async create(create_simulation_dto: SimulationDTO) {
    const simulation = new Simulation();
    simulation.name = create_simulation_dto.name
    simulation.path = create_simulation_dto.path;
    simulation.result_path = '';
    await this.simulations_repository.save(simulation);
  }

  async update(simulation: Simulation) {
    await this.simulations_repository.save(simulation);
  }

  async findAll(): Promise<Simulation[]> {
    return this.simulations_repository.find({
      select: ["id", "name"] // return only the simulations ids and filenames
    });
  }

  findEntity(id: string | number): Promise<Simulation> {
    return this.simulations_repository.findOne(id, {
      select: ["id", "name"]
    });
  }

  findOne(id: string | number): Promise<Simulation> {
    return this.simulations_repository.findOne(id);
  }

  async remove(id: string | number): Promise<void> {
    await this.simulations_repository.delete(id);
  }

  searchNames(search_expr: string): Promise<Simulation[]> {
    return this.simulations_repository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }

  async rename(id: string | number, new_name: string) {
    const simulation = await this.simulations_repository.findOne(id);
    if(simulation){
      simulation.name = new_name;
      await this.simulations_repository.save(simulation);
    }
  }
}
