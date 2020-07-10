import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Circuit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  simulator_path: string;
}
