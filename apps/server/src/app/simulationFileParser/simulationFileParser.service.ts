import * as fs from 'fs';
import {
    WaveDrom, SignalWave,
    Timestep, SignalState, Interval, Clock
} from '@simulogic/core'
import { isEmpty, isInt, isNegative } from 'class-validator';
import { MemoryService } from '../memory/memory.service';
import { Injectable } from '@nestjs/common';
import { ManipulatorService } from '../manipulator/manipulator.service';

@Injectable()
export class SimulationFileParserService {
    constructor(
        private memory_service: MemoryService,
        private manipulator_service: ManipulatorService,
    ) { }

    /**
     * Returns the WaveDrom corresponding to a simulation file.
     * Saves it for later calls, so that extraction is not needed each time.
     * @param uuid uuid of the simulation to get
     * @param file_path path to the simulation file
     */
    async getWaveDrom(uuid: string, file_path: string): Promise<WaveDrom> {
        if (isEmpty(this.memory_service.simulation) || this.memory_service.simulation.uuid != uuid) {
            const wavedrom = await this.extractFile(file_path);
            this.memory_service.simulation = { uuid: uuid, wavedrom: wavedrom };
        }
        return this.memory_service.simulation.wavedrom;
    }

    /**
     * Returns the WaveDrom corresponding to a simulation result file.
     * Saves it for later calls, so that extraction is not needed each time.
     * @param uuid uuid of the simulation result to get
     * @param file_path path to the simulation result file
     */
    async getWaveDromResult(uuid: string, file_path: string): Promise<WaveDrom> {
        if (isEmpty(this.memory_service.simulation_result) || this.memory_service.simulation_result.uuid != uuid) {
            const result_wavedrom = await this.extractFile(file_path);
            this.memory_service.simulation_result = { uuid: uuid, wavedrom: result_wavedrom };
        }
        return this.memory_service.simulation_result.wavedrom;
    }

    /**
     * Extracts a simulation file into a WaveDrom variable.
     * Throws an error if extraction fails.
     * @param file_path path to the simulation file
     */
    async extractFile(file_path: string): Promise<WaveDrom> {
        const file_content = fs.readFileSync(file_path, 'utf8');

        const start = file_content.match(/START_TIME (.*)/)[1];
        const end = file_content.match(/END_TIME (.*)/)[1];
        const interval = this.stringToInterval(start, end);

        const events = file_content.match(/EVENT (.*)/g);
        const clocks = file_content.match(/CLOCK (.*)/g);
        const clocks_events = this.clocksToEvents(clocks, interval);
        const all_events = events ? events.concat(clocks_events) : clocks_events;

        const timeline = this.eventsToTimeline(all_events);
        const wavedrom = this.timelineToWaveDrom(interval, timeline);
        return wavedrom;
    }

    /**
     * Returns an interval containing start and end values.
     * Throws an error if those variables are not valid.
     * @param start string containing the interval start time
     * @param end string containing the interval end time
     */
    private stringToInterval(start: string, end: string): Interval {
        const interval: Interval = {
            start: Number(start),
            end: Number(end)
        };
        if (isNaN(interval.start) || isNaN(interval.end)) {
            throw new Error("Interval values must be numbers");
        }
        if (interval.start >= interval.end) {
            throw new Error("Interval end value must be greater than start value");
        }
        return interval;
    }

    /**
     * Converts clocks to events.
     * The array of clocks should contain strings like "CLOCK clk 10 100 50"
     * with clk the name of the clock, 10 the first up time, 100 the period,
     * and 50 the up ratio (signal stays up 50% of the period).
     * @param clocks array of strings representing clocks
     * @param interval interval of the simulation
     */
    private clocksToEvents(clocks: string[], interval: Interval): string[] {
        let clocks_events: string[] = [];
        if (clocks?.length > 0) {
            clocks.forEach(clock => {
                clocks_events = clocks_events.concat(this.clockToEvents(clock, interval));
            })
        }
        return clocks_events;
    }

    /**
     * Converts a clock to an array of events.
     * A clock is a string like "CLOCK clk 10 100 50",
     * and an event is a string like "EVENT clk T 10".
     * Throws an error if clock is not valid.
     * @param clock string representing a clock
     * @param interval variable containing simulation interval
     */
    private clockToEvents(clock: string, interval: Interval): string[] {
        const clock_events: string[] = [];
        const parsed_clock = clock.replace('CLOCK ', '').split(' ');
        if (parsed_clock.length != 4) {
            throw new Error(`Cannot convert clock '${clock}' to events`);
        }
        const clk: Clock = {
            name: parsed_clock[0],
            first_up_time: Number(parsed_clock[1]),
            period: Number(parsed_clock[2]),
            up_percent: Number(parsed_clock[3])
        };
        this.validateClockWithInterval(clk, interval);

        const up_duration = clk.up_percent / 100 * clk.period;
        let up_time = clk.first_up_time;
        let down_time: number;
        let stop = false;
        do {
            if (up_time <= interval.end) {
                clock_events.push(`EVENT ${clk.name} T ${up_time}`);
                down_time = up_time + up_duration;
                if (down_time <= interval.end) {
                    clock_events.push(`EVENT ${clk.name} F ${down_time}`);
                    up_time += clk.period;
                } else stop = true;
            } else stop = true;
        } while (!stop);

        return clock_events;
    }

    /**
     * Throws an error if clock is not a valid clock,
     * on its own and regarding the simulation interval.
     * @param clock clock to validate
     * @param interval interval used to validate the clock
     */
    private validateClockWithInterval(clock: Clock, interval: Interval) {
        this.validateClock(clock);
        if (clock.first_up_time < interval.start) {
            throw new Error(`Clock first up time '${clock.first_up_time}' 
            cannot be < to interval start '${interval.start}'`);
        }
        if (clock.first_up_time >= interval.end) {
            throw new Error(`Clock first up time '${clock.first_up_time}' 
            cannot be >= to interval end '${interval.end}'`);
        }
    }

    /**
     * Throws an error if value is not a valid clock.
     * @param value clock to validate
     */
    private validateClock(value: Clock) {
        if (isEmpty(value)) {
            throw new Error(`Clock '${value}' cannot be empty`);
        }
        if (isEmpty(value.name)) {
            throw new Error(`Clock name '${value}' cannot be empty`);
        }
        if (!isInt(value.first_up_time) || isNegative(value.first_up_time)) {
            throw new Error(`Clock first up time '${value.first_up_time}' must be a positive integer`);
        }
        if (!isInt(value.period) || isNegative(value.period)) {
            throw new Error(`Clock period '${value.period}' must be a positive integer`);
        }
        if (!isInt(value.up_percent) || isNegative(value.up_percent) || value.up_percent >= 100) {
            throw new Error(`Clock up percent '${value.up_percent}' must be a positive integer < 100`);
        }
    }

    /**
     * Convert an array of events to an array of timesteps.
     * The array of events should contain strings like "EVENT s1 100",
     * and the array of timesteps will contain all the events by time.
     * Throws an error if there is a problem.
     * @param events array of strings representing signal events
     */
    private eventsToTimeline(events: string[]): Timestep[] {
        if (isEmpty(events) || events.length == 0) {
            throw new Error(`Events array '${events}' cannot be empty`);
        }
        let timeline: Timestep[] = [];
        events.forEach(event => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const signal: SignalState = {
                name: parsed_event[0],
                state: parsed_event[1],
            }
            const event_time = Number(parsed_event[2]);

            // Iterate over timeline to add event to timestep
            // or create a new timestep with that event
            let add_new_timestep = true;
            timeline.forEach(timestep => {
                if (timestep.time == event_time) {
                    add_new_timestep = false;
                    timestep.signals.push(signal);
                }
            })
            if (add_new_timestep) {
                const new_timestep: Timestep = {
                    time: event_time,
                    signals: [signal]
                }
                this.validateTimestep(new_timestep);
                timeline.push(new_timestep);
            }
        })

        return timeline.sort(this.compare_timesteps);
    }

    /**
     * Throws an error if value is not a valid timestep.
     * @param value timestep to validate
     */
    private validateTimestep(value: Timestep) {
        if (isEmpty(value)) {
            throw new Error(`Timestep '${value}' cannot be empty`);
        }
        if (isNaN(value.time) || isNegative(value.time)) {
            throw new Error(`Timestep time '${value.time}' must be a positive number`);
        }
        if (isEmpty(value.signals)) {
            throw new Error(`Timestep signals '${value.signals}' cannot be empty`);
        }
        value.signals.forEach(s => this.validateSignal(s));
    }

    /**
     * Throws an error if value is not a valid signal.
     * @param value signal to validate
     */
    private validateSignal(value: SignalState) {
        if (isEmpty(value)) {
            throw new Error(`Signal '${value}' cannot be empty`);
        }
        if (isEmpty(value.name)) {
            throw new Error(`Signal name '${value.name}' cannot be empty`);
        }
        this.validateState(value.state);
    }

    /**
     * Throws an error if value is not a valid state.
     * @param value state to validate
     */
    private validateState(value: string) {
        if (isEmpty(value)) {
            throw new Error(`State '${value}' cannot be empty`);
        }
        if (value !== 'T' && value !== 'F' && value !== 'X' && value !== 'Z') {
            throw new Error(`State '${value}' is not handled`);
        }
    }

    /**
     * Compares two timesteps by time.
     * Can be used to sort by time an array of timesteps.
     * @param t1 first timestep
     * @param t2 second timestep
     */
    private compare_timesteps(t1: Timestep, t2: Timestep) {
        if (t1.time < t2.time) {
            return -1;
        }
        if (t1.time > t2.time) {
            return 1;
        }
        return 0;
    }

    /**
     * Converts an array of timesteps to a WaveDrom variable.
     * @param interval simulation interval
     * @param timeline array of simulation timesteps
     */
    private timelineToWaveDrom(interval: Interval, timeline: Timestep[]): WaveDrom {
        let wavedrom = this.initWaveDrom(interval, timeline);
        this.fillWaveDrom(wavedrom, timeline);
        this.manipulator_service.finalizeWaveDrom(wavedrom);
        return wavedrom;
    }

    /**
     * Returns a WaveDrom variable initialized from a timeline and an interval.
     * It contains the time axis relative to the interval and the initialized signals.
     * @param interval simulation interval
     * @param timeline array of simulation timesteps
     */
    private initWaveDrom(interval: Interval, timeline: Timestep[]) {
        let wavedrom: WaveDrom = {
            signal: [],
            foot: { tick: "" }
        };
        const time_axis = this.createTimeAxis(interval, timeline);
        wavedrom.foot.tick = time_axis.join(" ");
        this.initSignals(wavedrom, timeline, time_axis.length - 1);
        return wavedrom;
    }

    /**
     * Returns an array containing the time of each timestep
     * included in the simulation interval, and the interval boundaries.
     * @param interval simulation interval
     * @param timeline array of simulation timesteps
     */
    private createTimeAxis(interval: Interval, timeline: Timestep[]): number[] {
        const time_axis: number[] = [];
        timeline.forEach(timestep => {
            if (timestep.time > interval.start && timestep.time < interval.end) {
                time_axis.push(timestep.time);
            }
        })
        time_axis.unshift(interval.start);
        time_axis.push(interval.end);
        return time_axis;
    }

    /**
     * Returns the WaveDrom variable with signals initialized.
     * They contain their name and a wave filled with points.
     * @param wavedrom WaveDrom variable to modify
     * @param timeline array of simulation timesteps
     * @param num_events number of events (points)
     */
    private initSignals(wavedrom: WaveDrom, timeline: Timestep[], num_events: number): WaveDrom {
        timeline.forEach(timestep => {
            timestep.signals.forEach(s_t => {
                let add_new_signal = true;
                wavedrom.signal.forEach(s_w => {
                    if (s_w.name == s_t.name) {
                        add_new_signal = false;
                    }
                })
                if (add_new_signal) {
                    const new_signal: SignalWave = {
                        name: s_t.name,
                        wave: ".".repeat(num_events)
                    };
                    wavedrom.signal.push(new_signal);
                }
            })
        })
        return wavedrom;
    }

    /**
     * Replaces points of signal waves with event values present in timeline,
     * and returns resulting WaveDrom variable.
     * @param wavedrom WaveDrom variable initialized
     * @param timeline array of simulation timesteps
     */
    private fillWaveDrom(wavedrom: WaveDrom, timeline: Timestep[]) {
        const time_axis = this.manipulator_service.tickToTimeAxis(wavedrom.foot.tick);
        timeline.forEach((timestep) => {
            const t = time_axis.indexOf(timestep.time);
            if (t >= 0) {
                timestep.signals.forEach(s_t => {
                    wavedrom.signal.forEach(s_w => {
                        if (s_w.name == s_t.name) {
                            const wave_char = this.fileStateToWaveState(s_t.state);
                            s_w.wave = this.manipulator_service.replaceCharAt(s_w.wave, t, wave_char);
                        }
                    })
                })
            }
        })
        return wavedrom;
    }

    /**
     * Converts a simulation file state to a WaveDrom wave state.
     * @param value character representing the state
     */
    private fileStateToWaveState(value: string) {
        switch (value) {
            case 'T':
                return '1';
            case 'F':
                return '0';
            default:
                return 'x';
        }
    }

    async getCombinedWaveDrom(uuid: string, simu_file_path: string, result_file_path: string) {
        if (isEmpty(this.memory_service.full_simulation) || this.memory_service.full_simulation.uuid != uuid) {
            const wavedrom = await this.getWaveDrom(uuid, simu_file_path);
            const wavedrom_result = await this.getWaveDromResult(uuid, result_file_path);
            const combined_wavedrom = this.manipulator_service.combineWaveDroms(wavedrom, wavedrom_result);
            this.memory_service.full_simulation = { uuid: uuid, wavedrom: combined_wavedrom };
        }
        return this.memory_service.full_simulation.wavedrom;
    }
}