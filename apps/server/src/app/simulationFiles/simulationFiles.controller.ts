import {
  Controller, Post, Get, Delete, Param, UseInterceptors,
  BadRequestException, UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SimulationFilesService } from './simulationFiles.service';
import { SimulationFileDTO } from './simulationFile.dto';
import { SimulationFile } from './simulationFile.entity';
import { validate } from 'class-validator';
import { ResultFilesService } from '../resultFiles/resultFiles.service';
import * as fs from 'fs';
import "multer";

/**
 * Controller for simulation files.
 */
@Controller('simulations')
export class SimulationFilesController {

  /**
   * Injects SimulationFilesService and ResultFilesService dependencies.
   * @param simulations_service service used to manage simulation files
   * @param results_service service used to manage result files
   */
  constructor(
    private readonly simulations_service: SimulationFilesService,
    private readonly results_service: ResultFilesService
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
      if (fs.existsSync(simulation.path)) fs.unlinkSync(simulation.path);
      this.results_service.deleteBySimulation(simulation);

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
  
}