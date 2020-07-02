import { ExtractorsService } from './extractors.service'
import { Timestep, Event, WireState } from '@simulogic/core';

describe('SimulationExtractor', () => {
  let extractor: ExtractorsService;

  beforeEach(() => {
    extractor = new ExtractorsService();
  });

  describe('changeTimestep', () => {
    const timestep: Timestep = {
      time: 0,
      wires: []
    };
    const event: Event = {
      wire: 'first wire',
      time: 10,
      state: 'T'
    };
    const expected_wire: WireState = {
      name: event.wire,
      state: event.state
    }
    function isExpectedWire(wire: WireState) {
      return wire.name == expected_wire.name && wire.state == expected_wire.state;
    }

    it('should change the timestep time', () => {
      // Given a timestep with a time value
      // When giving an event with another time value
      const new_timestep = extractor.changeTimestep(timestep, event);

      // Then the new timestep time should be the given event time
      expect(new_timestep.time).toEqual(event.time);
    });

    it('should add the new wire to the timestep', () => {
      // Given a timestep without wires
      // When adding an event as a wire
      const new_timestep = extractor.changeTimestep(timestep, event);

      // Then the timestep should contain the expected wire
      function isSameWire(wire: WireState) {
        return wire.name == expected_wire.name && wire.state == expected_wire.state;
      }
      const added_wire = new_timestep.wires.find(isSameWire);
      expect(added_wire).toBeDefined();
    });

    it('should modify wire present in the timestep', () => {
      // Given a timestep containing a wire with another value
      const wire_to_add: WireState = {
        name: expected_wire.name,
        state: "x"
      };
      timestep.wires.push(wire_to_add);

      // When modifying the wire with its new value
      const new_timestep = extractor.changeTimestep(timestep, event);

      // Then the timestep should contain the modified wire
      const modified_wire = new_timestep.wires.find(isExpectedWire);
      expect(modified_wire).toBeDefined();
    });
  });
});
