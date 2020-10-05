import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SimulationFileDTO } from './simulationFile.dto';
import { SimulationFile } from './simulationFile.entity';

@Injectable()
export class SimulationFilesService {
  constructor(
    @InjectRepository(SimulationFile)
    private readonly simulations_repository: Repository<SimulationFile>,
  ) { }

  /**
   * Returns all the simulations present in the database.
   */
  async getAll(): Promise<SimulationFile[]> {
    return this.simulations_repository.find();
  }

  /**
   * Returns all the simulations present in the database by uuid and name.
   */
  async getAllByEntity(): Promise<SimulationFile[]> {
    return this.simulations_repository.find({ select: ["uuid", "name"] });
  }

  /**
   * Returns the simulation with given uuid present in the database.
   * @param uuid uuid of the simulation
   */
  getOne(uuid: string): Promise<SimulationFile> {
    return this.simulations_repository.findOne(uuid);
  }

  /**
   * Returns the simulation with given uuid present in the database by uuid and name.
   * @param uuid uuid of the simulation
   */
  getOneByEntity(uuid: string): Promise<SimulationFile> {
    return this.simulations_repository.findOne(uuid, { select: ["uuid", "name"] });
  }

  /**
 * Inserts a simulation in the database and returns it.
 * @param new_simulation valid simulation variable
 */
  async insertOne(new_simulation: SimulationFileDTO): Promise<SimulationFile> {
    const new_simu_entity = this.simulations_repository.create(new_simulation);
    await this.simulations_repository.save(new_simu_entity);
    return new_simu_entity;
  }

  /**
   * Updates a simulation present in the database and returns it.
   * @param simulation database simulation to update
   */
  async updateOne(simulation: SimulationFile): Promise<SimulationFile> {
    const { uuid: uuid } = simulation;
    await this.simulations_repository.update(uuid, simulation);
    return this.getOne(uuid);
  }

  /**
   * Deletes simulation in the database and returns false if it fails.
   * @param uuid uuid of simulation to delete
   */
  async deleteOne(uuid: string): Promise<boolean> {
    const delete_result = await this.simulations_repository.delete(uuid);
    return delete_result?.affected == 1;
  }

  /**
   * Searches simulation names containing the given expression
   *  and returns these simulations by uuid and name.
   *  @param search_expr expression to search in simulation names
   */
  findAndGetByEntity(search_expr: string): Promise<SimulationFile[]> {
    return this.simulations_repository.find({
      where: { name: Like(search_expr) },
      select: ["uuid", "name"]
    })
  }

  /**
   * Renames a simulation with given new name.
   * Returns true if it was renamed, false otherwise. 
   * @param uuid uuid of simulation to rename
   * @param new_name new name of the simulation
   */
  async renameOne(uuid: string, new_name: string): Promise<boolean> {
    const simulation = await this.simulations_repository.findOne(uuid);
    if (simulation) {
      simulation.name = new_name;
      await this.simulations_repository.update(uuid, simulation);
      const renamed_simu = await this.simulations_repository.findOne(uuid);
      return renamed_simu?.name == new_name;
    }
    return false;
  }
}
