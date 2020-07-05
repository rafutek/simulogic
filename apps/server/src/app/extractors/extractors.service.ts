import * as fs from 'fs';
import * as readline from 'readline';
import {
    ExtractedSimulation, WaveDrom, Signal,
    Timestep, Wire, Event
} from '@simulogic/core'

export class ExtractorsService {

    extractedSimulation: ExtractedSimulation;

    getWaveDromInterval(id: string, file_path: string, from: number, to: number) {
        const wavedrom = this.getWaveDrom(id, file_path);
        const interval_wavedrom = this.extractWaveDromInterval(wavedrom, from, to);
    }

    getWaveDrom(id: string, file_path: string) {
        if (!this.extractedSimulation || this.extractedSimulation.id != id) {
            console.log("extract")
            this.extractedSimulation = {
                id: id,
                wavedrom: this.extractFile(file_path)
            };
        }
        return this.extractedSimulation.wavedrom;
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
        const time_axis = wavedrom.foot.tick.split(' ');
        timeline.forEach((timestep) => {
            const t = time_axis.indexOf(String(timestep.time));
            if (t >= 0) {
                timestep.wires.forEach(wire => {
                    wavedrom.signal.forEach(signal => {
                        if (signal.name == wire.name) {
                            const new_wave = signal.wave.substring(0, t) + this.stateToWave(wire.state) + signal.wave.substring(t + 1);
                            signal.wave = new_wave;
                        }
                    })
                })
            }
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

    private finalizeWaveDrom(wavedrom: WaveDrom) {
        wavedrom.foot.tick = `x ${wavedrom.foot.tick} x `;
        wavedrom.signal.forEach(signal => {
            signal.wave = `x${signal.wave}x`;
        })
        return wavedrom;
    }

    private extractWaveDromInterval(wavedrom: WaveDrom, from: number, to: number) {
        if (wavedrom) {
            console.log(wavedrom)
            let interval_wavedrom = this.initIntervalWaveDrom(wavedrom);
            interval_wavedrom = this.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);
            interval_wavedrom = this.manageStartTime(interval_wavedrom, wavedrom, from);
            console.log(interval_wavedrom)
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
        const time_axis = wavedrom.foot.tick.split(' ').map(str_time => parseInt(str_time));
        time_axis.forEach((t, t_index) => {
            if (t >= from && t <= to) {
                interval_wavedrom.foot.tick += `${t} `;
                interval_wavedrom.signal.map((s, s_index) => {
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
            interval_wavedrom.signal.map(signal => signal.wave = "." + signal.wave);
        }
        return interval_wavedrom;
    }

    replaceStartPointsWithValues(interval_wavedrom: WaveDrom, wavedrom: WaveDrom, from: number) {
        const wavedrom_start_idx = this.getWaveDromIndexStart(wavedrom.foot.tick, from);
        interval_wavedrom.signal.forEach((s, idx) => {
            if (s.wave[0] == '.') {
                s.wave = s.wave.substr(1); // removes point
                const precedent_value = this.getPrecedentValue(wavedrom_start_idx,
                    wavedrom.signal[idx].wave);
                s.wave = precedent_value + s.wave;
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
        const time_axis = wavedrom_tick.split(' ').map(str_time => parseInt(str_time));
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

}