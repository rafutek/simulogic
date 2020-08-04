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
 * Description of a simulation extraction.
 */
export interface ExtractionDetails {
    id_simu: number;
    id_circuit?: number;
    result?: boolean;
    from?: number;
    to?: number;
    wires?: string[];
  }

export interface SignalGroup {
    name?: string,
    signals?: string[],
    signal_group?: SignalGroup[]
}