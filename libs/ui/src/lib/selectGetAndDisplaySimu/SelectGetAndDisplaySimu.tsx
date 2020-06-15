import React, { useState } from 'react';
import { SelectAndGetEntity } from '../selectAndGetEntity/SelectAndGetEntity';
import { Simulation } from '../core';
import { SimulationDisplay } from '../simulationDisplay/SimulationDisplay';

export function SelectGetAndDisplaySimu() {

    const [simulation, setSimulation] = useState<Simulation>();

    return (
        <div>
            <SelectAndGetEntity entity="simulation" setReceivedEntity={setSimulation} />
            {simulation ? <SimulationDisplay simulation={simulation} /> : null}
        </div>
    )
}