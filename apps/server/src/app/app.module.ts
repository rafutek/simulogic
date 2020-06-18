import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SimulationsModule } from './simulations/simulations.module';
import { CircuitsModule } from './circuits/circuits.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SimulationsModule,
    CircuitsModule
  ]
})
export class AppModule {}
