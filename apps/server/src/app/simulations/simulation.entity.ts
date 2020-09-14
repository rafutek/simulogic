import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Simulation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  result_path: string;

  constructor(name?: string, path?: string, result_path?: string) {
    this.name = name || '';
    this.path = path || '';
    this.result_path = result_path || '';
  }
}
