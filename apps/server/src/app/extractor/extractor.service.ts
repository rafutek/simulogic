import * as fs from 'fs';
import {
    WaveDrom, Wave,
    Timestep, Signal, WaveDromBase, SignalGroup, Interval, Clock
} from '@simulogic/core'
import { isEmpty, isInt, isNegative, isNotEmpty } from 'class-validator';
import { MemoryService } from '../memory/memory.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtractorService {
    constructor(
        private memory_service: MemoryService
    ) { }

    /**
     * Returns the WaveDrom corresponding to a simulation file.
     * Saves it for later calls, so that extraction is not needed each time.
     * @param uuid uuid of the simulation to get
     * @param file_path path to the simulation file
     */
    getWaveDrom(uuid: string, file_path: string): WaveDrom {
        if (isEmpty(this.memory_service.simulation) || this.memory_service.simulation.uuid != uuid) {
            const wavedrom = this.extractFile(file_path);
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
    getWaveDromResult(uuid: string, file_path: string): WaveDrom {
        if (isEmpty(this.memory_service.simulation_result) || this.memory_service.simulation_result.uuid != uuid) {
            const result_wavedrom = this.extractFile(file_path);
            this.memory_service.simulation_result = { uuid: uuid, wavedrom: result_wavedrom };
        }
        return this.memory_service.simulation_result.wavedrom;
    }

    /**
     * Extracts a simulation file into a WaveDrom variable.
     * Throws an error if extraction fails.
     * @param file_path path to the simulation file
     */
    extractFile(file_path: string): WaveDrom {
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
            const signal: Signal = {
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
    private validateSignal(value: Signal) {
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
        this.finalizeWaveDrom(wavedrom);
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
                    const new_signal: Wave = {
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
        const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
        timeline.forEach((timestep) => {
            const t = time_axis.indexOf(timestep.time);
            if (t >= 0) {
                timestep.signals.forEach(s_t => {
                    wavedrom.signal.forEach(s_w => {
                        if (s_w.name == s_t.name) {
                            const wave_char = this.stateToWaveChar(s_t.state);
                            s_w.wave = this.replaceCharAt(s_w.wave, t, wave_char);
                        }
                    })
                })
            }
        })
        return wavedrom;
    }

    /**
     * Converts a string like "- 0 10 100 + " to an array like [0, 10, 100].
     * @param tick string containing the simulation events times
     */
    private tickToTimeAxis(tick: string): number[] {
        const str_time_axis = tick.split(' ').filter(t => t && !isNaN(Number(t)));
        return str_time_axis.map(str_time => Number(str_time));
    }

    /**
     * Converts an array like [0, 10, 100] to a string like "- 0 10 100 + ".
     * @param time_axis array containing the simulation events times
     */
    private timeAxisToTick(time_axis: number[]): string {
        let tick = time_axis.join(' ');
        tick = `- ${tick} + `;
        return tick;
    }

    /**
     * Replaces a string character. Throws an error if it fails.
     * @param str string to modify
     * @param idx index of the character to replace
     * @param char new character value
     */
    private replaceCharAt(str: string, idx: number, char: string) {
        if (isEmpty(str)) {
            throw new Error(`Cannot replace a character of an empty string '${str}'`);
        }
        if (idx > str.length) {
            throw new Error(`Index value '${idx}' cannot be greater than string length '${str.length}'`);
        }
        if (char.length != 1) {
            throw new Error(`New character value '${char}' cannot have a length different than 1`);
        }
        return str.substring(0, idx) + char + str.substring(idx + 1);
    }

    /**
     * Converts a simulation file state to a WaveDrom wave state.
     * @param value character representing the state
     */
    private stateToWaveChar(value: string) {
        switch (value) {
            case 'T':
                return '1';
            case 'F':
                return '0';
            default:
                return 'x';
        }
    }

    /**
     * Returns the WaveDrom variable with '-' and '+ signs around abscissa,
     * and 'x' around each signal wave. 
     * '-' and '+' signs represents the simulation beginning and ending,
     * while 'x' represents an unknown state.
     * @param wavedrom WaveDrom variable to modify
     */
    private finalizeWaveDrom(wavedrom: WaveDrom) {
        if (!wavedrom.foot.tick.startsWith('-')) {
            wavedrom.foot.tick = "- " + wavedrom.foot.tick;
        }
        if (!wavedrom.foot.tick.endsWith("+ ")) {
            wavedrom.foot.tick = wavedrom.foot.tick + " + ";
        }
        wavedrom.signal.forEach(signal => {
            if (!signal.wave.startsWith('x')) {
                signal.wave = 'x' + signal.wave;
            }
            if (!signal.wave.endsWith('x')) {
                signal.wave = signal.wave + 'x';
            }
        })
        return wavedrom;
    }

    getCombinedWaveDrom(uuid: string, simu_file_path: string, result_file_path: string) {
        if (isEmpty(this.memory_service.full_simulation) || this.memory_service.full_simulation.uuid != uuid) {
            const wavedrom = this.getWaveDrom(uuid, simu_file_path);
            const wavedrom_result = this.getWaveDromResult(uuid, result_file_path);
            const combined_wavedrom = this.combineWaveDroms(wavedrom, wavedrom_result);
            this.memory_service.full_simulation = { uuid: uuid, wavedrom: combined_wavedrom };
        }
        return this.memory_service.full_simulation.wavedrom;
    }

    extractWaveDromInterval(wavedrom: WaveDrom, interval: Interval) {
        if (wavedrom) {
            let interval_wavedrom = this.initIntervalWaveDrom(wavedrom);
            interval_wavedrom = this.fillIntervalWaveDrom(interval_wavedrom, wavedrom, interval);
            if (isNotEmpty(interval.start))
                interval_wavedrom = this.manageStartTime(interval_wavedrom, wavedrom, interval.start);
            if (isNotEmpty(interval.end))
                interval_wavedrom = this.appendEndTime(interval_wavedrom, wavedrom, interval.end);
            this.manageIntervalLimits(interval_wavedrom);
            return interval_wavedrom;
        }
        else throw new Error("wavedrom is undefined");
    }

    initIntervalWaveDrom(wavedrom: WaveDrom) {
        const interval_wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: ""
            }
        };
        wavedrom.signal.forEach(signal => {
            const new_signal: Wave = {
                name: signal.name,
                wave: ""
            };
            interval_wavedrom.signal.push(new_signal);
        })
        return interval_wavedrom;
    }

    fillIntervalWaveDrom(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, interval: Interval) {
        this.memory_service.reached_start = this.memory_service.reached_start = true;
        const str_time_axis = wavedrom.foot.tick.split(' '); // full array
        const time_axis = this.tickToTimeAxis(wavedrom.foot.tick); // array reduced to numbers
        time_axis.forEach(t => {
            if (this.isInside(t, interval)) {
                interval_wavedrom.foot.tick += `${t} `;
                interval_wavedrom.signal.forEach((s, s_index) => {
                    const idx = str_time_axis.findIndex(str_t => str_t == String(t));
                    s.wave += wavedrom.signal[s_index].wave[idx];
                })
            }
            else if (t < interval.start) {
                this.memory_service.reached_start = false;
            }
            else if (t > interval.end) {
                this.memory_service.reached_start = false;
            }
        })
        return interval_wavedrom;
    }

    /**
     * Returns true if time is inside the interval.
     * If interval end value is unknown, interval starts from start value,
     * and if start value is unknown, interval ends at end value.
     * @param t time to evaluate
     * @param interval interval containing start and/or end values
     */
    isInside(t: number, interval: Interval) {
        if (t >= interval.start && t <= interval.end) {
            return true;
        }
        else if (isNotEmpty(interval.start) && isEmpty(interval.end) && t >= interval.start) {
            return true;
        }
        else if (isNotEmpty(interval.end) && isEmpty(interval.start) && t <= interval.end) {
            return true;
        }
        else return false;
    }

    manageStartTime(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, start: number) {
        interval_wavedrom = this.prependStartTime(interval_wavedrom, wavedrom, start);
        interval_wavedrom = this.replaceStartPointsWithValues(interval_wavedrom, wavedrom, start);
        return interval_wavedrom;
    }

    prependStartTime(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, start: number) {
        if (!interval_wavedrom.foot.tick.startsWith(start + " ")) {
            interval_wavedrom.foot.tick = start + " " + interval_wavedrom.foot.tick;
            interval_wavedrom.signal.forEach(signal => signal.wave = "." + signal.wave);
        }
        return interval_wavedrom;
    }

    replaceStartPointsWithValues(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, start: number) {
        const wavedrom_start_idx = this.getWaveDromIndexStart(wavedrom.foot.tick, start);
        interval_wavedrom.signal.forEach((signal, idx) => {
            if (signal.wave.startsWith('.')) {
                signal.wave = signal.wave.substr(1); // removes point
                const precedent_value = this.getPrecedentValue(wavedrom_start_idx,
                    wavedrom.signal[idx].wave);
                signal.wave = precedent_value + signal.wave;
            }
        })
        return interval_wavedrom;
    }

    /**
     * Returns the full wavedrom index of time equal (or just greater) to the
     * interval start time. Returns undefined if start time exceeds wavedrom max time.
     * @param wavedrom_tick Full wavedrom time axis
     * @param from Start time of the interval
     */
    getWaveDromIndexStart(wavedrom_tick: string, from: number) {
        const str_time_axis = wavedrom_tick.split(' ');
        let idx_start: number;
        for (let i = 0; i < str_time_axis.length; i++) {
            const t = Number(str_time_axis[i]);
            if (t >= 0 && t >= from) {
                idx_start = i;
                break;
            }
        }
        return idx_start;
    }

    getPrecedentValue(t: number, wave: string): string {
        const precedent_value = wave[t - 1];
        if (precedent_value == '.') {
            return this.getPrecedentValue(t - 1, wave);
        } else return precedent_value;
    }

    appendEndTime(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, to: number) {
        if (!interval_wavedrom.foot.tick.endsWith(to + " ")) {
            interval_wavedrom.foot.tick += to + " ";
            interval_wavedrom.signal.forEach(signal => signal.wave += ".");
        }
        return interval_wavedrom;
    }

    manageIntervalLimits(interval_wavedrom: WaveDrom) {
        if (this.memory_service.reached_start) {
            interval_wavedrom.foot.tick += "+ ";
        } else interval_wavedrom.foot.tick += "x ";
        if (this.memory_service.reached_start) {
            interval_wavedrom.foot.tick = "- " + interval_wavedrom.foot.tick;
            interval_wavedrom.signal.forEach(signal => signal.wave = "x" + signal.wave);
        }
        return interval_wavedrom;
    }

    combineWaveDroms(...wavedroms: WaveDrom[]) {
        const time_axes: number[][] = [];
        const signals: Wave[] = [];
        wavedroms.forEach(wavedrom => {
            const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
            time_axes.push(time_axis);
            wavedrom.signal.forEach(s => signals.push(s));
        })
        const combined_time_axis = this.combineTimeAxes(time_axes);
        const combined_wavedrom = this.initCombinedWaveDrom(signals, combined_time_axis);
        this.fillCombinedWaveDrom(combined_wavedrom, combined_time_axis, wavedroms);
        this.finalizeWaveDrom(combined_wavedrom);
        return combined_wavedrom;
    }

    private combineTimeAxes(time_axes: number[][]): number[] {
        let combined_time_axis: number[] = [];
        time_axes.forEach(time_axis => {
            time_axis.forEach(t => {
                if (!combined_time_axis.includes(t)) {
                    combined_time_axis.push(t);
                }
            })
        })
        combined_time_axis = combined_time_axis.sort((a, b) => a - b);
        return combined_time_axis;
    }

    private initCombinedWaveDrom(signals: Wave[], time_axis: number[]): WaveDrom {
        const combined_wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: ""
            }
        };
        combined_wavedrom.foot.tick = this.timeAxisToTick(time_axis);
        signals.forEach(s => {
            const signal: Wave = {
                name: s.name,
                wave: '.'.repeat(time_axis.length)
            };
            combined_wavedrom.signal.push(signal);
        })
        return combined_wavedrom;
    }

    fillCombinedWaveDrom(combined_wavedrom: WaveDrom, combined_time_axis: number[],
        wavedroms: WaveDrom[]) {
        let num_previous_signals: number;
        // For each time in the new axis...
        combined_time_axis.forEach((combined_t, i) => {
            num_previous_signals = 0;
            // find each signal corresponding value...
            wavedroms.forEach(wavedrom => {
                const str_time_axis = wavedrom.foot.tick.split(' ');
                const idx_value = str_time_axis.findIndex(str_t => str_t == String(combined_t));
                if (idx_value >= 0) {
                    const values = wavedrom.signal.map(signal => signal.wave[idx_value]);
                    // and put them in the combined wavedrom
                    values.forEach((value, j) => {
                        const signal = combined_wavedrom.signal[num_previous_signals + j];
                        signal.wave = this.replaceCharAt(signal.wave, i, value);
                    });
                }
                num_previous_signals += wavedrom.signal.length;
            })
        })
    }

    organizeIntoGroups(wavedrom: WaveDrom, input: WaveDrom, output: WaveDrom) {
        const new_wavedrom = {
            signal: [],
            foot: wavedrom.foot
        };
        const input_group = [];
        const output_group = [];

        if (input) {
            input.signal.forEach(input_signal => {
                const input_signal_found = wavedrom.signal.find(
                    signal => signal.name == input_signal.name);
                if (input_signal_found)
                    input_group.push(input_signal_found);
            });
            input_group.unshift("input");
            new_wavedrom.signal.push(input_group);
        }
        if (output) {
            output.signal.forEach(output_signal => {
                const output_signal_found = wavedrom.signal.find(
                    signal => signal.name == output_signal.name);
                if (output_signal_found)
                    output_group.push(output_signal_found);
            });
            output_group.unshift("output");
            new_wavedrom.signal.push(output_group);
        }
        return new_wavedrom;
    }

    /**
     * Returns a WaveDrom with the wanted signals. It does not
     * remove their events times from the absissa and points from other signals waves.
     * @param wavedrom WaveDrom to select the signals from.
     * @param signals Array of signals names to select.
     */
    selectWires(wavedrom: WaveDrom, signals: string[]) {
        const wavedrom_signals: WaveDrom = {
            signal: [],
            foot: wavedrom.foot
        };
        wavedrom.signal.forEach(s => {
            if (signals.includes(s.name)) {
                wavedrom_signals.signal.push(s);
            }
        })
        return wavedrom_signals;
    }

    setExtractionSent(extraction: WaveDromBase) {
        this.memory_service.simulation_sent = extraction;
    }

    getExtractionSentWires() {
        if (this.memory_service.simulation_sent && this.memory_service.simulation_sent.signal.length > 0) {
            const signal_groups: SignalGroup[] = [];
            this.getWires(this.memory_service.simulation_sent.signal, signal_groups);
            return signal_groups;
        } else return null;
    }

    searchWires(signal_groups: SignalGroup[], expression: string) {
        if (signal_groups) {
            signal_groups = signal_groups.map(signal_group => {
                const new_group = {
                    name: signal_group.name,
                    signals: signal_group.signals.filter(signal_name =>
                        signal_name.includes(expression)
                    )
                }
                return new_group.signals.length > 0 ? new_group : null;
            });
            signal_groups = signal_groups.filter(signal_group => signal_group != null);
            return signal_groups;
        } else return null;
    }

    /**
     * Returns a SignalGroup array containing the names of the signals
     * arranged by groups.
     * @param signals Array of signals or/and group of signals
     * @param output Array of signal groups corresponding to the signals
     * @param group_idx index of the group (0 by default)
     */
    getWires(signals: any[], output: SignalGroup[], group_idx?: number) {
        group_idx = group_idx ? group_idx : 0;
        if (signals[0]) {
            if (typeof signals[0] == "string") { // signals is a group
                if (!output[group_idx]) {
                    output[group_idx] = {};
                }
                output[group_idx].name = signals[0];
                this.getWires(signals.slice(1), output, group_idx);
            }
            else { // signals is an array of objects
                signals.forEach((element) => {
                    if (element.name) { // element is a signal object
                        if (!output[group_idx]) {
                            output[group_idx] = {};
                        }
                        if (!output[group_idx].signals) {
                            output[group_idx].signals = [];
                        }
                        output[group_idx].signals.push(element.name);
                    }
                    else { // element is an object so we get its signals
                        if (!output[group_idx]) {
                            this.getWires(element, output, group_idx);
                        }
                        else this.getWires(element, output, group_idx + 1);
                    }
                })
            }
        }
    }

    getSimulationInterval() {
        const interval: Interval = {
            start: this.getSimulationStart(),
            end: this.getSimulationEnd()
        };
        return interval;
    }

    getSimulationStart() {
        const time_array = this.getSimulationTimeArray();
        return time_array?.shift();
    }

    getSimulationTimeArray() {
        let time_array: number[];
        if (this.memory_service.full_simulation?.wavedrom) { // simu with result
            time_array = this.tickToTimeAxis(this.memory_service.full_simulation.wavedrom.foot.tick);
        }
        else if (this.memory_service.simulation?.wavedrom) { // only simu
            time_array = this.tickToTimeAxis(this.memory_service.simulation.wavedrom.foot.tick);
        }
        // else, no simulation extracted

        return time_array;
    }

    getSimulationEnd() {
        const time_array = this.getSimulationTimeArray();
        return time_array?.pop();
    }
}