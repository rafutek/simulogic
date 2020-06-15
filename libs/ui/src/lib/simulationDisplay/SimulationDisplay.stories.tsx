import React from 'react';
import { SimulationDisplay } from './SimulationDisplay';
import { Simulation, Wire } from '../core';

export default {
    title: 'Simulation display',
    component: SimulationDisplay,
};
const wire1: Wire = {
    name: "wire 1",
    events: [
        [1200, 1],
        [1800, 1],
        [2400, 0],
        [3000, 1],
        [3600, 1],
        [4200, 0],
        [4800, 1],
        [5400, 0]
    ]
};

const wire2: Wire = {
    name: "wire 2",
    events: [
        [100, 1],
        [1000, 0],
        [2200, 0],
        [3200, 1],
        [3800, 0],
        [4200, 0],
        [4880, 1],
        [5200, 0]
    ]
};

const simu: Simulation = {
    start: 0,
    end: 10000,
    wires: [wire1, wire2]
}

export const Default = () => <SimulationDisplay simulation={simu} />