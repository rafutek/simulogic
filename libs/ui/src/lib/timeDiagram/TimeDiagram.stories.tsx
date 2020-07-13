import React from 'react';
import { TimeDiagram, TimeDiagramProps } from './TimeDiagram';

export default {
    title: 'TimeDiagram',
    component: TimeDiagram,
};

export const Default = () => {
    const props: TimeDiagramProps = {
        data: {
            signal: [
                { name: "clk", wave: "x..." },
                { name: "bus", wave: "x." },
                { name: "wire", wave: "0.1" },
            ],
            foot: {
                tick: '0 1 2 3 4 '
            }
        }
    }
    return <TimeDiagram {...props} />
} 