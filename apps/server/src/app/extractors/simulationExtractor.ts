import * as fs from 'fs';
import { Simulation, Wire } from '@simulogic/core'

export class SimulationExtractor {

    extractFile(file_path: string) {
        const content = fs.readFileSync(file_path, 'utf8');
        return this.extract(content);
    }


    extract(file_content: string) {
        const start = file_content.match(/START_TIME (.*)/)[1];
        const end = file_content.match(/END_TIME (.*)/)[1];
        const events = file_content.match(/EVENT (.*)/g);

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