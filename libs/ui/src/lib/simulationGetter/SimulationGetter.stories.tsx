import React, { useState } from 'react';
import { SimulationGetter, SimulationGetterProps } from './SimulationGetter';
import { WaveDrom, ExtractionDetails } from '@simulogic/core';

export default {
    title: 'SimulationGetter',
    component: SimulationGetter,
};

let simu_props: ExtractionDetails;
let props: SimulationGetterProps;

export const getSimu_1 = () => {
    const [simulation, setSimulation] = useState<WaveDrom>();
    simu_props = {
        id_simu: 1
    }
    props = {
        extraction_details: simu_props,
        setSimulation: setSimulation
    }

    return (
        <div>
            <SimulationGetter {...props} />
            {simulation ? <p>received simulation</p> : null}
        </div>
    )
}

export const getSimu_1_withResult = () => {
    const [simulation, setSimulation] = useState<WaveDrom>();
    simu_props = {
        id_simu: 1,
        id_circuit: 1,
        result: true
    }
    props = {
        extraction_details: simu_props,
        setSimulation: setSimulation
    }

    return (
        <div>
            <SimulationGetter {...props} />
            {simulation ? <p>received simulation</p> : null}
        </div>
    )
}

export const getSimu_1_Interval = () => {
    const [simulation, setSimulation] = useState<WaveDrom>();
    simu_props = {
        id_simu: 1,
        from: 3,
        to: 60
    }
    props = {
        extraction_details: simu_props,
        setSimulation: setSimulation
    }

    return (
        <div>
            <SimulationGetter {...props} />
            {simulation ? <p>received simulation</p> : null}
        </div>
    )
}