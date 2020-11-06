import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
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
            wavedrom = await this.simulator_service.process(simulatorDTO);
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
        return wavedrom;
    }

    @Get("sentsignals")
    getSentWaveDromSignals() {
        return this.simulator_service.getSentWaveDromSignalsNames();
    }

    /**
    * Returns the wires of the last extracted and sent wavedrom
    * which names contain the expression.
    */
    @Get('sentsignals/:search_expression')
    searchSentWaveDromSignals(@Param("search_expression") search_expression: string) {
        return this.simulator_service.searchSentWaveDromSignals(search_expression);
    }
}