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
    wire_name: string,
    value: string,
    time: number
}

export interface Signal {
    name: string,
    wave: string
}

export interface WaveDrom {
    signal: Signal[]
}