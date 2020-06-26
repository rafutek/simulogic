import React, { useState, useEffect } from 'react';
import { Entity, WaveDrom } from '@simulogic/core'
import { SelectEntity } from '../selectEntity/SelectEntity';
import axios from 'axios';
import { TimeDiagram } from '../timeDiagram/TimeDiagram';

export const DisplaySimulationResult = () => {

    const [selectedCircuit, setSelectedCircuit] = useState<Entity>();
    const [selectedSimulation, setSelectedSImulation] = useState<Entity>();
    const [simulationResult, setSimulationResult] = useState<WaveDrom>();

    useEffect(() => {
        if (selectedCircuit && selectedSimulation) {
            axios.get(`/simulations/${selectedCircuit.id}/${selectedSimulation.id}`)
                .then((response) => {
                    setSimulationResult(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedCircuit, selectedSimulation]);

    return (
        <div>
            <SelectEntity entity="circuit" setSelectedEntity={setSelectedCircuit} />
            <SelectEntity entity="simulation" setSelectedEntity={setSelectedSImulation} />
            {simulationResult ? <TimeDiagram data={simulationResult} /> : null}
        </div>
    )
}