import React from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { WaveDrom, SimulationProps } from '@simulogic/core'

export interface SimulationGetterProps {
    simu_props: SimulationProps,
    setSimulation: (simulation: WaveDrom) => void
}

export const SimulationGetter = (props: SimulationGetterProps) => {

    const getSimulation = () => {
        axios.post(`/simulations/extract`, props.simu_props)
            .then((response) => {
                console.log(response.data)
                props.setSimulation(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const GetSimuButton = () => {
        return <Button variant="contained" color="primary"
            onClick={getSimulation}>Get simulation</Button>;
    }

    return (
        <div>
            <GetSimuButton />
        </div>
    )
}