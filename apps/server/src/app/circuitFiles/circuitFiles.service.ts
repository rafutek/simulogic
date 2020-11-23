import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CircuitFileDTO } from './circuitFile.dto';
import { CircuitFile } from './circuitFile.entity';

/**
 * Service to manage circuit files.
 */
@Injectable()
export class CircuitFilesService {

  /**
   * Injects CircuitFile Repository dependency.
   * @param circuits_repository database table of CircuitFiles
   */
  constructor(
    @InjectRepository(CircuitFile)
    private readonly circuits_repository: Repository<CircuitFile>,
  ) { }

  /**
   * Returns all the circuits present in the database.
   */
  getAll(): Promise<CircuitFile[]> {
    return this.circuits_repository.find();
  }

  /**
   * Returns all the circuits present in the database by uuid and name.
   */
  getAllByEntity(): Promise<CircuitFile[]> {
    return this.circuits_repository.find({ select: ["uuid", "name"] });
  }

  /**
   * Returns the circuit with given uuid present in the database.
   * @param uuid uuid of the circuit
   */
  getOne(uuid: string): Promise<CircuitFile> {
    return this.circuits_repository.findOne(uuid);
  }

  /**
   * Returns the circuit with given uuid present in the database by uuid and name.
   * @param uuid uuid of the circuit
   */
  getOneByEntity(uuid: string): Promise<CircuitFile> {
    return this.circuits_repository.findOne(uuid, { select: ["uuid", "name"] });
  }

  /**
   * Inserts a circuit in the database and returns it.
   * @param new_circuit valid circuit variable
   */
  async insertOne(new_circuit: CircuitFileDTO): Promise<CircuitFile> {
    const new_circuit_entity = this.circuits_repository.create(new_circuit);
    await this.circuits_repository.save(new_circuit_entity);
    return new_circuit_entity;
  }

  /**
   * Updates a circuit present in the database and returns it.
   * @param circuit database circuit to update
   */
  async updateOne(circuit: CircuitFile): Promise<CircuitFile> {
    const { uuid: uuid } = circuit;
    await this.circuits_repository.update(uuid, circuit);
    return this.getOne(uuid);
  }

  /**
   * Deletes circuit in the database and returns false if it fails.
   * @param uuid uuid of circuit to delete
   */
  async deleteOne(uuid: string): Promise<boolean> {
    const delete_result = await this.circuits_repository.delete(uuid);
    return delete_result?.affected == 1;
  }

  /**
   * Searches circuit names containing the given expression
   * and returns these circuits by uuid and name.
   * @param search_expr expression to search in circuit names
   */
  findAndGetByEntity(search_expr: string): Promise<CircuitFile[]> {
    return this.circuits_repository.find({
      where: { name: Like(search_expr) },
      select: ["uuid", "name"]
    })
  }

  /**
   * Renames a circuit with given new name.
   * Returns true if it was renamed, false otherwise. 
   * @param uuid uuid of circuit to rename
   * @param new_name new name of the circuit
   */
  async renameOne(uuid: string, new_name: string): Promise<boolean> {
    const circuit = await this.circuits_repository.findOne(uuid);
    if (circuit) {
      circuit.name = new_name;
      await this.circuits_repository.update(uuid, circuit);
      const renamed_circuit = await this.circuits_repository.findOne(uuid);
      return renamed_circuit?.name == new_name;
    }
    return false;
  }
}
