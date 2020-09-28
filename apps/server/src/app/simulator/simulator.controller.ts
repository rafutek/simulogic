import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { WaveDrom } from '@simulogic/core';
import { SimulatorDTO } from './simulator.dto';
import { SimulatorService } from './simulator.service';

@Controller("simulator")
export class SimulatorController {
    constructor(
        private readonly simulator_service: SimulatorService
    ) { }


    @Post()
    async manage(@Body() simulatorDTO: SimulatorDTO): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        try {
            wavedrom = await this.simulator_service.manage(simulatorDTO);
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
        return wavedrom;
    }


}