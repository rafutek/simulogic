import React from 'react';
import { EntityGetter, EntityGetterProps } from './EntityGetter';

export default {
    title: 'EntityGetter',
    component: EntityGetter,
};

export const Circuit = () => {
    const props: EntityGetterProps = {
        entity: "circuit",
        setReceivedEntity: () => { console.log("set received circuit") },
        id: 1
    }
    return <EntityGetter {...props} />
}

export const Simulation = () => {
    const props: EntityGetterProps = {
        entity: "simulation",
        setReceivedEntity: () => { console.log("set received simulation") },
        id: 2
    }
    return <EntityGetter {...props} />
}