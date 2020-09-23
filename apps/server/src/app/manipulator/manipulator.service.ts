import * as fs from 'fs';
import {
    WaveDrom, SignalWave, WaveDromBase, SignalGroup, Interval
} from '@simulogic/core'
import { isEmpty, isNotEmpty } from 'class-validator';
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

    /**
     * Returns an empty WaveDrom variable containing only the signal names.
     * @param wavedrom WaveDrom variable used to get an interval from
     */
    initIntervalWaveDrom(wavedrom: WaveDrom) {
        const interval_wavedrom: WaveDrom = {
            signal: [],
            foot: { tick: "" }
        };
        wavedrom.signal.forEach(signal => {
            const new_signal: SignalWave = { name: signal.name, wave: "" };
            interval_wavedrom.signal.push(new_signal);
        })
        return interval_wavedrom;
    }

    /**
     * Returns a WaveDrom variable filled with events occuring inside the time interval.
     * For each time included in the interval (added to the interval wavedrom abcsissa),
     * it takes the wave state of each signal and adds it to the corresponding interval wavedrom signal wave.
     * @param wavedrom WaveDrom variable to get an interval from
     * @param interval variable containing start and end values
     */
    initAndFillIntervalWaveDrom(wavedrom: WaveDrom, interval: Interval) {
        const interval_wavedrom = this.initIntervalWaveDrom(wavedrom);
        this.memory_service.reached_start = true;
        this.memory_service.reached_end = true;
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
                this.memory_service.reached_end = false;
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

    cutWaveDrom(wavedrom: WaveDrom, interval: Interval) {
        const interval_wavedrom = this.initAndFillIntervalWaveDrom(wavedrom, interval);
        if (isNotEmpty(interval.start)) {
            this.prependStartTime(interval_wavedrom, interval.start);
            this.replaceStartPointsWithValues(interval_wavedrom, wavedrom, interval.start);
        }
        if (isNotEmpty(interval.end)) {
            this.appendEndTime(interval_wavedrom, interval.end);
        }
        this.manageIntervalLimits(interval_wavedrom);
        return interval_wavedrom;
    }

    /**
     * Returns the WaveDrom variable with interval start time.
     * It adds (if not present) the start time at the beginning of the abscissa
     * and a point before each signal wave.
     * @param interval_wavedrom WaveDrom variable to modify
     * @param start time interval beginning value
     */
    prependStartTime(interval_wavedrom: WaveDrom, start: number) {
        if (!interval_wavedrom.foot.tick.startsWith(start + " ")) {
            interval_wavedrom.foot.tick = start + " " + interval_wavedrom.foot.tick;
            interval_wavedrom.signal.forEach(signal => signal.wave = "." + signal.wave);
        }
        return interval_wavedrom;
    }

    /**
     * Returns the WaveDrom variable with interval end time.
     * It adds (if not present) the end time at the end of the abscissa
     * and a point after each signal wave.
     * @param interval_wavedrom WaveDrom variable to modify
     * @param end time interval end value
     */
    appendEndTime(interval_wavedrom: WaveDrom, end: number) {
        if (!interval_wavedrom.foot.tick.endsWith(end + " ")) {
            interval_wavedrom.foot.tick += end + " ";
            interval_wavedrom.signal.forEach(signal => signal.wave += ".");
        }
        return interval_wavedrom;
    }

    /**
     * Returns the WaveDrom variable with '.' at the beginning of waves
     * replaced by last meaningful values. Indeed, a point means 'last value'
     * so it's not a valid state at the first position.
     * @param interval_wavedrom WaveDrom variable to modify
     * @param wavedrom WaveDrom variable containing the simulation
     * @param start time interval beginning value
     */
    replaceStartPointsWithValues(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, start: number) {
        const wavedrom_start_idx = this.getWaveDromIndexStart(wavedrom.foot.tick, start);
        interval_wavedrom.signal.forEach((signal, idx) => {
            if (signal.wave.startsWith('.')) {
                signal.wave = signal.wave.substr(1); // removes point
                const precedent_value = this.getPrecedentValue(wavedrom_start_idx, wavedrom.signal[idx].wave);
                signal.wave = precedent_value + signal.wave;
            }
        })
        return interval_wavedrom;
    }

    /**
     * Returns the index of time equal (or just greater) to the interval start time.
     * Returns undefined if start time exceeds tick max time.
     * @param tick WaveDrom variable abscissa (ex: "- 0 10 100 150 +")
     * @param start time interval beginning value (ex: 15 -> returns 100)
     */
    getWaveDromIndexStart(tick: string, start: number) {
        const str_time_axis = tick.split(' ');
        let idx_start: number;
        for (let i = 0; i < str_time_axis.length; i++) {
            const t = Number(str_time_axis[i]);
            if (t >= 0 && t >= start) {
                idx_start = i;
                break;
            }
        }
        return idx_start;
    }

    /**
     * Returns the previous meaningfull value (not a point)
     * beginning at given index.
     * @param t index to search from
     * @param wave string containing the signal
     */
    getPrecedentValue(t: number, wave: string): string {
        const precedent_value = wave[t - 1];
        if (precedent_value == '.') {
            return this.getPrecedentValue(t - 1, wave);
        } else return precedent_value;
    }

    /**
     * Adds '-' at the beginning of abscissa if memory service variable 'reached_start' is true.
     * Adds '+' at the end of abscissa if memory service variable 'reached_end' is true.
     * Else, adds 'x'.
     * @param interval_wavedrom WaveDrom variable to modify
     */
    manageIntervalLimits(interval_wavedrom: WaveDrom) {
        if (this.memory_service.reached_end) {
            interval_wavedrom.foot.tick += "+ ";
        } else interval_wavedrom.foot.tick += "x ";
        if (this.memory_service.reached_start) {
            interval_wavedrom.foot.tick = "- " + interval_wavedrom.foot.tick;
            interval_wavedrom.signal.forEach(signal => signal.wave = "x" + signal.wave);
        }
        return interval_wavedrom;
    }

    /**
     * Returns a WaveDrom variable containing the multiple WaveDrom variables given.
     * @param wavedroms list of WaveDom variables to combine
     */
    combineWaveDroms(...wavedroms: WaveDrom[]) {
        const { combined_wavedrom, combined_time_axis } = this.initCombinedWaveDrom(wavedroms);
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
        return this.finalizeWaveDrom(combined_wavedrom);
    }

    /**
     * Returns a WaveDrom variable and an array of numbers.
     * The WaveDrom variable contains the signals of each WaveDrom variable to combine
     * (initialized with their name and a wave full of points).
     * The array of numbers is the combination of each WaveDrom variable abscissa.
     * @param wavedroms Array of WaveDrom variable to combine
     */
    private initCombinedWaveDrom(wavedroms: WaveDrom[]) {
        const time_axes: number[][] = [];
        const signals: SignalWave[] = [];
        wavedroms.forEach(wavedrom => {
            const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
            time_axes.push(time_axis);
            wavedrom.signal.forEach(s => signals.push(s));
        })
        const combined_time_axis = this.combineTimeAxes(time_axes);
        const combined_wavedrom: WaveDrom = {
            signal: [],
            foot: { tick: this.timeAxisToTick(combined_time_axis) }
        };
        signals.forEach(s => {
            const signal: SignalWave = { name: s.name, wave: '.'.repeat(combined_time_axis.length) };
            combined_wavedrom.signal.push(signal);
        })
        return { combined_wavedrom, combined_time_axis };
    }

    /**
     * Returns an array of numbers containing all the numbers (once) of given matrix.
     * Used to combine the axis of each WaveDrom variable.
     * @param time_axes array of arrays of numbers
     */
    private combineTimeAxes(time_axes: number[][]): number[] {
        let combined_time_axis: number[] = [];
        time_axes.forEach(time_axis => {
            time_axis.forEach(t => {
                if (!combined_time_axis.includes(t)) {
                    combined_time_axis.push(t);
                }
            })
        })
        return combined_time_axis.sort((a, b) => a - b);
    }

    /**
     * Returns a special WaveDrom variable containing grouped input and output signals.
     * This type of WaveDrom variable should not be manipulated.
     * @param wavedrom WaveDrom variable contaning all the signals
     * @param input WaveDrom variable contaning only the input signals
     * @param output WaveDrom variable contaning only the output signals
     */
    groupInputOutput(wavedrom: WaveDrom, input: WaveDrom, output: WaveDrom): WaveDromBase {
        const new_wavedrom = {
            signal: [],
            foot: wavedrom.foot
        };
        if (input) {
            const input_group = this.groupSignals(wavedrom.signal, input.signal, "input");
            new_wavedrom.signal.push(input_group);
        }
        if (output) {
            const output_group = this.groupSignals(wavedrom.signal, output.signal, "output");
            new_wavedrom.signal.push(output_group);
        }
        return new_wavedrom;
    }

    /**
     * Returns an array containing the signals to group (found in 'all_signals' variable)
     * with the group name at the first position.
     * @param all_signals Array containing all the WaveDrom signals
     * @param signals_to_group Array containing only the WaveDrom signals to group
     * @param group_name name of the group
     */
    private groupSignals(all_signals: SignalWave[], signals_to_group: SignalWave[], group_name: string) {
        const group = [];
        signals_to_group.forEach(s => {
            const present = all_signals.find(signal => signal.name == s.name);
            if (present) {
                group.push(present);
            }
        });
        group.unshift(group_name);
        return group;
    }

    /**
     * Returns a WaveDrom with the wanted signals. It does not
     * remove their events times from the absissa and points from other signals waves.
     * @param wavedrom WaveDrom to select the signals from.
     * @param signals Array of signals names to select.
     */
    selectSignals(wavedrom: WaveDrom, signals: string[]) {
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

    /**
     * Sets and returns a special WaveDrom variable.
     * This variable is stored in memory service for later use.
     * @param wavedrom special WaveDrom variable to remember
     */
    setFinalWaveDrom(wavedrom: WaveDromBase) {
        this.memory_service.simulation_sent = wavedrom;
        return this.memory_service.simulation_sent;
    }

    /**
     * Returns an array of grouped signals.
     * Each grouped signals contains the group name (like 'input') and an array of signal names.
     */
    getFinalWaveDromSignals() {
        if (this.memory_service.simulation_sent && this.memory_service.simulation_sent.signal.length > 0) {
            const signal_groups: SignalGroup[] = [];
            this.getGroupedSignals(this.memory_service.simulation_sent.signal, signal_groups);
            return signal_groups;
        } else return null;
    }

    /**
     * Returns an array of grouped signals which signal names contain the expression.
     * @param signal_groups array of grouped signals to search into
     * @param expression expression to search
     */
    searchSignals(signal_groups: SignalGroup[], expression: string) {
        if (signal_groups) {
            signal_groups = signal_groups.map(signal_group => {
                const new_group = {
                    name: signal_group.name,
                    signals: signal_group.signals.filter(signal_name => signal_name.includes(expression))
                }
                return new_group.signals.length > 0 ? new_group : null;
            });
            return signal_groups.filter(signal_group => signal_group != null);
        } else return null;
    }

    /**
     * Iterates over signals variable to find grouped signals and fills output variable.
     * @param signals special WaveDrom variable signals (grouped by name)
     * @param output Array of signal groups to fill
     * @param group_idx index of the group (0 by default)
     */
    getGroupedSignals(signals: any[], output: SignalGroup[], group_idx?: number) {
        group_idx = group_idx ? group_idx : 0;
        if (signals[0]) {
            if (typeof signals[0] == "string") { // signals is a group
                if (!output[group_idx]) {
                    output[group_idx] = {};
                }
                output[group_idx].name = signals[0];
                this.getGroupedSignals(signals.slice(1), output, group_idx);
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
                            this.getGroupedSignals(element, output, group_idx);
                        }
                        else this.getGroupedSignals(element, output, group_idx + 1);
                    }
                })
            }
        }
    }

    /**
     * Returns an interval containing the limits (start and end)
     * of the last (combined if present) simulation saved in memory service.
     */
    getLastSimulationLimits() {
        const last_time_axis = this.getLastTimeAxis();
        const last_interval: Interval = {
            start: last_time_axis?.shift(),
            end: last_time_axis?.pop()
        };
        return last_interval;
    }

    /**
     * Returns the array of numbers corresponding to the last simulation abscissa.
     * The last simulation is saved in memory service 'full_simulation' or 'simulation' variables.
     */
    getLastTimeAxis() {
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
}