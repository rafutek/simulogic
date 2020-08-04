import React, { useState, useEffect } from 'react';
import { Entity, SignalGroup } from '@simulogic/core';
import { TabMenu, TabMenuProps } from '../tabMenu/TabMenu';
import { Workbench, WorkbenchProps } from '../workbench/Workbench';
import axios from 'axios';

export const TabMenuAndWorkbench = () => {

    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();
    const [signal_groups, setSignalGroups] = useState<SignalGroup[]>()
    const [visible_wires, setVisibleWires] = useState<string[]>();

    const onChangeSimulation = () => {
        getAndSetSignalGroups();
    }

    const getAndSetSignalGroups = () => {
        console.log("get and set signal groups")
        axios.get('/simulations/extract/wires')
            .then(response => setSignalGroups(response.data))
            .catch(error => console.error(error))
    }

    const changeVisibleWires = () => {
        const all_wires = listWires(signal_groups);
        console.log("previous visible wires:", visible_wires);
        console.log("new visible wires:", all_wires);
        setVisibleWires(all_wires);
    }

    const listWires = (signal_groups: SignalGroup[]) => {
        let wires_list: string[] = [];
        signal_groups?.forEach(signal_group => {
            signal_group.signals?.forEach(signal_name => wires_list.push(signal_name));
        });
        return wires_list;
    }

    useEffect(() => {
        if (signal_groups) {
            console.log("signal groups received:", signal_groups);
            changeVisibleWires();
        }
    }, [signal_groups]);

    const tabMenuProps: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation,
        signal_groups: signal_groups,
        visible_wires: visible_wires,
        setVisibleWires: setVisibleWires
    }

    const workbenchProps: WorkbenchProps = {
        circuit: selected_circuit,
        simulation: selected_simulation,
        onChangeSimulation: onChangeSimulation,
        visible_wires: visible_wires
    }

    return (
        <div>
            <TabMenu {...tabMenuProps} />
            <Workbench {...workbenchProps} />
        </div>
    );
}