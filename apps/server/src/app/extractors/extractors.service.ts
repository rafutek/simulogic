import * as fs from 'fs';
import {
    ExtractedSimulation, WaveDrom, Signal,
    Timestep, Wire
} from '@simulogic/core'

export class ExtractorsService {

    extracted_simu: ExtractedSimulation;
    extracted_simu_result: ExtractedSimulation;
    extracted_combination: ExtractedSimulation;

    getWaveDrom(id: number, file_path: string) {
        if (!this.extracted_simu || this.extracted_simu.id != id) {
            console.log("extract")
            const wavedrom = this.extractFile(file_path);
            if (wavedrom) {
                this.extracted_simu = {
                    id: id,
                    wavedrom: wavedrom
                };
            }
        }
        return this.extracted_simu.wavedrom;
    }

    getWaveDromResult(id: number, file_path: string) {
        if (!this.extracted_simu_result || this.extracted_simu_result.id != id) {
            console.log("extract result")
            const wavedrom = this.extractFile(file_path);
            if (wavedrom) {
                this.extracted_simu_result = {
                    id: id,
                    wavedrom: wavedrom
                };
            }
        }
        return this.extracted_simu_result.wavedrom;
    }

    getCombinedWaveDrom(id: number, simu_file_path: string, result_file_path: string) {
        if (!this.extracted_combination || this.extracted_combination.id != id) {
            console.log("combine")
            const wavedrom = this.getWaveDrom(id, simu_file_path);
            const wavedrom_result = this.getWaveDromResult(id, result_file_path);
            const combined_wavedrom = this.combineWaveDroms(wavedrom, wavedrom_result);
            if (combined_wavedrom) {
                this.extracted_combination = {
                    id: id,
                    wavedrom: combined_wavedrom
                };
            }
        }
        return this.extracted_combination.wavedrom;
    }

    extractFile(file_path: string) {
        const content = fs.readFileSync(file_path, 'utf8');
        return this.extract(content);
    }

    private extract(file_content: string) {
        const start = file_content.match(/START_TIME (.*)/)[1];
        const end = file_content.match(/END_TIME (.*)/)[1];
        const events = file_content.match(/EVENT (.*)/g);
        const timeline = this.extractTimeline(events);
        const wavedrom = this.createWaveDrom(start, end, timeline);
        return wavedrom;
    }

    private extractTimeline(events: string[]): Timestep[] {
        const timeline: Timestep[] = [];
        events.forEach((event) => {
            const parsed_event = event.replace('EVENT ', '').split(' ');
            const wire: Wire = {
                name: parsed_event[0],
                state: parsed_event[1],
            }
            const event_time = parseInt(parsed_event[2]);

            let add_new_timestep = true;
            timeline.forEach(timestep => {
                if (timestep.time == event_time) {
                    add_new_timestep = false;
                    timestep.wires.push(wire);
                }
            })
            if (add_new_timestep) {
                const new_timestep: Timestep = {
                    time: event_time,
                    wires: [wire]
                }
                timeline.push(new_timestep);
            }
        })
        return timeline;
    }

    private createWaveDrom(start: string, end: string, timeline: Timestep[]) {
        let wavedrom = this.initWaveDrom(parseInt(start), parseInt(end), timeline);
        wavedrom = this.fillWaveDrom(wavedrom, timeline);
        wavedrom = this.finalizeWaveDrom(wavedrom);
        return wavedrom;
    }

    private initWaveDrom(start: number, end: number, timeline: Timestep[]) {
        const time_axis = this.createTimeAxis(start, end, timeline);
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

    private createTimeAxis(start: number, end: number, timeline: Timestep[]) {
        const time_axis: number[] = [];
        timeline.forEach(timestep => {
            time_axis.push(timestep.time);
        })
        let i = 0;
        while (i < time_axis.length) {
            if (time_axis[i] <= start || time_axis[i] >= end) {
                time_axis.splice(i, 1);
            } else {
                i++;
            }
        }
        time_axis.unshift(start);
        time_axis.push(end);
        return time_axis;
    }

    private initSignals(wavedrom: WaveDrom, time_axis: number[], timeline: Timestep[]) {
        timeline.forEach(timestep => {
            timestep.wires.forEach(wire => {
                let add_new_signal = true;
                wavedrom.signal.forEach(signal => {
                    if (signal.name == wire.name) {
                        add_new_signal = false;
                    }
                })
                if (add_new_signal) {
                    const new_signal: Signal = {
                        name: wire.name,
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
                timestep.wires.forEach(wire => {
                    wavedrom.signal.forEach(signal => {
                        if (signal.name == wire.name) {
                            const new_wave = this.replaceCharAt(t,
                                this.stateToWave(wire.state), signal.wave);
                            signal.wave = new_wave;
                        }
                    })
                })
            }
        })
        return wavedrom;
    }

    private tickToTimeAxis(tick: string): number[] {
        const str_time_axis = tick.split(' ');
        if (str_time_axis[str_time_axis.length - 1] == '') {
            str_time_axis.pop();
        }
        if (str_time_axis[str_time_axis.length - 1] == 'x') {
            str_time_axis.pop();
        }
        return str_time_axis.map(str_time => parseInt(str_time));
    }

    private timeAxisToTick(time_axis: number[]): string {
        let tick = time_axis.join(' ');
        tick = tick.replace("NaN", 'x');
        tick += " x ";
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
        if (!wavedrom.foot.tick.startsWith('x')) {
            wavedrom.foot.tick = "x " + wavedrom.foot.tick;
        }
        if (!wavedrom.foot.tick.endsWith("x ")) {
            wavedrom.foot.tick = wavedrom.foot.tick + " x ";
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

    getWaveDromInterval(id: number, file_path: string, from: number, to: number) {
        const wavedrom = this.getWaveDrom(id, file_path);
        const interval_wavedrom = this.extractWaveDromInterval(wavedrom, from, to);
        return interval_wavedrom;
    }

    extractWaveDromInterval(wavedrom: WaveDrom, from: number, to: number) {
        if (wavedrom) {
            let interval_wavedrom = this.initIntervalWaveDrom(wavedrom);
            interval_wavedrom = this.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);
            interval_wavedrom = this.manageStartTime(interval_wavedrom, wavedrom, from);
            interval_wavedrom = this.appendEndTime(interval_wavedrom, wavedrom, to);
            interval_wavedrom.foot.tick += "x ";
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
            const new_signal: Signal = {
                name: signal.name,
                wave: ""
            };
            interval_wavedrom.signal.push(new_signal);
        })
        return interval_wavedrom;
    }

    fillIntervalWaveDrom(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, from: number, to: number) {
        const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
        time_axis.forEach((t, t_index) => {
            if (t >= from && t <= to) {
                interval_wavedrom.foot.tick += `${t} `;
                interval_wavedrom.signal.forEach((s, s_index) => {
                    s.wave += wavedrom.signal[s_index].wave[t_index];
                })
            }
        })
        return interval_wavedrom;
    }

    manageStartTime(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, from: number) {
        interval_wavedrom = this.prependStartTime(interval_wavedrom, wavedrom, from);
        interval_wavedrom = this.replaceStartPointsWithValues(interval_wavedrom, wavedrom, from);
        return interval_wavedrom;
    }

    prependStartTime(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, from: number) {
        if (!interval_wavedrom.foot.tick.startsWith(from + " ")) {
            interval_wavedrom.foot.tick = from + " " + interval_wavedrom.foot.tick;
            interval_wavedrom.signal.forEach(signal => signal.wave = "." + signal.wave);
        }
        return interval_wavedrom;
    }

    replaceStartPointsWithValues(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, from: number) {
        const wavedrom_start_idx = this.getWaveDromIndexStart(wavedrom.foot.tick, from);
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
        const time_axis = this.tickToTimeAxis(wavedrom_tick);
        let idx_start: number;
        for (let i = 0; i < time_axis.length; i++) {
            if (time_axis[i] >= from) {
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

    combineWaveDroms(...wavedroms: WaveDrom[]) {
        const time_axes: number[][] = [];
        const signals: Signal[] = [];
        wavedroms.forEach(wavedrom => {
            const time_axis = this.tickToTimeAxis(wavedrom.foot.tick);
            time_axes.push(time_axis);
            wavedrom.signal.forEach(s => signals.push(s));
        })
        const combined_time_axis = this.combineTimeAxes(time_axes);
        const combined_wavedrom = this.initCombinedWaveDrom(signals, combined_time_axis);
        combined_time_axis.forEach((combined_t, combined_t_idx) => {
            this.fillCombinedWaveDrom(combined_wavedrom, wavedroms,
                time_axes, combined_t, combined_t_idx);
        })
        this.replacePointWithX(combined_wavedrom.signal, 0);
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

    private initCombinedWaveDrom(signals: Signal[], time_axis: number[]): WaveDrom {
        const combined_wavedrom: WaveDrom = {
            signal: [],
            foot: {
                tick: ""
            }
        };
        combined_wavedrom.foot.tick = this.timeAxisToTick(time_axis);
        signals.forEach(s => {
            const signal: Signal = {
                name: s.name,
                wave: '.'.repeat(time_axis.length)
            };
            combined_wavedrom.signal.push(signal);
        })
        return combined_wavedrom;
    }

    private fillCombinedWaveDrom(combined_wavedrom: WaveDrom, wavedroms: WaveDrom[],
        time_axes: number[][], combined_t: number, combined_t_idx: number) {
        time_axes.forEach((t_axis, t_axis_idx) => {
            const t_idx = t_axis.indexOf(combined_t);
            combined_wavedrom = this.getAndPutValuesInCombinedWaveDrom(combined_wavedrom,
                wavedroms, combined_t_idx, t_axis_idx, t_idx);
        })
        return combined_wavedrom;
    }

    private getAndPutValuesInCombinedWaveDrom(combined_wavedrom: WaveDrom, wavedroms: WaveDrom[],
        combined_t_idx: number, t_axis_idx: number, t_idx: number) {
        if (t_idx >= 0) {
            const values_at_t = wavedroms[t_axis_idx].signal.map(s => s.wave[t_idx]);
            combined_wavedrom = this.putValuesInCombinedWaveDrom(combined_wavedrom,
                wavedroms, combined_t_idx, t_axis_idx, values_at_t);
        }
        return combined_wavedrom;
    }

    private putValuesInCombinedWaveDrom(combined_wavedrom: WaveDrom, wavedroms: WaveDrom[],
        combined_t_idx: number, t_axis_idx: number, values_at_t: string[]) {
        combined_wavedrom.signal.forEach((s, s_idx) => {
            let offset = 0;
            if (wavedroms[t_axis_idx - 1]) {
                offset = wavedroms[t_axis_idx - 1].signal.length;
            }
            const new_value = values_at_t[s_idx - offset];
            if (new_value) {
                s.wave = this.replaceCharAt(combined_t_idx, new_value, s.wave);
            }
        });
        return combined_wavedrom;
    }

    private replacePointWithX(signals: Signal[], idx: number) {
        return signals.map(s => {
            if (s.wave[idx] == '.') {
                s.wave = this.replaceCharAt(idx, 'x', s.wave);
            }
            return s;
        });
    }

    /**
     * Returns a WaveDrom with the wanted wires. It does not
     * remove their events times from the absissa and points from other wires waves.
     * @param wavedrom WaveDrom to select the wires from.
     * @param wires Array of wires names to select.
     */
    selectWires(wavedrom: WaveDrom, wires: string[]) {
        const wavedrom_wires: WaveDrom = {
            signal: [],
            foot: wavedrom.foot
        };
        wavedrom.signal.forEach(s => {
            if(wires.includes(s.name)){
                wavedrom_wires.signal.push(s);
            }
        })
        return wavedrom_wires;
    }
}