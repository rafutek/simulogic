import * as fs from 'fs';
import {
    WaveDrom, Wave,
    Timestep, Signal, WaveDromBase, SignalGroup, Interval
} from '@simulogic/core'
import { isEmpty, isNotEmpty } from 'class-validator';
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
        const all_events = events.concat(clocks_events);
        if (isEmpty(all_events) || all_events.length == 0) {
            throw new Error("No events were found in the simulation file");
        }
        const timeline = this.extractTimeline(all_events);
        const wavedrom = this.createWaveDrom(interval, timeline);
        return wavedrom;
    }

    /**
     * Returns an interval containing start and end values.
     * Throws an error if those variables are not valid.
     * @param start string containing the interval start time
     * @param end string containing the interval end time
     */
    private stringToInterval(start: string, end: string) {
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

    private clocksToEvents(clocks: string[], interval: Interval): string[] {
        let clocks_events: string[] = [];
        if (clocks?.length > 0) {
            clocks.forEach(clock => {
                clocks_events = clocks_events.concat(this.clockToEvents(clock, interval));
            })
        }
        return clocks_events;
    }

    private clockToEvents(clock: string, interval: Interval): string[] {
        const clock_events: string[] = [];
        const parsed_clock = clock.replace('CLOCK ', '').split(' ');
        if (parsed_clock?.length == 4) {
            const name = parsed_clock[0];
            const first_up_time = parseInt(parsed_clock[1]);
            const period = parseInt(parsed_clock[2]);
            const up_duration = parseInt(parsed_clock[3]) / 100 * period;

            let up_time = first_up_time;
            let down_time: number;
            let stop = false;
            if (first_up_time >= interval.start && period > 0 && up_duration > 0) {
                do {
                    if (up_time <= interval.end) {
                        clock_events.push(`EVENT ${name} T ${up_time}`);
                        down_time = up_time + up_duration;
                        if (down_time <= interval.end) {
                            clock_events.push(`EVENT ${name} F ${down_time}`);
                            up_time += period;
                        } else stop = true;
                    } else stop = true;
                } while (!stop);
            }
        }
        return clock_events;
    }

    private extractTimeline(events: string[]): Timestep[] {
        let timeline: Timestep[] = [];
        events.forEach((event) => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const signal: Signal = {
                name: parsed_event[0],
                state: parsed_event[1],
            }
            const event_time = parseInt(parsed_event[2]);

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
                timeline.push(new_timestep);
            }
        })

        timeline = timeline.sort(this.compare_timesteps);

        return timeline;
    }

    private compare_timesteps(t1: Timestep, t2: Timestep) {
        if (t1.time < t2.time) {
            return -1;
        }
        if (t1.time > t2.time) {
            return 1;
        }
        return 0;
    }

    private createWaveDrom(interval: Interval, timeline: Timestep[]) {
        let wavedrom = this.initWaveDrom(interval, timeline);
        wavedrom = this.fillWaveDrom(wavedrom, timeline);
        wavedrom = this.finalizeWaveDrom(wavedrom);
        return wavedrom;
    }

    private initWaveDrom(interval: Interval, timeline: Timestep[]) {
        const time_axis = this.createTimeAxis(interval, timeline);
        let wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: ""
            }
        };
        wavedrom.foot.tick = time_axis.join(" ");
        wavedrom = this.initSignals(wavedrom, time_axis, timeline);
        return wavedrom;
    }

    private createTimeAxis(interval: Interval, timeline: Timestep[]) {
        const time_axis: number[] = [];
        timeline.forEach(timestep => {
            time_axis.push(timestep.time);
        })
        let i = 0;
        while (i < time_axis.length) {
            if (time_axis[i] <= interval.start || time_axis[i] >= interval.end) {
                time_axis.splice(i, 1);
            } else {
                i++;
            }
        }
        time_axis.unshift(interval.start);
        time_axis.push(interval.end);
        return time_axis;
    }

    private initSignals(wavedrom: WaveDrom, time_axis: number[], timeline: Timestep[]) {
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
                        wave: ".".repeat(time_axis.length - 1)
                    };
                    wavedrom.signal.push(new_signal);
                }
            })
        })
        return wavedrom;
    }

    private fillWaveDrom(wavedrom: WaveDrom, timeline: Timestep[]) {
        const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
        timeline.forEach((timestep) => {
            const t = time_axis.indexOf(timestep.time);
            if (t >= 0) {
                timestep.signals.forEach(s_t => {
                    wavedrom.signal.forEach(s_w => {
                        if (s_w.name == s_t.name) {
                            const new_wave = this.replaceCharAt(t,
                                this.stateToWave(s_t.state), s_w.wave);
                            s_w.wave = new_wave;
                        }
                    })
                })
            }
        })
        return wavedrom;
    }

    private tickToTimeAxis(tick: string): number[] {
        const str_time_axis = tick.split(' ').filter(t => t && !isNaN(Number(t)));
        return str_time_axis.map(str_time => parseInt(str_time));
    }

    private timeAxisToTick(time_axis: number[]): string {
        let tick = time_axis.join(' ');
        tick = `- ${tick} + `;
        return tick;
    }

    private replaceCharAt(idx: number, char: string, str: string) {
        return str.substring(0, idx) + char + str.substring(idx + 1);
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
                        signal.wave = this.replaceCharAt(i, value, signal.wave);
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