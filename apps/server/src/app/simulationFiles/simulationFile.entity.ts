import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SimulationFile {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  path: string;

  constructor(name?: string, path?: string) {
    this.name = name || '';
    this.path = path || '';
  }
}
