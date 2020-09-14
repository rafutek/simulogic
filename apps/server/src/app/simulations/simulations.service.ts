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

  /**
   * Returns all the simulations present in the database.
   */
  async getAll(): Promise<Simulation[]> {
    return this.simulations_repository.find();
  }

  /**
   * Returns all the simulations present in the database by id and name.
   */
  async getAllByEntity(): Promise<Simulation[]> {
    return this.simulations_repository.find({ select: ["id", "name"] });
  }

  /**
   * Returns the simulation with given id present in the database.
   * @param id id of the simulation
   */
  getOne(id: string | number): Promise<Simulation> {
    return this.simulations_repository.findOne(id);
  }

  /**
   * Returns the simulation with given id present in the database by id and name.
   * @param id id of the simulation
   */
  getOneByEntity(id: string | number): Promise<Simulation> {
    return this.simulations_repository.findOne(id, { select: ["id", "name"] });
  }

  /**
 * Inserts a simulation in the database and returns it.
 * @param new_simulation valid simulation variable
 */
  async insertOne(new_simulation: SimulationDTO) {
    const new_simu_entity = this.simulations_repository.create(new_simulation);
    await this.simulations_repository.save(new_simu_entity);
    return new_simu_entity;
  }

  /**
   * Updates a simulation present in the database and returns it.
   * @param simulation database simulation to update
   */
  async updateOne(simulation: Simulation) {
    const { id } = simulation;
    await this.simulations_repository.update(id, simulation);
    return this.getOne(id);
  }

  /**
   * Deletes simulation in the database and returns false if it fails.
   * @param id id of simulation to delete
   */
  async deleteOne(id: string | number): Promise<boolean> {
    const delete_result = await this.simulations_repository.delete(id);
    return delete_result?.affected == 1;
  }

  /**
   * Searches simulation names containing the given expression
   *  and returns these simulations by id and name.
   *  @param search_expr expression to search in simulation names
   */
  findAndGetByEntity(search_expr: string): Promise<Simulation[]> {
    return this.simulations_repository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }

  /**
   * Renames a simulation with given new name.
   * Returns true if it was renamed, false otherwise. 
   * @param id id of simulation to rename
   * @param new_name new name of the simulation
   */
  async renameOne(id: string | number, new_name: string) {
    const simulation = await this.simulations_repository.findOne(id);
    if (simulation) {
      simulation.name = new_name;
      await this.simulations_repository.update(id, simulation);
      const renamed_simu = await this.simulations_repository.findOne(id);
      return renamed_simu?.name == new_name;
    }
    return false;
  }
}
