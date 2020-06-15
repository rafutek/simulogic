import React from 'react';
import { GetEntity, GetEntityProps } from './GetEntity';

export default {
    title: 'Get entity',
    component: GetEntity,
};

export const Circuit = () => {
    const props: GetEntityProps = {
        entity: "circuit",
        setReceivedEntity: () => { console.log("set received circuit") },
        id: 1
    }
    return <GetEntity {...props} />
}

export const Simulation = () => {
    const props: GetEntityProps = {
        entity: "simulation",
        setReceivedEntity: () => { console.log("set received simulation") },
        id: 2
    }
    return <GetEntity {...props} />
}