import React, { useState, useEffect } from 'react';
import { SelectEntity, SelectEntityProps } from '../selectEntity/SelectEntity'
import { Entity, WaveDrom } from '@simulogic/core';
import { IntervalSelector, IntervalSelectorProps } from '../intervalSelector/IntervalSelector';
import { SimulationIntervalGetter, IntervalSimulationGetterProps } from '../intervalSimulationGetter/IntervalSimulationGetter';
import { TimeDiagram } from '../timeDiagram/TimeDiagram';

export const StepsIntervalSimulationGetter = () => {

    const [selected_simulation, setSelectedSimu] = useState<Entity>();
    const select_simu_props: SelectEntityProps = {
        entity: "simulation",
        setSelectedEntity: setSelectedSimu
    };


    const [from, setFrom] = useState<number>();
    const [to, setTo] = useState<number>();
    const interval_selector_props: IntervalSelectorProps = {
        setFrom: setFrom,
        setTo: setTo
    };

    const [simulation_interval, setSimulationInterval] = useState<WaveDrom>();
    const [interval_getter_props, setIntervalGetterProps] = useState<IntervalSimulationGetterProps>();
    let local_interval_getter_props: IntervalSimulationGetterProps = {
        id: undefined,
        from: undefined,
        to: undefined,
        setReceivedInterval: setSimulationInterval
    };

    // Set/Change interval simulation getter properties
    // when selected simulation and interval boundaries are modified
    useEffect(() => {
        if (selected_simulation && from && to) {
            local_interval_getter_props.id = selected_simulation.id;
            local_interval_getter_props.from = from;
            local_interval_getter_props.to = to;
            setIntervalGetterProps(local_interval_getter_props);
        }
    }, [selected_simulation, from, to]);

    return (
        <div>
            <SelectEntity {...select_simu_props} />
            {selected_simulation ? <IntervalSelector {...interval_selector_props} /> : null}
            {from >= 0 && to > from ? <SimulationIntervalGetter {...interval_getter_props} /> : null}
            {simulation_interval ? <TimeDiagram data={simulation_interval} /> : null}
        </div>
    )
}