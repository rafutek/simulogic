import { ExtractorsService } from './extractors.service'
import { WaveDrom, Signal } from '@simulogic/core';

describe('SimulationExtractor', () => {
  let extractor: ExtractorsService;

  beforeEach(() => {
    extractor = new ExtractorsService();
  });

  describe('Interval WaveDrom Tests', () => {
    const wavedrom: WaveDrom = {
      signal: [],
      foot: {
        tick: "x 0 100 200 350 670 x "
      }
    };
    const s1: Signal = {
      name: "s1",
      wave: "x0.1..x"
    };
    const s2: Signal = {
      name: "s2",
      wave: "x.1.01x"
    };
    wavedrom.signal.push(s1, s2);

    describe('initIntervalWaveDrom', () => {

      it("should initialize the interval wavedrom", () => {
        // Given a wavedrom with two signals
        // When initilizing the interval wavedrom
        const interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);

        // Then the interval wavedrom must respect these conditions
        expect(interval_wavedrom.foot.tick).toEqual("");
        expect(interval_wavedrom.signal[0].name == s1.name &&
          interval_wavedrom.signal[0].wave == "").toBeTruthy();
        expect(interval_wavedrom.signal[1].name == s2.name &&
          interval_wavedrom.signal[1].wave == "").toBeTruthy();
      });
    });

    describe('fillIntervalWaveDrom', () => {

      let interval_wavedrom: WaveDrom;
      beforeEach(() => {
        interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);
      });

      it("should contain included events", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        const from = 90, to = 250;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);

        // Then the interval wavedrom must contain these values
        const tick = "100 200 ";
        const interval_wave_s1 = ".1", interval_wave_s2 = "1.";
        expect(interval_wavedrom.foot.tick).toEqual(tick);
        expect(interval_wavedrom.signal[0].wave).toEqual(interval_wave_s1);
        expect(interval_wavedrom.signal[1].wave).toEqual(interval_wave_s2);
      });

      it("should respect interval inclusion rule", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        // with events occuring at these exact same time
        const from = 100, to = 200;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);

        // Then the interval wavedrom must contain the two events
        const tick = "100 200 ";
        const interval_wave_s1 = ".1", interval_wave_s2 = "1.";
        expect(interval_wavedrom.foot.tick).toEqual(tick);
        expect(interval_wavedrom.signal[0].wave).toEqual(interval_wave_s1);
        expect(interval_wavedrom.signal[1].wave).toEqual(interval_wave_s2);
      });

      it("should contain all next events", () => {
        // Given a wavedrom with two signals
        // and an initialized interval wavedrom
        // When filling the interval wavedrom
        // with events occuring at these exact same time
        const from = 100, to = 10000;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);

        // Then the interval wavedrom must contain all events
        // except those before 100
        const tick = "100 200 350 670 ";
        const interval_wave_s1 = ".1..", interval_wave_s2 = "1.01";
        expect(interval_wavedrom.foot.tick).toEqual(tick);
        expect(interval_wavedrom.signal[0].wave).toEqual(interval_wave_s1);
        expect(interval_wavedrom.signal[1].wave).toEqual(interval_wave_s2);
      });
    });

    describe('prependStartTime', () => {

      it("should prepend interval start value at tick and point at each wave", () => {
        // Given a filled wavedrom with the start interval value not included
        let interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);
        const from = 90, to = 250;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = extractor.prependStartTime(interval_wavedrom, wavedrom, from);

        // Then the start interval value (90 here) must be added at the beginning of tick
        // and all the waves must start with a point
        const prepended_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length + 1;
        });
        expect(prepended_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.startsWith(from + ' ')).toBeTruthy();
        const waves_start_with_point = interval_wavedrom.signal.every(signal => {
          return signal.wave[0] == '.'
        });
        expect(waves_start_with_point).toBeTruthy();
      });

      it("should not prepend interval start value at tick and point at each wave", () => {
        // Given a filled wavedrom with the start interval value included
        let interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);
        const from = 100, to = 250;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);

        // When managind the interval start
        const waves_length = interval_wavedrom.signal[0].wave.length;
        interval_wavedrom = extractor.prependStartTime(interval_wavedrom, wavedrom, from);

        // Then the start interval value (100 here) must already be at the beginning of tick
        // and the waves must start with their value at this time
        const did_not_prepend_waves = interval_wavedrom.signal.every(signal => {
          return signal.wave.length == waves_length;
        });
        expect(did_not_prepend_waves).toBeTruthy();
        expect(interval_wavedrom.foot.tick.startsWith(from + ' ')).toBeTruthy();
        expect(interval_wavedrom.signal[0].wave[0]).toEqual('.');
        expect(interval_wavedrom.signal[1].wave[0]).toEqual('1');
      });
    });

    describe('replaceStartPointsWithValues', () => {

      it("should replace the points with precedent values", () => {
        // Given a filled interval wavedrom with one wave starting with a point
        let interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);
        const from = 100, to = 250;
        interval_wavedrom = extractor.fillIntervalWaveDrom(interval_wavedrom, wavedrom, from, to);
        expect(interval_wavedrom.signal[0].wave[0]).toEqual('.');
        expect(interval_wavedrom.signal[1].wave[0]).toEqual('1');

        // When replacing the wave starting point
        interval_wavedrom = extractor.replaceStartPointsWithValues(interval_wavedrom,
          wavedrom, from);

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
          const precedent_value = extractor.getPrecedentValue(t, wave);

          // Then the precedent value should have this value
          const expected_precedent_value = '1';
          expect(precedent_value).toEqual(expected_precedent_value);
        });

        it("should return an undefined value", () => {
          // Given a time value and a wave not containing precedent value before this time
          const wave = ".......x", t = 5;

          // When getting the precedent meaningfull value
          const precedent_value = extractor.getPrecedentValue(t, wave);

          // Then the precedent value should be undefined
          const expected_precedent_value = undefined;
          expect(precedent_value).toEqual(expected_precedent_value);
        });
      });
    });

  });
});
