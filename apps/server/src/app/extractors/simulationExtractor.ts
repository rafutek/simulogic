import * as fs from 'fs';
import {
    Simulation, Wire, Event,
    WaveDrom, Signal,
    Timestep, WireState
} from '@simulogic/core'

export class SimulationExtractor {

    extractFile(file_path: string) {
        const content = fs.readFileSync(file_path, 'utf8');
        return this.extract(content);
    }

    extract(file_content: string) {
        const start = file_content.match(/START_TIME (.*)/)[1];
        const end = file_content.match(/END_TIME (.*)/)[1];
        const events = file_content.match(/EVENT (.*)/g);
        const timeline = this.extractTimeline(events);
        const wavedrom = this.createWaveDrom(start, end, timeline);
        return wavedrom;
    }

    extractTimeline(events: string[]): Timestep[] {
        const timeline: Timestep[] = [];
        events.forEach((event) => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const wire_state: WireState = {
                name: parsed_event[0],
                state: parsed_event[1],
            }
            const event_time = parseInt(parsed_event[2]);

            let add_new_timestep = true;
            timeline.forEach(timestep => {
                if (timestep.time == event_time) {
                    add_new_timestep = false;
                    timestep.wires.push(wire_state);
                }
            })
            if (add_new_timestep) {
                const new_timestep: Timestep = {
                    time: event_time,
                    wires: [wire_state]
                }
                timeline.push(new_timestep);
            }
        })
        return timeline;
    }

    createWaveDrom(start: string, end: string, timeline: Timestep[]) {
        let wavedrom = this.initWaveDrom(parseInt(start), timeline);
        wavedrom = this.fillWaveDrom(wavedrom, timeline);
        wavedrom = this.endWaveDrom(wavedrom,parseInt(end));
        console.log(wavedrom)
        return wavedrom;
    }

    initWaveDrom(start: number, timeline: Timestep[]) {
        let wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: start + " "
            }
        };
        timeline.forEach(timestep => {
            wavedrom.foot.tick += timestep.time + " ";
            let add_new_signal = true;
            timestep.wires.forEach(wire => {
                wavedrom.signal.forEach(signal => {
                    if (signal.name == wire.name) {
                        add_new_signal = false;
                    }
                })
                if (add_new_signal) {
                    const new_signal: Signal = {
                        name: wire.name,
                        wave: ".".repeat(timeline.length)
                    };
                    wavedrom.signal.push(new_signal);
                }
            })
        })
        return wavedrom;
    }

    private fillWaveDrom(wavedrom: WaveDrom, timeline: Timestep[]) {
        timeline.forEach((timestep, t) => {
            timestep.wires.forEach(wire_state => {
                wavedrom.signal.forEach(signal => {
                    if (signal.name == wire_state.name) {
                        const new_wave = signal.wave.substring(0, t) + this.stateToWave(wire_state.state) + signal.wave.substring(t + 1);
                        signal.wave = new_wave;
                    }
                })
            })
        })
        return wavedrom;
    }

    private stateToWave(value: string) {
        switch (value) {
            case 'T':
                return '1';
            case 'F':
                return '0';
            default:
                return 'x';
        }
    }

    private endWaveDrom(wavedrom: WaveDrom, end: number) {
        wavedrom.foot.tick += end + " ";
        wavedrom.signal.forEach(signal => {
            signal.wave = "x"+signal.wave;
        })
        return wavedrom;
    }

    createSimulation(start: string, end: string, events: string[]) {
        const simulation: Simulation = {
            start: parseInt(start),
            end: parseInt(end),
            wires: []
        }

        // Fill simulation wires array
        events.forEach((event) => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const wire_name = parsed_event[0];
            const state = this.stateToNumber(parsed_event[1]);
            const time = parseInt(parsed_event[2]);
            simulation.wires = this.createWireOrAddEvent(simulation.wires, wire_name, time, state);
        })

        return simulation;
    }

    private stateToNumber(state: string): number {
        switch (state) {
            case "T":
                return 1;
            case "F":
                return 0;
            default:
                return -1;
        }
    }

    /**
     * Creates a wire with a single event or add the event to the existing wire
     * and returns the updated wires array
     * @param wires array containing all the wires
     * @param wire_name name of the existing or new wire
     * @param time_event time of the event to add
     * @param state_event state of the event to add
     */
    private createWireOrAddEvent(wires: Wire[], wire_name: string,
        time_event: number, state_event: number) {
        let added_wire_event = false;
        wires.forEach((wire) => {
            if (wire.name == wire_name) {
                wire.events.push([time_event, state_event]); // add event to existent wire
                added_wire_event = true;
            }
        })
        if (!added_wire_event) { // wire not present so creation
            wires.push({
                name: wire_name,
                events: [[time_event, state_event]]
            })
        }
        return wires;
    }
}