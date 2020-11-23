import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Database table entity to save an uploaded simulation file.
 */
@Entity()
export class SimulationFile {

  /**
   * UUID of SimulationFile entity.
   */
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  /**
   * Name of simulation file.
   */
  @Column()
  name: string;

  /**
   * Path of simulation file.
   */
  @Column()
  path: string;

  /**
   * Creates a SimulationFile object.
   * @param name optional name of simulation file
   * @param path optional path of simulation file
   */
  constructor(name?: string, path?: string) {
    this.name = name || '';
    this.path = path || '';
  }
}
