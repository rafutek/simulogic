import { ExtractorsService } from './extractors.service'
import { WaveDrom, Signal } from '@simulogic/core';

describe('SimulationExtractor', () => {
  let extractor: ExtractorsService;

  beforeEach(() => {
    extractor = new ExtractorsService();
  });

  describe('getPrecedentValue', () => {

    it("should return the precedent meaningfull value", () => {
      // Given a wave and a time value
      const wave = "x01....x";
      const t = 5;

      // When getting the precedent meaningfull value
      const precedent_value = extractor.getPrecedentValue(t, wave);

      // Then the precedent value should have this value
      const expected_precedent_value = '1';
      expect(precedent_value).toEqual(expected_precedent_value);
    })

    it("should return an undefined value", () => {
      // Given a time value and a wave not containing precedent value before this time
      const wave = ".......x";
      const t = 5;

      // When getting the precedent meaningfull value
      const precedent_value = extractor.getPrecedentValue(t, wave);

      // Then the precedent value should be undefined
      const expected_precedent_value = undefined;
      expect(precedent_value).toEqual(expected_precedent_value);
    })
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
      })
    });

    describe('fillIntervalWaveDrom', () => {

      let interval_wavedrom: WaveDrom;
      beforeEach(() => {
        interval_wavedrom = extractor.initIntervalWaveDrom(wavedrom);
      })

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
      })

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
      })

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
      })
    });
  });
});
