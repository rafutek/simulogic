import { UUIDWaveDrom, WaveDromBase } from '@simulogic/core';
import { Injectable } from '@nestjs/common';
import { isEmpty, isUUID } from 'class-validator';

@Injectable()
export class WaveDromSaverService {

    /**
     * Contains the WaveDrom extracted from a simulation file,
     * and the file id.
     */
    private _simulation: UUIDWaveDrom;

    public get simulation(): UUIDWaveDrom {
        return this._simulation;
    }

    /**
     * Sets the simulation variable after some validations.
     * If value is not valid, it throws an error.
     * @param value simulation to save containing a uuid and a WaveDrom
     */
    public set simulation(value: UUIDWaveDrom) {
        this.validateUUIDWaveDrom(value);
        this._simulation = value;
    }

    /**
     * Contains the WaveDrom extracted from a simulation result file,
     * and the simulation file id.
     */
    private _simulation_result: UUIDWaveDrom;

    public get simulation_result(): UUIDWaveDrom {
        return this._simulation_result;
    }

    public set simulation_result(value: UUIDWaveDrom) {
        this.validateUUIDWaveDrom(value);
        this._simulation_result = value;
    }

    /**
     * Contains the combination of input and output simulation WaveDrom.
     */
    private _full_simulation: UUIDWaveDrom;

    public get full_simulation(): UUIDWaveDrom {
        return this._full_simulation;
    }

    public set full_simulation(value: UUIDWaveDrom) {
        this.validateUUIDWaveDrom(value);
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

    /**
     * True if interval starts from the beginning of the simulation.
     */
    private _reached_start: boolean;

    public get reached_start(): boolean {
        return this._reached_start;
    }

    public set reached_start(value: boolean) {
        this._reached_start = value;
    }

    /**
     * True if interval goes to the end of the simulation.
     */
    private _reached_end: boolean;

    public get reached_end(): boolean {
        return this._reached_end;
    }

    public set reached_end(value: boolean) {
        this._reached_end = value;
    }

    /**
     * Checks that value is a valid UUIDWaveDrom.
     * Throws an error otherwise.
     * @param value UUIDWaveDrom to validate
     */
    private validateUUIDWaveDrom(value: UUIDWaveDrom) {
        if (isEmpty(value)) {
            throw new Error(`Value '${value}' cannot be empty`);
        }
        if (!isUUID(value.uuid)) {
            throw new Error(`Value UUID '${value.uuid}' must be a UUID`);
        }
        if (isEmpty(value.wavedrom)) {
            throw new Error(`Value WaveDrom '${value.wavedrom}' cannot be empty`);
        }
        if (isEmpty(value.wavedrom?.foot?.tick)) {
            throw new Error(`Value WaveDrom abscissa '${value.wavedrom?.foot?.tick}' cannot be empty`);
        }
        if (isEmpty(value.wavedrom?.signal)) {
            throw new Error(`Value WaveDrom signals array '${value.wavedrom?.signal}' cannot be empty`);
        }
    }
}