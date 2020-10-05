import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SimulationFile {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  path: string;

  result_path: string;

  constructor(name?: string, path?: string, result_path?: string) {
    this.name = name || '';
    this.path = path || '';
    this.result_path = result_path || '';
  }
}
