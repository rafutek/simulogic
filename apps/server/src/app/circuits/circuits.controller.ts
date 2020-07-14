import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Delete, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CircuitsService } from './circuits.service';
import { CreateCircuitDto } from './dto/create-circuit.dto';
import { Circuit } from './circuit.entity';
import * as fs from 'fs';
import { validate } from 'class-validator';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    dest: 'simulator/home/user1/circuitCreator/data'
  }))
  async create(@UploadedFile() file: Express.Multer.File) {
    const createCircuitDto = new CreateCircuitDto();
    createCircuitDto.name = file?.originalname;
    createCircuitDto.path = file?.path;
    const errors = await validate(createCircuitDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    await this.circuitsService.create(createCircuitDto);
  }

  @Get()
  findAll(): Promise<Circuit[]> {
    return this.circuitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Circuit> {
    return this.circuitsService.findEntity(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const circuit = await this.circuitsService.findOne(id);
    if (circuit) {
      if (circuit.simulator_path != '' && fs.existsSync(circuit.simulator_path)) {
        fs.unlinkSync(circuit.simulator_path);
      }
      if (fs.existsSync(circuit.path)) {
        fs.unlinkSync(circuit.path);
      }
    }
    await this.circuitsService.remove(id);
  }

  /**
   * Returns the circuits which name contains the expression.
   */
  @Get('search/:expr')
  searchCircuits(@Param('expr') expr: string) {
    return this.circuitsService.searchNames('%' + expr + '%');
  }

  /**
   * Renames a circuit if it exists. Throws an error otherwise.
   * @param params Object containing the request id and new name.
   */
  @Get(':id/rename/:new_name')
  async rename(@Param() params: any) {
    await this.circuitsService.rename(params.id, params.new_name);
  }
}