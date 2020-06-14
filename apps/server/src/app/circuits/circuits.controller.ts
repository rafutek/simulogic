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
  async create(@UploadedFile() file: Express.Multer.File): Promise<Circuit> {
    const createCircuitDto = new CreateCircuitDto();
    createCircuitDto.name = file?.originalname;
    createCircuitDto.path = file?.path;
    const errors = await validate(createCircuitDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return this.circuitsService.create(createCircuitDto);
  }

  @Get()
  findAll(): Promise<Circuit[]> {
    return this.circuitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Circuit> {
    return this.circuitsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const circuit = await this.circuitsService.findOne(id);
    if (circuit) {
      if (circuit.simulatorPath != '') {
        fs.unlinkSync(circuit.simulatorPath);
      }
      fs.unlinkSync(circuit.path);
    }
    return this.circuitsService.remove(id);
  }
}