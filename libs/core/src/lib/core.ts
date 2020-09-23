/**
 * An entity can be a circuit or a simulation.
 */
export type entity = "circuit" | "simulation";

/**
 * Stores a uuid and a name.
 * Used for circuit and simulation files.
 */
export interface Entity {
    uuid: string;
    name: string;
};

/**
 * Stores a signal name, state, and time.
 */
export interface Event {
    signal_name: string,
    state: string,
    time: number
}

/**
 * Stores a signal name and state.
 */
export interface SignalState {
    name: string,
    state: string
}

/**
 * Stores signals and their state at a given time.
 */
export interface Timestep {
    time: number,
    signals: SignalState[]
}

/**
 * Stores variables relative to a clock.
 */
export interface Clock {
    name: string,
    first_up_time: number,
    period: number,
    /**
     * Percentage of the period where signal is up.
     */
    up_percent: number
}

/**
 * Stores the name and the wave of a WaveDrom signal.
 */
export interface SignalWave {
    name: string,
    wave: string
}

/**
 * Stores signals states and abscissa representing a simulation.
 * Variable used by WaveDrom to display a time diagram.
 */
export interface WaveDrom {
    signal: SignalWave[],
    foot: {
        tick: string
    }
}

/**
 * Same as WaveDrom, but signal field has type 'any'.
 * Used for grouped signals.
 */
export interface WaveDromBase {
    signal: any,
    foot: {
        tick: string
    }
}

/**
 * Stores a WaveDrom with an uuid.
 */
export interface UUIDWaveDrom {
    uuid: string,
    wavedrom: WaveDrom
}

/**
 * Stores start and end values of an interval.
 */
export interface Interval {
    start: number,
    end: number
}

/**
 * Stores simulation extraction details.
 */
export interface ExtractionDetails {
    uuid_simu: string;
    uuid_circuit?: string;
    result?: boolean;
    wires?: string[],
    interval?: Interval
}

/**
 * Stores signals names into a group with a name.
 */
export interface SignalGroup {
    name?: string,
    signals?: string[]
}

/**
 * Configuration panel settings.
 */
export interface Configuration {
    interval: Interval,
    time_shift: number
}