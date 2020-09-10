import {
  Controller, Post, UseInterceptors, Get, Param, Delete,
  UploadedFiles, ForbiddenException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CircuitsService } from './circuits.service';
import { CircuitDTO } from './circuit.dto';
import { Circuit } from './circuit.entity';
import * as fs from 'fs';
import { validate } from 'class-validator';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuits_service: CircuitsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('file', 20, { dest: 'simulator/home/user1/circuitCreator/data' }))
  async uploadCircuitFiles(@UploadedFiles() files: Express.Multer.File[]) {
    files.forEach(async file => {
      const circuitDTO = new CircuitDTO();
      circuitDTO.name = file.originalname;
      circuitDTO.path = file.path;
      const errors = await validate(circuitDTO);
      if (errors.length > 0) {
        fs.unlinkSync(file.path);
      }
      else await this.circuits_service.insertOne(circuitDTO);
    })
  }

  @Get()
  findAll(): Promise<Circuit[]> {
    return this.circuits_service.getAllByEntity();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Circuit> {
    return this.circuits_service.getOneByEntity(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const circuit = await this.circuits_service.getOne(id);
    if (circuit) {
      if (circuit.simulator_path != '' && fs.existsSync(circuit.simulator_path)) {
        fs.unlinkSync(circuit.simulator_path);
      }
      if (fs.existsSync(circuit.path)) {
        fs.unlinkSync(circuit.path);
      }
      await this.circuits_service.deleteOne(id);
    }
  }

  /**
   * Returns the circuits which name contains the expression.
   */
  @Get('search/:expr')
  searchCircuits(@Param('expr') expr: string) {
    return this.circuits_service.findAndGetByEntity('%' + expr + '%');
  }

  /**
   * Renames a circuit if it exists. Throws an error otherwise.
   * @param params Object containing the request id and new name
   */
  @Get(':id/rename/:new_name')
  async rename(@Param() params: any) {
    await this.circuits_service.renameOne(params.id, params.new_name);
  }
}