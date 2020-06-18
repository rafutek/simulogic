import React, { useState, useEffect } from 'react';
import { Entity, Simulation } from '@simulogic/core'
import { SelectEntity } from '../selectEntity/SelectEntity';
import axios from 'axios';
import { SimulationDisplay } from '../simulationDisplay/SimulationDisplay';

export const DisplaySimulationResult = () => {

    const [selectedCircuit, setSelectedCircuit] = useState<Entity>();
    const [selectedSimulation, setSelectedSImulation] = useState<Entity>();
    const [simulationResult, setSimulationResult] = useState<Simulation>();

    useEffect(() => {
        if( selectedCircuit && selectedSimulation){
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
            {simulationResult ? <SimulationDisplay simulation={simulationResult} /> : null}
        </div>
    )
}