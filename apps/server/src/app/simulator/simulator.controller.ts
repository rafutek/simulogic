import { MemoryService } from '../memory/memory.service';
import { Controller, Post } from '@nestjs/common';
import { SimulatorDTO } from './simulator.dto';
import { isEmpty, isUUID } from 'class-validator';
import { SimulationsService } from '../simulations/simulations.service';
import { ExtractorService } from '../extractor/extractor.service';
import { UUIDWaveDrom, WaveDrom } from '@simulogic/core';
import { Simulation } from '../simulations/simulation.entity';

@Controller("simulator")
export class SimulatorController {
    constructor(
        private readonly simulations_service: SimulationsService,
        private readonly memory_service: MemoryService,
        private readonly extractor_service: ExtractorService,
    ) { }

    /**
     * Reads the simulation details and computes what is asked.
     * Depending on the details, and on memory service, extraction and manupulation can be done.
     * Whatever the simulatorDTO variable contains, a WaveDrom variable will be returned,
     * if no error was thrown before.
     * @param simulatorDTO variable containing the simulation details
     */
    @Post()
    async manage(simulatorDTO: SimulatorDTO): Promise<WaveDrom> {
        let wavedrom: WaveDrom;
        if (isEmpty(simulatorDTO)) {
            throw new Error(`SimulatorDTO '${simulatorDTO}' cannot be empty`);
        }
        const file_wavedrom = await this.getSimuFileWaveDrom(simulatorDTO.uuid_simu);
        wavedrom = file_wavedrom;

        if (simulatorDTO.result) {

        }
        return wavedrom;
    }

    /**
     * Returns the WaveDrom variable of the simulation, or the simulation result,
     * if no error was thrown before. Calls extractor if this variable was not saved in memory.
     * @param uuid_simu UUID of the simulation to get
     * @param result boolean to get simulation result or not
     */
    private async getSimuFileWaveDrom(uuid_simu: string, result?: boolean): Promise<WaveDrom> {
        if (!isUUID(uuid_simu)) {
            throw new Error(`Simulation UUID '${uuid_simu}' must be a UUID`);
        }
        const simulation = await this.simulations_service.getOne(uuid_simu);
        if (isEmpty(simulation.path)) {
            throw new Error(`Simulation path '${simulation.path}' cannot be empty`);
        }
        this.memory_service.simulation = await this.extractIfNotSaved(simulation, this.memory_service.simulation);
        return this.memory_service.simulation.wavedrom;
    }


    async extractIfNotSaved(simu_to_get: Simulation, simu_memo: UUIDWaveDrom): Promise<UUIDWaveDrom> {
        if (isEmpty(simu_memo) || simu_memo.uuid != simu_to_get.uuid) {
            const wavedrom = await this.extractor_service.extractFile(simu_to_get.path);
            return { uuid: simu_to_get.uuid, wavedrom: wavedrom };
        }
        return simu_memo;
    }



}