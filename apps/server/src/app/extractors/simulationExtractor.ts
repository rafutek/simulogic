import * as fs from 'fs';
import { Simulation, Wire, Event, WaveDrom, Signal } from '@simulogic/core'

export class SimulationExtractor {

    extractFile(file_path: string) {
        const content = fs.readFileSync(file_path, 'utf8');
        return this.extract(content);
    }

    extract(file_content: string) {
        const start = file_content.match(/START_TIME (.*)/)[1];
        const end = file_content.match(/END_TIME (.*)/)[1];
        const events = file_content.match(/EVENT (.*)/g);
        const extracted_events = this.extractEvents(events);
        return this.createWavedrom(start, end, extracted_events);
    }

    extractEvents(events: string[]): Event[] {
        const extracted_events: Event[] = [];
        events.forEach((event) => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const extracted_event: Event = {
                wire_name: parsed_event[0],
                value: parsed_event[1],
                time: parseInt(parsed_event[2])
            }
            extracted_events.push(extracted_event);
        })
        return extracted_events;
    }

    private initWavedrom(start: string, events: Event[]): WaveDrom {
        const wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: start + ' '
            }
        };
        events.forEach(event => {
            let add_new_signal = true;
            wavedrom.signal.forEach(signal => {
                if (signal.name == event.wire_name) {
                    add_new_signal = false;
                }
            })
            if (add_new_signal) {
                const new_signal: Signal = {
                    name: event.wire_name,
                    wave: 'x'
                };
                wavedrom.signal.push(new_signal);
            }
        })
        return wavedrom;
    }

    createWavedrom(start: string, end: string, events: Event[]): WaveDrom {
        const wavedrom = this.initWavedrom(start, events);
        events.forEach(event => {
            wavedrom.signal.forEach(signal => {
                if (signal.name == event.wire_name) {
                    signal.wave += this.valueToWave(event.value);
                }
                else {
                    signal.wave += '.';
                }
            })
            if (!wavedrom.foot.tick.includes(` ${event.time} `)) {
                wavedrom.foot.tick += event.time + ' ';
            }
        })
        return wavedrom;
    }

    private valueToWave(value: string) {
        switch (value) {
            case 'T':
                return '1';
            case 'F':
                return '0';
            default:
                return 'x';
        }
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