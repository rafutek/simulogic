import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CircuitDTO } from './circuit.dto';
import { Circuit } from './circuit.entity';

@Injectable()
export class CircuitsService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuits_repository: Repository<Circuit>,
  ) { }

  /**
   * Returns all the circuits present in the database.
   */
  getAll(): Promise<Circuit[]> {
    return this.circuits_repository.find();
  }

  /**
   * Returns all the circuits present in the database by id and name.
   */
  getAllByEntity(): Promise<Circuit[]> {
    return this.circuits_repository.find({ select: ["id", "name"] });
  }

  /**
   * Returns the circuit with given id present in the database.
   * @param id id of the circuit
   */
  getOne(id: string | number): Promise<Circuit> {
    return this.circuits_repository.findOne(id);
  }

  /**
   * Returns the circuit with given id present in the database by id and name.
   * @param id id of the circuit
   */
  getOneByEntity(id: string | number): Promise<Circuit> {
    return this.circuits_repository.findOne(id, { select: ["id", "name"] });
  }

  /**
   * Inserts a circuit in the database and returns it.
   * @param new_circuit valid circuit variable
   */
  async insertOne(new_circuit: CircuitDTO): Promise<Circuit> {
    const new_circuit_entity = this.circuits_repository.create(new_circuit);
    await this.circuits_repository.save(new_circuit_entity);
    return new_circuit_entity;
  }

  /**
   * Updates a circuit present in the database and returns it.
   * @param circuit database circuit to update
   */
  async updateOne(circuit: Circuit): Promise<Circuit> {
    const { id } = circuit;
    await this.circuits_repository.update({ id }, circuit);
    return this.getOne(id);
  }

  /**
   * Tries to delete a circuit from database and returns success or error with a message.
   * @param id id of circuit to delete
   */
  async deleteOne(id: string | number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.circuits_repository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  /**
   * Searches circuit names containing the given expression
   * and returns these circuits by id and name.
   * @param search_expr expression to search in circuit names
   */
  findAndGetByEntity(search_expr: string): Promise<Circuit[]> {
    return this.circuits_repository.find({
      where: { name: Like(search_expr) },
      select: ["id", "name"]
    })
  }

  /**
   * Renames a circuit with given new name, and returns it.
   * @param id id of circuit to rename
   * @param new_name new name of the circuit
   */
  async renameOne(id: string | number, new_name: string): Promise<Circuit> {
    const circuit = await this.circuits_repository.findOne(id);
    if (circuit) {
      circuit.name = new_name;
      await this.circuits_repository.update(id, circuit);
    }
    return this.circuits_repository.findOne(id);
  }
}
