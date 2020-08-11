/**
 * An entity can be a circuit or a simulation.
 */
export type entity = "circuit" | "simulation";

/**
 * Brief information about an entity.
 */
export interface Entity {
    id: number;
    name: string;
};

/**
 * Description of a logic event on a specific wire.
 */
export interface Event {
    wire: string,
    state: string,
    time: number
}

/**
 * Wire state interface.
 */
export interface Wire {
    name: string,
    state: string
}

/**
 * Description of logic events on several wires.
 */
export interface Timestep {
    time: number,
    wires: Wire[]
}

/**
 * WaveDrom signal interface.
 */
export interface Signal {
    name: string,
    wave: string
}

/**
 * WaveDrom data variable interface.
 */
export interface WaveDrom {
    signal: Signal[],
    foot: {
        tick: string
    }
}

/**
 * Same as WaveDrom, but signal field can have any type.
 * Used for grouped signals.
 */
export interface WaveDromBase {
    signal: any,
    foot: {
        tick: string
    }
}

/**
 * Linker between a simulation and its resulting WaveDrom.
 */
export interface ExtractedSimulation {
    id: number,
    wavedrom: WaveDrom
}

/**
 * Simple structure to store start and end values.
 */
export interface Interval {
    start: number,
    end: number
}

/**
 * Description of a simulation extraction.
 */
export interface ExtractionDetails {
    id_simu: number;
    id_circuit?: number;
    result?: boolean;
    wires?: string[],
    interval?: Interval
}

/**
 * Structure to group signals under a common name.
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