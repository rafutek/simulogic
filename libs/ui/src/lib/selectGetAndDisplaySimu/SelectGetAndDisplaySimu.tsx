import React, { useState } from 'react';
import { SelectAndGetEntity } from '../selectAndGetEntity/SelectAndGetEntity';
import { WaveDrom } from '@simulogic/core';
import { TimeDiagram } from '../timeDiagram/TimeDiagram';

export function SelectGetAndDisplaySimu() {

    const [simulation, setSimulation] = useState<WaveDrom>();

    return (
        <div>
            <SelectAndGetEntity entity="simulation" setReceivedEntity={setSimulation} />
            {simulation ? <TimeDiagram data={simulation} /> : null}
        </div>
    )
}