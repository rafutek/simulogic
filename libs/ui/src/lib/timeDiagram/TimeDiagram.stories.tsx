import React from 'react';
import { TimeDiagram, TimeDiagramProps } from './TimeDiagram';

export default {
    title: 'Static time diagram',
    component: TimeDiagram,
};

export const Default = () => {
    const props: TimeDiagramProps = {
        data: {
            signal: [
                { name: "clk", wave: "p....x.." },
                { name: "bus", wave: "x.34.5xx" },
                { name: "wire", wave: "0.1..0.." },
            ]
        }
    }
    return <TimeDiagram {...props} />
} 