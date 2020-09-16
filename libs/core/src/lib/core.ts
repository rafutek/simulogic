/**
 * An entity can be a circuit or a simulation.
 */
export type entity = "circuit" | "simulation";

/**
 * Stores an id and a name.
 * Used for circuit and simulation files.
 */
export interface Entity {
    id: number;
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
export interface Signal {
    name: string,
    state: string
}

/**
 * Stores signals and their state at a given time.
 */
export interface Timestep {
    time: number,
    signals: Signal[]
}

/**
 * Stores the name and the wave of a WaveDrom signal.
 */
export interface Wave {
    name: string,
    wave: string
}

/**
 * Stores signals states and abscissa representing a simulation.
 * Variable used by WaveDrom to display a time diagram.
 */
export interface WaveDrom {
    signal: Wave[],
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
 * Stores a WaveDrom with an id.
 */
export interface IdWaveDrom {
    id: number,
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
    id_simu: number;
    id_circuit?: number;
    result?: boolean;
    wires?: string[],
    interval?: Interval
}

/**
 * Stores signals into a group with a name.
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