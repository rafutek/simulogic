import {
  Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile,
  BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { Simulation } from './simulation.entity';
import * as fs from 'fs';
import { validate } from 'class-validator';
import { CircuitsService } from '../circuits/circuits.service';
import { execSync } from 'child_process';
import { Circuit } from '../circuits/circuit.entity';
import { SimulationExtractor } from '../extractors/simulationExtractor';
import "multer";

@Controller('simulations')
export class SimulationsController {
  constructor(
    private readonly simulationsService: SimulationsService,
    private readonly circuitsService: CircuitsService,
    private readonly simulationExtractor: SimulationExtractor
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    dest: 'simulator/home/user1/simulator/data'
  }))
  async create(@UploadedFile() file: Express.Multer.File): Promise<Simulation> {
    const createSimulationDto = new CreateSimulationDto();
    createSimulationDto.name = file?.originalname;
    createSimulationDto.path = file?.path;
    const errors = await validate(createSimulationDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return this.simulationsService.create(createSimulationDto);
  }

  @Get()
  findAll(): Promise<Simulation[]> {
    return this.simulationsService.findAll();
  }

  createAndSaveSimulator(circuit: Circuit) {
    const circuit_filename = circuit.path.split('/').pop();
    // exec(`cd simulator/common/scripts && ./create_simulator.sh user1 ${circuit_filename}`, (err, out, std) => { // for testing
    //   console.log(err);
    //   console.log(out);
    //   console.log(std);
    // });
    execSync(`cd simulator/common/scripts && ./create_simulator.sh user1 ${circuit_filename}`);
    const simulatorPath = `simulator/home/user1/simulator/bin/${circuit_filename}`;
    if (fs.existsSync(simulatorPath)) {
      circuit.simulatorPath = simulatorPath;
      this.circuitsService.update(circuit); // save circuit simulator in database
    } else {
      new InternalServerErrorException("Error in circuit simulator creation");
    }
  }

  executeAndSaveSimulation(circuit: Circuit, simulation: Simulation) {
    const circuit_filename = circuit.path.split('/').pop();
    const simulation_filename = simulation.path.split('/').pop();
    execSync(`cd simulator/common/scripts && ./simulate_save.sh user1 ${circuit_filename} ${simulation_filename}`);
    const resultPath = `simulator/home/user1/simulator/out/${simulation_filename}`;
    if (fs.existsSync(resultPath)) {
      simulation.resultPath = resultPath;
      this.simulationsService.update(simulation); // save result simulation in database
    } else {
      new InternalServerErrorException("Error in executing and saving simulation");
    }
  }

  /**
   * Manage request for returning a simulation result.
   * If the simulation is not done, it launches the circuit simulator and save the result.
   * If the circuit simulator is not created, it creates and save it.
   * @param idCirc id of circuit in the database
   * @param idSimu id of simulation in the database
   */
  @Get(':idCirc/:idSimu')
  async getResult(@Param('idCirc') idCirc: string, @Param('idSimu') idSimu: string) {
    const simulation = await this.simulationsService.findOne(idSimu);
    if (simulation) {
      if (simulation.resultPath === '') {
        const circuit = await this.circuitsService.findOne(idCirc);
        if (circuit) {
          if (circuit.simulatorPath === '') {
            this.createAndSaveSimulator(circuit);
          }
          this.executeAndSaveSimulation(circuit, simulation);
        } else {
          new BadRequestException(`circuit ${idCirc} not found`);
        }
      }
      if (fs.existsSync(simulation.resultPath)) {
        return this.simulationExtractor.extractFile(simulation.resultPath);
      }
    } else {
      new BadRequestException(`simulation ${idSimu} not found`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const simulation = await this.simulationsService.findOne(id);
    if (simulation) {
      return this.simulationExtractor.extractFile(simulation.path);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const simulation = await this.simulationsService.findOne(id);
    if (simulation) {
      if (simulation.resultPath != '' && fs.existsSync(simulation.resultPath)) {
        fs.unlinkSync(simulation.resultPath);
      }
      if (fs.existsSync(simulation.path)) {
        fs.unlinkSync(simulation.path);
      }
    }
    return this.simulationsService.remove(id);
  }
}