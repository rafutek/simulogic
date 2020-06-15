import React from 'react';
import axios from 'axios';
import { SelectAndGetEntity, SelectAndGetEntityProps } from './SelectAndGetEntity';

export default {
    title: 'Select and get entity',
    component: SelectAndGetEntity,
};

export const Circuit = () => {
    const props: SelectAndGetEntityProps = {
        entity: "circuit",
        setReceivedEntity: () => { console.log("set received circuit") }
    };

    return <SelectAndGetEntity {...props} />
}

export const Simulation = () => {
    const props: SelectAndGetEntityProps = {
        entity: "simulation",
        setReceivedEntity: () => { console.log("set received simulation") }
    };

    return <SelectAndGetEntity {...props} />
}