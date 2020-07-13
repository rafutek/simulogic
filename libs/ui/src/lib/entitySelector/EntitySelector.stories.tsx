import React from 'react';
import { EntitySelector, EntitySelectorProps } from './EntitySelector';

export default {
    title: 'EntitySelector',
    component: EntitySelector,
};

export const Circuit = () => {
    const props: EntitySelectorProps = {
        entity: "circuit",
        setSelectedEntity: () => { console.log("set selected circuit") }
    }
    return <EntitySelector {...props} />
}
export const Simulation = () => {
    const props: EntitySelectorProps = {
        entity: "simulation",
        setSelectedEntity: () => { console.log("set selected simulation") }
    }
    return <EntitySelector {...props} />
}