import React, { useState, useEffect } from 'react';
import { Entity } from '../core'
import { SelectEntity } from '../selectEntity/SelectEntity';
import axios from 'axios';

export const SelectAndGetCircuitSimulation = () => {

    const [selectedCircuit, setSelectedCircuit] = useState<Entity>();
    const [selectedSimulation, setSelectedSImulation] = useState<Entity>();

    useEffect(() => {
        if( selectedCircuit && selectedSimulation){
            axios.get(`/simulations/${selectedCircuit.id}/${selectedSimulation.id}`)
            .then((response) => {
                console.log(response.data);
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
        </div>
    )
}