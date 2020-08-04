import React from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { WaveDrom, ExtractionDetails } from '@simulogic/core'

export interface SimulationGetterProps {
    extraction_details: ExtractionDetails,
    setSimulation: (simulation: WaveDrom) => void
}

export const SimulationGetter = (props: SimulationGetterProps) => {

    const getSimulation = () => {
        axios.post(`/simulations/extract`, props.extraction_details)
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