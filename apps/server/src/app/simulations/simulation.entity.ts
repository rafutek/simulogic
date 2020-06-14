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
  resultPath: string;
}
