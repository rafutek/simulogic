import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { SignalNamesGroup, WaveDrom } from '@simulogic/core';
import { SimulatorDTO } from './simulator.dto';
import { SimulatorService } from './simulator.service';

@Controller("simulator")
export class SimulatorController {
    constructor(
        private readonly simulator_service: SimulatorService
    ) { }


    /**
     * Main simulator controller function,
     * used to return a WaveDrom variable according to the simulatorDTO variable fields.
     * Look into SimulatorService process function for more details.
     * @param simulatorDTO variable of type SimulatorDTO
     */
    @Post()
    async process(@Body() simulatorDTO: SimulatorDTO): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        try {
            wavedrom = await this.simulator_service.process(simulatorDTO);
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
        return wavedrom;
    }

    /**
     * Returns the signals names of WaveDromSaver simulation_sent variable,
     * grouped by 'input' and/or 'output' group. This process could be done by
     * the interface when receiving simulation_sent, but we want to limit client processing.
     */
    @Get("sentsignals")
    getSentWaveDromSignalsNames(): SignalNamesGroup[] {
        return this.simulator_service.getSentWaveDromSignalsNames();
    }

    /**
     * Returns the signals names of WaveDromSaver simulation_sent variable,
     * grouped by 'input' and/or 'output' group, that contain search_expression.
     * @param search_expression string used for the search
     */
    @Get('sentsignals/:search_expression')
    searchSentWaveDromSignals(@Param("search_expression") search_expression: string): SignalNamesGroup[] {
        return this.simulator_service.searchSentWaveDromSignals(search_expression);
    }
}