import {
  Controller, Post, UseInterceptors, Get, Param, Delete,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CircuitsService } from './circuits.service';
import { CircuitDTO } from './circuit.dto';
import { Circuit } from './circuit.entity';
import * as fs from 'fs';
import "multer";
import { validate } from 'class-validator';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuits_service: CircuitsService) { }

  /**
   * Uploads and saves files in database. Returns invalid files not uploaded.
   * @param files uploaded files
   */
  @Post()
  @UseInterceptors(FilesInterceptor('file', 20, { dest: 'simulator/home/user1/circuitCreator/data' }))
  async uploadCircuits(@UploadedFiles() files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    const invalid_files: Express.Multer.File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const circuitDTO = new CircuitDTO();
      circuitDTO.name = file.originalname;
      circuitDTO.path = file.path;
      const errors = await validate(circuitDTO);
      if (errors.length > 0) {
        invalid_files.push(file);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      else await this.circuits_service.insertOne(circuitDTO);
    }
    return invalid_files;
  }

  /**
   * Returns the circuits present in the database by id and name.
   */
  @Get()
  getCircuits(): Promise<Circuit[]> {
    return this.circuits_service.getAllByEntity();
  }

  /**
   * Returns the circuit corresponding to given id.
   * @param id id of the circuit
   */
  @Get(':id')
  async getCircuit(@Param('id') id: string): Promise<Circuit> {
    const circuit = await this.circuits_service.getOneByEntity(id);
    if (!circuit) {
      throw new BadRequestException(`Circuit with id '${id}' not found`);
    }
    return circuit;
  }

  /**
   * Deletes a circuit present in the database and its associated files.
   * @param id id of circuit to delete
   */
  @Delete(':id')
  async deleteCircuit(@Param('id') id: string): Promise<void> {
    const circuit = await this.circuits_service.getOne(id);
    if (circuit) {
      if (circuit.simulator_path != '' && fs.existsSync(circuit.simulator_path)) {
        fs.unlinkSync(circuit.simulator_path);
      }
      if (fs.existsSync(circuit.path)) {
        fs.unlinkSync(circuit.path);
      }
    }
    const deleted = await this.circuits_service.deleteOne(id);
    if (!deleted) {
      throw new BadRequestException(`Could not delete circuit with id '${id}'`);
    }
  }

  /**
   * Returns the circuits which name contains the expression.
   * @param exp expression to search in circuit names
   */
  @Get('search/:exp')
  async searchCircuits(@Param('exp') exp: string): Promise<Circuit[]> {
    const all_circuits = await this.circuits_service.getAll();
    if (all_circuits?.length == 0) {
      throw new BadRequestException(`There are no uploaded circuits to search for`);
    }
    const found_circuits = await this.circuits_service.findAndGetByEntity('%' + exp + '%');
    if (found_circuits?.length == 0) {
      throw new BadRequestException(`No circuits were found containing the expression '${exp}'`);
    }
    return found_circuits;
  }

  /**
   * Renames a circuit if it exists. Throws an error otherwise.
   * @param params Object containing the request id and new name
   */
  @Get(':id/rename/:new_name')
  async renameCircuit(@Param() params: any): Promise<Circuit> {
    return await this.circuits_service.renameOne(params.id, params.new_name);
  }
}