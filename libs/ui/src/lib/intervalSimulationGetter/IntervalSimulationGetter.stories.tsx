import React, { useState } from 'react';
import { SimulationIntervalGetter, IntervalSimulationGetterProps } from './IntervalSimulationGetter';
import { WaveDrom } from '@simulogic/core';

export default {
    title: 'Simulation interval getter',
    component: SimulationIntervalGetter,
};

export const Default = () => {

    const [simulation_interval, setSimulationInterval] = useState<WaveDrom>();
    const props: IntervalSimulationGetterProps = {
        id: 2,
        from: 0,
        to: 1000,
        setReceivedInterval: setSimulationInterval
    }

    return (
        <div>
            <SimulationIntervalGetter {...props} />
            {simulation_interval ? <p>received simulation interval</p> : null}
        </div>
    )
}