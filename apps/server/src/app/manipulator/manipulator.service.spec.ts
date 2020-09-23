import { ManipulatorService } from './manipulator.service'
import { WaveDrom, SignalWave, WaveDromBase, SignalGroup, Interval } from '@simulogic/core';
import { Test, TestingModule } from '@nestjs/testing';
import { MemoryService } from '../memory/memory.service';

describe("ManipulatorService", () => {
  let manipulator: ManipulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManipulatorService, MemoryService]
    }).compile();

    manipulator = module.get<ManipulatorService>(ManipulatorService);
  });

  it('should be defined', () => {
    expect(manipulator).toBeDefined();
  });

  describe("Interval WaveDrom Tests", () => {
    const wavedrom: WaveDrom = {
      signal: [],
      foot: {
        tick: "- 0 100 200 350 670 + "
      }
    };
    const s1: SignalWave = {
      name: "s1",
      wave: "x0.1..x"
    };
    const s2: SignalWave = {
      name: "s2",
      wave: "x.1.01x"
    };
    wavedrom.signal.push(s1, s2);

    describe("initIntervalWaveDrom", () => {

      it("should initialize the interval wavedrom", () => {
        // Given a wavedrom with two signals
        // When initilizing the interval wavedrom
        const interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);

        // Then the initialized interval wavedrom must be
        const expected_wavedrom: WaveDrom = {
          signal: [{ name: s1.name, wave: "" }, { name: s2.name, wave: "" }],
          foot: { tick: "" }
        }
        expect(interval_wavedrom).toEqual(expected_wavedrom);
      });
    });

    describe("fillIntervalWaveDrom", () => {

      it("should contain included events", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        const interval: Interval = { start: 90, end: 250 };
        const interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // Then the interval wavedrom must be
        const expected_wavedrom: WaveDrom = {
          signal: [{ name: s1.name, wave: ".1" }, { name: s2.name, wave: "1." }],
          foot: { tick: "100 200 " }
        }
        expect(interval_wavedrom).toEqual(expected_wavedrom);
      });

      it("should respect interval inclusion rule", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        // with events occuring at these exact same time
        const interval: Interval = { start: 100, end: 200 };
        const interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // Then the interval wavedrom must be
        const expected_wavedrom: WaveDrom = {
          signal: [{ name: s1.name, wave: ".1" }, { name: s2.name, wave: "1." }],
          foot: { tick: "100 200 " }
        }
        expect(interval_wavedrom).toEqual(expected_wavedrom);
      });

      it("should contain all next events", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        // with events occuring at these exact same time
        const interval: Interval = { start: 100, end: 10000 };
        const interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // Then the interval wavedrom must contain all events
        // except those before 100
        const expected_wavedrom: WaveDrom = {
          signal: [{ name: s1.name, wave: ".1.." }, { name: s2.name, wave: "1.01" }],
          foot: { tick: "100 200 350 670 " }
        }
        expect(interval_wavedrom).toEqual(expected_wavedrom);
      });
    });

    describe("prependStartTime", () => {
      it("should prepend interval start value at tick and point at each wave", () => {
        // Given a filled wavedrom with the start interval value not included
        let interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);
        const interval: Interval = { start: 90, end: 250 };
        interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = manipulator.prependStartTime(interval_wavedrom, interval.start);

        // Then the start interval value (90 here) must be added at the beginning of tick
        // and all the waves must start with a point
        const prepended_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length + 1;
        });
        expect(prepended_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.startsWith(interval.start + ' ')).toBeTruthy();
        const waves_start_with_point = interval_wavedrom.signal.every(signal => {
          return signal.wave[0] == '.'
        });
        expect(waves_start_with_point).toBeTruthy();
      });

      it("should not prepend interval start value at tick and point at each wave", () => {
        // Given a filled wavedrom with the start interval value included
        let interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);
        const interval: Interval = { start: 100, end: 250 };
        interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = manipulator.prependStartTime(interval_wavedrom, interval.start);

        // Then the start interval value (100 here) must already be at the beginning of tick
        // and the waves must start with their value at this time
        const did_not_prepend_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length;
        });
        expect(did_not_prepend_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.startsWith(interval.start + ' ')).toBeTruthy();
        expect(interval_wavedrom.signal[0].wave[0]).toEqual('.');
        expect(interval_wavedrom.signal[1].wave[0]).toEqual('1');
      });
    });

    describe("replaceStartPointsWithValues", () => {
      it("should replace the points with precedent values", () => {
        // Given a filled interval wavedrom with one wave starting with a point
        let interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);
        const interval: Interval = { start: 100, end: 250 };
        interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);
        expect(interval_wavedrom.signal[0].wave[0]).toEqual('.');
        expect(interval_wavedrom.signal[1].wave[0]).toEqual('1');

        // When replacing the wave starting point
        interval_wavedrom = manipulator.replaceStartPointsWithValues(interval_wavedrom,
          wavedrom, interval.start);

        // Then the point must be replaced by the precedent meaningfull values
        // and the other wave first value must be the same
        expect(interval_wavedrom.signal[0].wave[0]).toEqual('0');
        expect(interval_wavedrom.signal[1].wave[0]).toEqual('1');
      })

      describe('getPrecedentValue', () => {
        it("should return the precedent meaningfull value", () => {
          // Given a wave and a time value
          const wave = "x01....x", t = 5;

          // When getting the precedent meaningfull value
          const precedent_value = manipulator.getPrecedentValue(t, wave);

          // Then the precedent value should have this value
          const expected_precedent_value = '1';
          expect(precedent_value).toEqual(expected_precedent_value);
        });

        it("should return an undefined value", () => {
          // Given a time value and a wave not containing precedent value before this time
          const wave = ".......x", t = 5;

          // When getting the precedent meaningfull value
          const precedent_value = manipulator.getPrecedentValue(t, wave);

          // Then the precedent value should be undefined
          const expected_precedent_value = undefined;
          expect(precedent_value).toEqual(expected_precedent_value);
        });
      });
    });

    describe("appendEndTime", () => {
      it("should append interval end value at tick and point at each wave", () => {
        // Given a filled wavedrom with the end interval value not included
        let interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);
        const interval: Interval = { start: 90, end: 250 };
        interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = manipulator.appendEndTime(interval_wavedrom, interval.end);

        // Then the start interval value (90 here) must be added at the beginning of tick
        // and all the waves must start with a point
        const appended_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length + 1;
        });
        expect(appended_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.endsWith(interval.end + ' ')).toBeTruthy();
        const waves_end_with_point = interval_wavedrom.signal.every(signal => {
          return signal.wave.endsWith('.');
        });
        expect(waves_end_with_point).toBeTruthy();
      });

      it("should not append interval end value at tick and point at each wave", () => {
        // Given a filled wavedrom with the start interval value included
        let interval_wavedrom = manipulator.initIntervalWaveDrom(wavedrom);
        const interval: Interval = { start: 90, end: 200 };
        interval_wavedrom = manipulator.initAndFillIntervalWaveDrom(wavedrom, interval);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = manipulator.appendEndTime(interval_wavedrom, interval.end);

        // Then the start interval value (100 here) must already be at the beginning of tick
        // and the waves must start with their value at this time
        const did_not_append_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length;
        });
        expect(did_not_append_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.endsWith(interval.end + ' ')).toBeTruthy();
        expect(interval_wavedrom.signal[0].wave.endsWith('1')).toBeTruthy();
        expect(interval_wavedrom.signal[1].wave.endsWith('.')).toBeTruthy();
      });
    });
  });

  describe("combineWavedroms", () => {
    it("should combine wavedroms", () => {
      // Given two wavedroms with different signals and time axis
      const s1: SignalWave = { name: "s1", wave: "x01..2.1x" };
      const s2: SignalWave = { name: "s2", wave: "x0...1..x" };
      const wavedrom1: WaveDrom = {
        signal: [s1, s2],
        foot: { tick: "- 0 10 11 20 25 39 40 + " }
      };

      const s3: SignalWave = { name: "s3", wave: "x0.1.0.2567.x" };
      const wavedrom2: WaveDrom = {
        signal: [s3],
        foot: { tick: "- 30 40 100 111 120 123 200 205 206 207 230 + " }
      };

      // When combining the thwo wavedroms
      const combined_wavedrom = manipulator.combineWaveDroms(wavedrom1, wavedrom2);

      // Then we should have this resulting wavedrom
      s1.wave = "x01..2..1.........x";
      s2.wave = "x0...1............x";
      s3.wave = "x.....0..1.0.2567.x";
      const expected_wavedrom: WaveDrom = {
        signal: [s1, s2, s3],
        foot: {
          tick: "- 0 10 11 20 25 30 39 40 100 111 120 123 200 205 206 207 230 + "
        }
      };
      expect(combined_wavedrom).toEqual(expected_wavedrom);
    });
  });

  describe("selectWires", () => {
    it("should select wanted signals", () => {
      // Given a wavedrom with some signals
      const s1: SignalWave = { name: "s1", wave: "x010..1x" };
      const s2: SignalWave = { name: "s2", wave: "x10...0x" };
      const s3: SignalWave = { name: "s3", wave: "x1.0.1.x" };
      const s4: SignalWave = { name: "s4", wave: "x.1.0.1x" };
      const initial_wavedrom: WaveDrom = {
        signal: [s1, s2, s3, s4],
        foot: { tick: "- 12 28 45 76 79 81 90 + " }
      };

      // When selecting these signals
      const signals = ["s1", "s3"];
      const new_wavedrom = manipulator.selectSignals(initial_wavedrom, signals);

      // Then this should be the resulting wavedrom
      const expected_wavedrom: WaveDrom = {
        signal: [s1, s3],
        foot: initial_wavedrom.foot
      };
      expect(new_wavedrom).toEqual(expected_wavedrom);
    });
  });

  describe("getWires", () => {
    let s1: SignalWave, s2: SignalWave, s3: SignalWave, s4: SignalWave;
    let initial_wavedrom: WaveDromBase;

    beforeEach(() => {
      s1 = { name: "s1", wave: "" };
      s2 = { name: "s2", wave: "" };
      s3 = { name: "s3", wave: "" };
      s4 = { name: "s4", wave: "" };
      initial_wavedrom = {
        signal: [],
        foot: { tick: "" }
      };
    })

    it("should return a signal group without name", () => {
      // Given a wavedrom without groups
      initial_wavedrom.signal.push(s1, s2, s3, s4);

      // When getting the signals
      const result: SignalGroup[] = [];
      manipulator.getGroupedSignals(initial_wavedrom.signal, result);

      // Then we should have
      const group: SignalGroup = {
        signals: ["s1", "s2", "s3", "s4"]
      };
      const expected = [group];

      expect(result).toEqual(expected);

    });

    it("should return signal groups with names", () => {
      // Given a wavedrom with a signal group
      const group1 = ["input", s1, s2];
      const group2 = ["output", s3, s4];
      initial_wavedrom.signal.push(group1, group2);

      // When getting the signals
      const result: SignalGroup[] = [];
      manipulator.getGroupedSignals(initial_wavedrom.signal, result);

      // Then we should have on group with a name and another without
      const input_group: SignalGroup = {
        name: "input",
        signals: ["s1", "s2"]
      };
      const output_group: SignalGroup = {
        name: "output",
        signals: ["s3", "s4"]
      };
      const expected = [input_group, output_group];

      expect(result).toEqual(expected);

    });

  });
});
