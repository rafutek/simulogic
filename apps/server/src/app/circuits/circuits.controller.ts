import {
  Controller, Post, UseInterceptors, Get, Param, Delete,
  UploadedFiles, ForbiddenException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CircuitsService } from './circuits.service';
import { CircuitDTO } from './circuit.dto';
import { Circuit } from './circuit.entity';
import * as fs from 'fs';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuits_service: CircuitsService) { }


  @Post()
  @UseInterceptors(FilesInterceptor('file', 20, {
    dest: 'simulator/home/user1/circuitCreator/data'
  }))
  async uploadCircuitFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const ext = ".logic";
    const ext_regexp = RegExp(`${ext}$`);
    let bad_extension = false;
    files.forEach(async file => {
      if (!file.originalname.match(ext_regexp)) {
        fs.unlinkSync(file.path);
        bad_extension = true;
      } else {
        const createCircuitDto = new CircuitDTO();
        createCircuitDto.name = file.originalname;
        createCircuitDto.path = file.path;
        // const errors = await validate(createCircuitDto);
        // if (errors.length > 0) {
        //   throw new BadRequestException('Validation failed');
        // }
        await this.circuits_service.insertOne(createCircuitDto);
      }
    })
    if (bad_extension) {
      throw new ForbiddenException(`Files without ${ext} extension were not uploaded`);
    }
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
    }
    await this.circuits_service.deleteOne(id);
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