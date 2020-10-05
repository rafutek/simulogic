import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CircuitFile {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  simulator_path: string;

  constructor(name?: string, path?: string, simulator_path?: string) {
    this.name = name || '';
    this.path = path || '';
    this.simulator_path = simulator_path || '';
  }
}
