import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Database table entity to save an uploaded circuit file.
 */
@Entity()
export class CircuitFile {

  /**
   * UUID of CircuitFile entity.
   */
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  /**
   * Name of circuit file.
   */
  @Column()
  name: string;

  /**
   * Path of circuit file.
   */
  @Column()
  path: string;

  /**
   * Path of circuit simulator.
   */
  @Column()
  simulator_path: string;

  /**
   * Creates a CircuitFile object.
   * @param name optional name of circuit file
   * @param path optional path of circuit file
   * @param simulator_path optional path of circuit file simulator
   */
  constructor(name?: string, path?: string, simulator_path?: string) {
    this.name = name || '';
    this.path = path || '';
    this.simulator_path = simulator_path || '';
  }
}
