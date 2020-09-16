import { IdWaveDrom, WaveDromBase } from '@simulogic/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryService {

    /**
     * Contains the WaveDrom extracted from a simulation file,
     * and the file id.
     */
    private _simulation: IdWaveDrom;

    public get simulation(): IdWaveDrom {
        return this._simulation;
    }

    public set simulation(value: IdWaveDrom) {
        this._simulation = value;
    }

    /**
     * Contains the WaveDrom extracted from a simulation result file,
     * and the simulation file id.
     */
    private _simulation_result: IdWaveDrom;

    public get simulation_result(): IdWaveDrom {
        return this._simulation_result;
    }

    public set simulation_result(value: IdWaveDrom) {
        this._simulation_result = value;
    }

    /**
     * Contains the combination of input and output simulation WaveDrom.
     */
    private _full_simulation: IdWaveDrom;

    public get full_simulation(): IdWaveDrom {
        return this._full_simulation;
    }

    public set full_simulation(value: IdWaveDrom) {
        this._full_simulation = value;
    }

    /**
     * Contains the simulation WaveDrom after all the manipulations.
     */
    private _simulation_sent: WaveDromBase;

    public get simulation_sent(): WaveDromBase {
        return this._simulation_sent;
    }

    public set simulation_sent(value: WaveDromBase) {
        this._simulation_sent = value;
    }

    private reached_start: boolean;
    private reached_end: boolean;

}

const test = new MemoryService();
test.simulation = test.simulation;