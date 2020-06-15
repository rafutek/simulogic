import React from 'react';
import { SelectEntity, SelectEntityProps } from './SelectEntity';

export default {
    title: 'Select entity',
    component: SelectEntity,
};

export const Circuit = () => {
    const props: SelectEntityProps = {
        entity: "circuit",
        setSelectedEntity: () => { console.log("set selected circuit") }
    }
    return <SelectEntity {...props} />
}
export const Simulation = () => {
    const props: SelectEntityProps = {
        entity: "simulation",
        setSelectedEntity: () => { console.log("set selected simulation") }
    }
    return <SelectEntity {...props} />
}