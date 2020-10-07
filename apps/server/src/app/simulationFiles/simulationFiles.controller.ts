import {
  Controller, Post, Get, Delete, Param, UseInterceptors,
  BadRequestException, InternalServerErrorException, Body,
  UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SimulationFilesService } from './simulationFiles.service';
import { SimulationFileDTO } from './simulationFile.dto';
import { SimulatorDTO } from '../simulator/simulator.dto';
import { SimulationFile } from './simulationFile.entity';
import * as fs from 'fs';
import { isEmpty, isNotEmpty, validate } from 'class-validator';
import { CircuitFilesService } from '../circuitFiles/circuitFiles.service';
import { execSync } from 'child_process';
import { CircuitFile } from '../circuitFiles/circuitFile.entity';
import { SimulationFileParserService } from '../simulationFileParser/simulationFileParser.service';
import "multer";
import { WaveDrom } from '@simulogic/core';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Controller('simulations')
export class SimulationFilesController {
  constructor(
    private readonly simulations_service: SimulationFilesService,
    private readonly circuits_service: CircuitFilesService,
    private readonly simulation_extractor: SimulationFileParserService,
    private readonly manipulator_service: ManipulatorService,
  ) { }

  /**
   * Uploads and saves simulation files in database. Returns invalid files not uploaded.
   * @param files uploaded files
   */
  @Post()
  @UseInterceptors(FilesInterceptor('file', 20, { dest: 'simulator/home/user1/simulator/data' }))
  async uploadSimulations(@UploadedFiles() files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    const invalid_files: Express.Multer.File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const simulationDTO = new SimulationFileDTO();
      simulationDTO.name = file.originalname;
      simulationDTO.path = file.path;
      const errors = await validate(simulationDTO);
      if (errors.length > 0) {
        invalid_files.push(file);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      else await this.simulations_service.insertOne(simulationDTO);

    }
    return invalid_files;
  }

  /**
   * Returns the simulations present in the database by id and name.
   */
  @Get()
  getSimulations(): Promise<SimulationFile[]> {
    return this.simulations_service.getAllByEntity();
  }

  /**
   * Returns the simulation corresponding to given id.
   * @param id id of the simulation
   */
  @Get(':id')
  async getSimulation(@Param('id') id: string) {
    const simulation = await this.simulations_service.getOneByEntity(id);
    if (!simulation) {
      throw new BadRequestException(`Simulation with id '${id}' not found`);
    }
    return simulation;
  }

  /**
   * Deletes a simulation present in the database and its associated files.
   * @param id id of the simulation to delete
   */
  @Delete(':id')
  async deleteSimulation(@Param('id') id: string): Promise<void> {
    const simulation = await this.simulations_service.getOne(id);
    if (simulation) {
      if (simulation.result_path != '' && fs.existsSync(simulation.result_path)) {
        fs.unlinkSync(simulation.result_path);
      }
      if (fs.existsSync(simulation.path)) {
        fs.unlinkSync(simulation.path);
      }
    }
    const deleted = await this.simulations_service.deleteOne(id);
    if (!deleted) {
      throw new BadRequestException(`Could not delete simulation with id '${id}'`);
    }
  }

  /**
   * Returns the simulations which name contains the expression.
   * @param exp expression to search in simulation filenames
   */
  @Get('search/:exp')
  async searchSimulations(@Param('exp') exp: string) {
    const all_simulations = await this.simulations_service.getAll();
    if (all_simulations?.length == 0) {
      throw new BadRequestException(`There are no uploaded simulations to search for`);
    }
    const found_simulations = await this.simulations_service.findAndGetByEntity('%' + exp + '%');
    if (found_simulations?.length == 0) {
      throw new BadRequestException(`No simulations were found containing the expression '${exp}'`);
    }
    return found_simulations;
  }

  /**
  * Renames a simulation if it exists. Throws an error otherwise.
  * @param params Object containing the request id and new name.
  */
  @Get(':id/rename/:new_name')
  async renameSimulation(@Param('id') id: string, @Param('new_name') new_name: string): Promise<void> {
    const renamed = await this.simulations_service.renameOne(id, new_name);
    if (!renamed) {
      throw new BadRequestException(`Could not rename simulation of id '${id}' with new name '${new_name}'`);
    }
  }


  createAndSaveSimulator(circuit: CircuitFile) {
    const circuit_filename = circuit.path.split('/').pop();
    // const circuit_filepath = `../../../home/user1/circuitCreator/data/${circuit_filename}`;
    // const simulator_path = `../../../home/user1/simulator/bin/${circuit_filename}`;
    execSync(`cd simulator/common/scripts && ./create_simulator.sh user1 ${circuit_filename}`);
    const simulator_path = `simulator/home/user1/simulator/bin/${circuit_filename}`;
    if (fs.existsSync(simulator_path)) {
      circuit.simulator_path = simulator_path;
      this.circuits_service.updateOne(circuit); // save circuit simulator in database
    } else throw new InternalServerErrorException("Error in circuit simulator creation");
  }

  executeAndSaveSimulation(circuit: CircuitFile, simulation: SimulationFile) {
    const circuit_filename = circuit.path.split('/').pop();
    const simulation_filename = simulation.path.split('/').pop();
    execSync(`cd simulator/common/scripts && ./simulate_save.sh user1 ${circuit_filename} ${simulation_filename}`);
    const result_path = `simulator/home/user1/simulator/out/${simulation_filename}`;
    if (fs.existsSync(result_path)) {
      simulation.result_path = result_path;
      this.simulations_service.updateOne(simulation); // save result simulation in database
    } else throw new InternalServerErrorException("Error in executing and saving simulation");
  }

  @Post('extract')
  async getExtractedSimulation(@Body() getSimulationDto: SimulatorDTO) {
    let wavedrom: WaveDrom, input: WaveDrom, output: WaveDrom, final_wavedrom: any;
    const simulation = await this.simulations_service.getOne(getSimulationDto.uuid_simu);
    if (simulation) {
      if (fs.existsSync(simulation.path)) {
        wavedrom = input = await this.simulation_extractor.getWaveDrom(getSimulationDto.uuid_simu, simulation.path);
        if (!wavedrom) {
          throw new InternalServerErrorException("could not get wavedrom");
        }
      } else throw new InternalServerErrorException(
        `simulation ${getSimulationDto.uuid_simu} file not found`);

      if (getSimulationDto.result) {
        // if (isEmpty(simulation.result_path)) { execute simulation each time
        const circuit = await this.circuits_service.getOne(getSimulationDto.uuid_circuit);
        if (circuit) {
          if (isEmpty(circuit.simulator_path)) {
            this.createAndSaveSimulator(circuit);
          }
          this.executeAndSaveSimulation(circuit, simulation);
        } else throw new BadRequestException(
          `circuit ${getSimulationDto.uuid_circuit} not found`);
        // }

        if (fs.existsSync(simulation.result_path)) {
          wavedrom = output = await this.simulation_extractor.getWaveDromResult(
            getSimulationDto.uuid_simu, simulation.result_path);
          if (!wavedrom) {
            throw new InternalServerErrorException("could not get result wavedrom");
          }
        } else throw new InternalServerErrorException(
          `result file of simulation ${getSimulationDto.uuid_simu} not found`);

        wavedrom = await this.simulation_extractor.getCombinedWaveDrom(getSimulationDto.uuid_simu,
          simulation.path, simulation.result_path);
      }

      if (getSimulationDto.wires && getSimulationDto.wires.length > 0) {
        wavedrom = this.manipulator_service.selectSignals(wavedrom, getSimulationDto.wires);
      }

      if (isNotEmpty(getSimulationDto.interval?.start) || isNotEmpty(getSimulationDto.interval?.end)) {
        wavedrom = this.manipulator_service.cutWaveDrom(wavedrom, getSimulationDto.interval);
      }

      final_wavedrom = this.manipulator_service.groupInputOutput(wavedrom, input, output);

    } else throw new BadRequestException(`simulation ${getSimulationDto.uuid_simu} not found`);

    return this.manipulator_service.setFinalWaveDrom(final_wavedrom);
  }

  /**
   * Returns the wires of the last extracted and sent wavedrom.
   */
  @Get('extract/wires')
  getWires() {
    return this.manipulator_service.getFinalWaveDromSignals();
  }

  /**
 * Returns the wires of the last extracted and sent wavedrom
 * which names contain the expression.
 */
  @Get('extract/wires/:expr')
  getSpecialWires(@Param('expr') expr: string) {
    const signal_groups = this.manipulator_service.getFinalWaveDromSignals();
    return this.manipulator_service.searchSignals(signal_groups, expr);
  }

  /**
* Returns the interval of the actual simulation,
* so its beginning and end time.
*/
  @Get('extract/interval')
  getSimulationLimits() {
    return this.manipulator_service.getLastSimulationLimits();
  }
}