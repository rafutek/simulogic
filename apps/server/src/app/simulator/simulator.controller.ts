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
     * Returns the signals names of WaveDromSaver simulation_sent variable.
     * This variable can be empty, contain only input signals, or input and output signals.
     * So response can be empty, contain only input signals names, or input and output signals names.
     * 
     * This could be done by the interface when receiving simulation_sent, 
     * but we want to limit client processing so it is done by the server.
     */
    @Get("sentsignalsnames")
    getSentWaveDromSignalsNames(): SignalNamesGroup[] {
        return this.simulator_service.getSentWaveDromSignalsNames();
    }

    /**
     * Returns grouped signals names of WaveDromSaver simulation_sent variable
     * which contain search_expression.
     * 
     * Example: simulation_sent contains input signals in_1, in_2 and output signal out_1.
     * Expression "in" will return one group of signals names: input group containing "in_1" and "in_2" signals names.
     * @param search_expression string used for the search
     */
    @Get('sentsignalsnames/:search_expression')
    searchSentWaveDromSignals(@Param("search_expression") search_expression: string): SignalNamesGroup[] {
        return this.simulator_service.searchSentWaveDromSignals(search_expression);
    }

    /**
     * Returns the limits (start and end time) of the last saved simulation variable.
     * This simulation variable is saved during process function call, so if process function
     * has not been called, this function will return nothing.
     */
    @Get('simulimits')
    getSimulationLimits(){
        return this.simulator_service.getSimulationLimits();
    }
}