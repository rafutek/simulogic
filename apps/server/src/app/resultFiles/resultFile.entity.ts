import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFile } from '../simulationFiles/simulationFile.entity';

@Entity()
export class ResultFile {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  path: string;

  @OneToOne(type => CircuitFile)
  @JoinColumn()
  circuit_file: CircuitFile;

  @OneToOne(type => SimulationFile)
  @JoinColumn()
  simulation_file: SimulationFile;
}
