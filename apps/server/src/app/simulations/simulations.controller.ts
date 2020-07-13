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
import { WaveDrom } from '@simulogic/core';

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
    execSync(`cd simulator/common/scripts && ./create_simulator.sh user1 ${circuit_filename}`);
    const simulatorPath = `simulator/home/user1/simulator/bin/${circuit_filename}`;
    if (fs.existsSync(simulatorPath)) {
      circuit.simulator_path = simulatorPath;
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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.simulationsService.findOne(id);
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
    let wavedrom: WaveDrom;
    const simulation = await this.simulationsService.findOne(getSimulationDto.id_simu);
    if (simulation) {
      if (fs.existsSync(simulation.path)) {
        wavedrom = this.simulationExtractor.getWaveDrom(getSimulationDto.id_simu, simulation.path);
      } else throw new InternalServerErrorException(
        `simulation ${getSimulationDto.id_simu} file not found`);

      if (getSimulationDto.result) {
        if (isEmpty(simulation.result_path)) {
          const circuit = await this.circuitsService.findOne(getSimulationDto.id_circuit);
          if (circuit) {
            if (isEmpty(circuit.simulator_path)) {
              this.createAndSaveSimulator(circuit);
            }
            this.executeAndSaveSimulation(circuit, simulation);
          } else throw new BadRequestException(
            `circuit ${getSimulationDto.id_circuit} not found`);
        }

        if (fs.existsSync(simulation.result_path)) {
          wavedrom = this.simulationExtractor.getWaveDromResult(
            getSimulationDto.id_simu, simulation.result_path);
        } else throw new InternalServerErrorException(
          `result file of simulation ${getSimulationDto.id_simu} not found`);

        wavedrom = this.simulationExtractor.getCombinedWaveDrom(getSimulationDto.id_simu,
          simulation.path, simulation.result_path);
      }

      if (getSimulationDto.wires && getSimulationDto.wires.length > 0) {
        // remove wires from wavedrom
      }

      if (isNotEmpty(getSimulationDto.from) && isNotEmpty(getSimulationDto.to)) {
        // extract interval from wavedrom
      }
    } else throw new BadRequestException(`simulation ${getSimulationDto.id_simu} not found`);

    return wavedrom;
  }

}