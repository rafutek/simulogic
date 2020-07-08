import {
  Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile,
  BadRequestException, InternalServerErrorException, Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { Simulation } from './simulation.entity';
import * as fs from 'fs';
import { validate, isEmpty, isNotEmpty } from 'class-validator';
import { CircuitsService } from '../circuits/circuits.service';
import { execSync } from 'child_process';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorsService } from '../extractors/extractors.service';
import "multer";
import { GetSimulationDto } from './dto/get-simulation.dto';

@Controller('simulations')
export class SimulationsController {
  constructor(
    private readonly simulationsService: SimulationsService,
    private readonly circuitsService: CircuitsService,
    private readonly simulationExtractor: ExtractorsService
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
    } else throw new InternalServerErrorException("Error in circuit simulator creation");
  }

  executeAndSaveSimulation(circuit: Circuit, simulation: Simulation) {
    const circuit_filename = circuit.path.split('/').pop();
    const simulation_filename = simulation.path.split('/').pop();
    execSync(`cd simulator/common/scripts && ./simulate_save.sh user1 ${circuit_filename} ${simulation_filename}`);
    const resultPath = `simulator/home/user1/simulator/out/${simulation_filename}`;
    if (fs.existsSync(resultPath)) {
      simulation.result_path = resultPath;
      this.simulationsService.update(simulation); // save result simulation in database
    } else throw new InternalServerErrorException("Error in executing and saving simulation");
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
      if (simulation.result_path === '') {
        const circuit = await this.circuitsService.findOne(idCirc);
        if (circuit) {
          if (circuit.simulatorPath === '') {
            this.createAndSaveSimulator(circuit);
          }
          this.executeAndSaveSimulation(circuit, simulation);
        } else throw new BadRequestException(`circuit ${idCirc} not found`);

      }
      if (fs.existsSync(simulation.result_path)) {
        return this.simulationExtractor.getWaveDrom(idSimu, simulation.result_path);
      }
    } else throw new BadRequestException(`simulation ${idSimu} not found`);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const simulation = await this.simulationsService.findOne(id);
    if (simulation) {
      return this.simulationExtractor.getWaveDrom(id, simulation.path);
    }
  }

  @Get(':id/:from/:to')
  async findOneInterval(@Param() params) {
    const simulation = await this.simulationsService.findOne(params.id);
    if (simulation) {
      return this.simulationExtractor
        .getWaveDromInterval(params.id, simulation.path, params.from, params.to);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const simulation = await this.simulationsService.findOne(id);
    if (simulation) {
      if (simulation.result_path != '' && fs.existsSync(simulation.result_path)) {
        fs.unlinkSync(simulation.result_path);
      }
      if (fs.existsSync(simulation.path)) {
        fs.unlinkSync(simulation.path);
      }
    }
    return this.simulationsService.remove(id);
  }

  @Post('extract')
  async manageExtraction(@Body() getSimulationDto: GetSimulationDto) {
    const simulation = await this.simulationsService.findOne(getSimulationDto.id_simu);
    if (simulation) {
      if (fs.existsSync(simulation.path)) {
        // get simulation full wavedrom
      } else throw new InternalServerErrorException(
        `simulation ${getSimulationDto.id_simu} file not found`)

      if (getSimulationDto.result) {
        if (isEmpty(simulation.result_path)) {
          // execute simulation
        }
        if (fs.existsSync(simulation.result_path)) {
          // get result full wavedrom (extract if not already done) 
        } else throw new InternalServerErrorException(
          `result file of simulation ${getSimulationDto.id_simu} not found`)

        // combine and save full wavedrom with results (if not already done)
      }

      if (getSimulationDto.wires && getSimulationDto.wires.length > 0) {
        // remove wires from wavedrom
      }
      if (isNotEmpty(getSimulationDto.from) && isNotEmpty(getSimulationDto.to)) {
        // extract interval from wavedrom
      }
    } else throw new BadRequestException(`simulation ${getSimulationDto.id_simu} not found`);
  }

}