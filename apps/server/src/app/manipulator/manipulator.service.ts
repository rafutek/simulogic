import * as fs from 'fs';
import {
    WaveDrom, Wave,
    Timestep, Signal, WaveDromBase, SignalGroup, Interval, Clock
} from '@simulogic/core'
import { isEmpty, isInt, isNegative, isNotEmpty } from 'class-validator';
import { MemoryService } from '../memory/memory.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ManipulatorService {
    constructor(
        private memory_service: MemoryService
    ) { }

    /**
     * Converts a string like "- 0 10 100 + " to an array like [0, 10, 100].
     * @param tick string containing the simulation events times
     */
    tickToTimeAxis(tick: string): number[] {
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
    replaceCharAt(str: string, idx: number, char: string) {
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
     * Returns the WaveDrom variable with '-' and '+ signs around abscissa,
     * and 'x' around each signal wave. 
     * '-' and '+' signs represents the simulation beginning and ending,
     * while 'x' represents an unknown state.
     * @param wavedrom WaveDrom variable to modify
     */
    finalizeWaveDrom(wavedrom: WaveDrom) {
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