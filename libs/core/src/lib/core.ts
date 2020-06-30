export type entity = "circuit" | "simulation";

export interface Entity {
    id: number;
    name: string;
};

export interface Wire {
    name: string,
    events: number[][]
};

export interface Simulation {
    start: number,
    end: number,
    wires: Wire[]
};

/**
 * Interface for apexChart series
 */
export interface Series {
    name: string,
    data: number[][]
}

export interface Event {
    wire: string,
    state: string,
    time: number
}

export interface WireState {
    name: string,
    state: string
}

export interface Timestep {
    time: number,
    wires: WireState[]
}

export interface Signal {
    name: string,
    wave: string
}

export interface WaveDrom {
    signal: Signal[],
    foot: {
        tick: string
    }
}