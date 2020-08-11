import React, { useState, useEffect } from 'react';
import { Entity, SignalGroup, Configuration } from '@simulogic/core';
import { TabMenu, TabMenuProps } from '../tabMenu/TabMenu';
import { Workbench, WorkbenchProps } from '../workbench/Workbench';
import axios from 'axios';

export const TabMenuAndWorkbench = () => {

    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();
    const [signal_groups, setSignalGroups] = useState<SignalGroup[]>()
    const [visible_wires, setVisibleWires] = useState<string[]>();
    const [update_visible_wires, setUpdateVisibleWires] = useState(true);
    const [configuration, setConfiguration] = useState<Configuration>();

    const onChangeSimulation = () => {
        getAndSetSignalGroups();
    }

    const getAndSetSignalGroups = () => {
        axios.get('/simulations/extract/wires')
            .then(response => setSignalGroups(response.data))
            .catch(error => console.error(error))
    }

    const changeVisibleWires = () => {
        const all_wires = listWires(signal_groups);
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
            update_visible_wires ? changeVisibleWires() : setUpdateVisibleWires(true);
        }
    }, [signal_groups]);

    const onSearchWires = (result: SignalGroup[]) => {
        setUpdateVisibleWires(false);
        setSignalGroups(result);
    }

    const tabMenuProps: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation,
        signal_groups: signal_groups,
        visible_wires: visible_wires,
        setVisibleWires: setVisibleWires,
        onSearchWires: onSearchWires,
        configuration: configuration,
        setConfiguration: setConfiguration
    }

    const workbenchProps: WorkbenchProps = {
        circuit: selected_circuit,
        simulation: selected_simulation,
        onChangeSimulation: onChangeSimulation,
        visible_wires: visible_wires,
        configuration: configuration
    }

    return (
        <div>
            <TabMenu {...tabMenuProps} />
            <Workbench {...workbenchProps} />
        </div>
    );
}