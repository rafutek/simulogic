import {
  Controller, Post, Get, Delete, Param, UseInterceptors,
  BadRequestException, InternalServerErrorException, Body,
  UploadedFiles, ForbiddenException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SimulationsService } from './simulations.service';
import { SimulationDTO } from './simulation.dto';
import { SimulationGetterDTO } from './simulation-getter.dto';
import { Simulation } from './simulation.entity';
import * as fs from 'fs';
import { isEmpty, isNotEmpty } from 'class-validator';
import { CircuitsService } from '../circuits/circuits.service';
import { execSync } from 'child_process';
import { Circuit } from '../circuits/circuit.entity';
import { ExtractorsService } from '../extractors/extractors.service';
import "multer";
import { WaveDrom } from '@simulogic/core';

@Controller('simulations')
export class SimulationsController {
  constructor(
    private readonly simulations_service: SimulationsService,
    private readonly circuits_service: CircuitsService,
    private readonly simulation_extractor: ExtractorsService
  ) { }

  @Post()
  @UseInterceptors(FilesInterceptor('file', 20, {
    dest: 'simulator/home/user1/simulator/data'
  }))
  async uploadSimulationFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const ext = ".simu";
    const ext_regexp = RegExp(`${ext}$`);
    let bad_extension = false;
    files.forEach(async file => {
      if (!file.originalname.match(ext_regexp)) {
        fs.unlinkSync(file.path);
        bad_extension = true;
      } else {
        const simulation = new SimulationDTO();
        simulation.name = file.originalname;
        simulation.path = file.path;
        await this.simulations_service.create(simulation);
      }
    })
    if (bad_extension) {
      throw new ForbiddenException(`Files without ${ext} extension were not uploaded`);
    }
  }

  @Get()
  findAll(): Promise<Simulation[]> {
    return this.simulations_service.findAll();
  }

  createAndSaveSimulator(circuit: Circuit) {
    const circuit_filename = circuit.path.split('/').pop();
    execSync(`cd simulator/common/scripts && ./create_simulator.sh user1 ${circuit_filename}`);
    const simulator_path = `simulator/home/user1/simulator/bin/${circuit_filename}`;
    if (fs.existsSync(simulator_path)) {
      circuit.simulator_path = simulator_path;
      this.circuits_service.update(circuit); // save circuit simulator in database
    } else throw new InternalServerErrorException("Error in circuit simulator creation");
  }

  executeAndSaveSimulation(circuit: Circuit, simulation: Simulation) {
    const circuit_filename = circuit.path.split('/').pop();
    const simulation_filename = simulation.path.split('/').pop();
    execSync(`cd simulator/common/scripts && ./simulate_save.sh user1 ${circuit_filename} ${simulation_filename}`);
    const result_path = `simulator/home/user1/simulator/out/${simulation_filename}`;
    if (fs.existsSync(result_path)) {
      simulation.result_path = result_path;
      this.simulations_service.update(simulation); // save result simulation in database
    } else throw new InternalServerErrorException("Error in executing and saving simulation");
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.simulations_service.findEntity(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const simulation = await this.simulations_service.findOne(id);
    if (simulation) {
      if (simulation.result_path != '' && fs.existsSync(simulation.result_path)) {
        fs.unlinkSync(simulation.result_path);
      }
      if (fs.existsSync(simulation.path)) {
        fs.unlinkSync(simulation.path);
      }
    }
    return this.simulations_service.remove(id);
  }

  @Post('extract')
  async getSimulation(@Body() getSimulationDto: SimulationGetterDTO) {
    let wavedrom: WaveDrom, input: WaveDrom, output: WaveDrom, final_wavedrom: any;
    const simulation = await this.simulations_service.findOne(getSimulationDto.id_simu);
    if (simulation) {
      if (fs.existsSync(simulation.path)) {
        wavedrom = input = this.simulation_extractor.getWaveDrom(getSimulationDto.id_simu,
          simulation.path);
        if (!wavedrom) {
          throw new InternalServerErrorException("could not get wavedrom");
        }
      } else throw new InternalServerErrorException(
        `simulation ${getSimulationDto.id_simu} file not found`);

      if (getSimulationDto.result) {
        // if (isEmpty(simulation.result_path)) { execute simulation each time
        const circuit = await this.circuits_service.getOne(getSimulationDto.id_circuit);
        if (circuit) {
          if (isEmpty(circuit.simulator_path)) {
            this.createAndSaveSimulator(circuit);
          }
          this.executeAndSaveSimulation(circuit, simulation);
        } else throw new BadRequestException(
          `circuit ${getSimulationDto.id_circuit} not found`);
        // }

        if (fs.existsSync(simulation.result_path)) {
          wavedrom = output = this.simulation_extractor.getWaveDromResult(
            getSimulationDto.id_simu, simulation.result_path);
          if (!wavedrom) {
            throw new InternalServerErrorException("could not get result wavedrom");
          }
        } else throw new InternalServerErrorException(
          `result file of simulation ${getSimulationDto.id_simu} not found`);

        wavedrom = this.simulation_extractor.getCombinedWaveDrom(getSimulationDto.id_simu,
          simulation.path, simulation.result_path);
      }

      if (getSimulationDto.wires && getSimulationDto.wires.length > 0) {
        wavedrom = this.simulation_extractor.selectWires(wavedrom, getSimulationDto.wires);
      }

      if (isNotEmpty(getSimulationDto.interval?.start) || isNotEmpty(getSimulationDto.interval?.end)) {
        wavedrom = this.simulation_extractor.extractWaveDromInterval(wavedrom,
          getSimulationDto.interval);
      }

      final_wavedrom = this.simulation_extractor.organizeIntoGroups(wavedrom, input, output);
      this.simulation_extractor.setExtractionSent(final_wavedrom);

    } else throw new BadRequestException(`simulation ${getSimulationDto.id_simu} not found`);

    return final_wavedrom;
  }

  /**
 * Returns the simulations which name contains the expression.
 */
  @Get('search/:expr')
  searchSimulations(@Param('expr') expr: string) {
    return this.simulations_service.searchNames('%' + expr + '%');
  }

  /**
 * Renames a simulation if it exists. Throws an error otherwise.
 * @param params Object containing the request id and new name.
 */
  @Get(':id/rename/:new_name')
  async rename(@Param() params: any) {
    await this.simulations_service.rename(params.id, params.new_name);
  }

  /**
   * Returns the wires of the last extracted and sent wavedrom.
   */
  @Get('extract/wires')
  getWires() {
    return this.simulation_extractor.getExtractionSentWires();
  }

  /**
 * Returns the wires of the last extracted and sent wavedrom
 * which names contain the expression.
 */
  @Get('extract/wires/:expr')
  getSpecialWires(@Param('expr') expr: string) {
    const signal_groups = this.simulation_extractor.getExtractionSentWires();
    return this.simulation_extractor.searchWires(signal_groups, expr);
  }

  /**
* Returns the interval of the actual simulation,
* so its beginning and end time.
*/
  @Get('extract/interval')
  getInterval() {
    return this.simulation_extractor.getSimulationInterval();
  }
}