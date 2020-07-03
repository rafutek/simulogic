export type entity = "circuit" | "simulation";

export interface Entity {
    id: number;
    name: string;
};

export interface Event {
    wire: string,
    state: string,
    time: number
}

export interface Wire {
    name: string,
    state: string
}

export interface Timestep {
    time: number,
    wires: Wire[]
}

/**
 * Interface for WaveDrom signals.
 */
export interface Signal {
    name: string,
    wave: string
}

/**
 * Interface for WaveDrom time diagram.
 */
export interface WaveDrom {
    signal: Signal[],
    foot: {
        tick: string
    }
}

/**
 * Interface to associate a WaveDrom to
 * its simulation.
 */
export interface ExtractedSimulation {
    id: string,
    wavedrom: WaveDrom
}