import React from 'react';
import { EntitySelectorAndGetter, EntitySelectorAndGetterProps } from './EntitySelectorAndGetter';

export default {
    title: 'EntitySelectorAndGetter',
    component: EntitySelectorAndGetter,
};

export const Circuit = () => {
    const props: EntitySelectorAndGetterProps = {
        entity: "circuit",
        setReceivedEntity: () => { console.log("set received circuit") }
    };

    return <EntitySelectorAndGetter {...props} />
}

export const Simulation = () => {
    const props: EntitySelectorAndGetterProps = {
        entity: "simulation",
        setReceivedEntity: () => { console.log("set received simulation") }
    };

    return <EntitySelectorAndGetter {...props} />
}