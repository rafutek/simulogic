import React from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { WaveDrom } from '@simulogic/core'

export interface IntervalSimulationGetterProps {
    id: number,
    from: number,
    to: number,
    setReceivedInterval: (interval_simulation: WaveDrom) => void
}

export const SimulationIntervalGetter = (props: IntervalSimulationGetterProps) => {

    const getInterval = () => {
        axios.get(`/simulations/${props.id}/${props.from}/${props.to}`)
            .then((response) => {
                props.setReceivedInterval(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const GetIntervalButton = () => {
        return <Button variant="contained" color="primary" onClick={getInterval}>
            Get simulation interval
        </Button>;
    }

    return (
        <div>
            <GetIntervalButton />
        </div>
    )
}