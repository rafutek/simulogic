import React from 'react';
import Chart from 'react-apexcharts';
import { Series, Simulation } from '@simulogic/core';

export interface SimulationDisplayProps {
    simulation: Simulation
}

export function SimulationDisplay(props: SimulationDisplayProps) {

    const getSeries = (simulation: Simulation) => {
        const series: Series[] = [];
        simulation.wires.forEach((wire) => {
            series.push({
                name: wire.name,
                data: wire.events
            });
        });
        return series;
    }

    const state = {
        options: {
            xaxis: {
                min: props.simulation.start,
                max: props.simulation.end
            },
            chart: {
                id: "chart-test",
                type: 'line',
                zoom: {
                    enabled: 0,
                },
            },
            stroke: {
                curve: 'stepline',
            },
        },
        series: getSeries(props.simulation),
    };

    return (
        <div>
            <Chart options={state.options} series={state.series} />
        </div>
    );
}

