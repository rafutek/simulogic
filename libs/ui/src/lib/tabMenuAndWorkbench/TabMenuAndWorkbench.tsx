import React, { useState, useEffect } from 'react';
import { Entity, SignalGroup } from '@simulogic/core';
import { TabMenu, TabMenuProps } from '../tabMenu/TabMenu';
import { Workbench, WorkbenchProps } from '../workbench/Workbench';
import axios from 'axios';

export const TabMenuAndWorkbench = () => {

    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();
    const [signal_groups, setSignalGroups] = useState<SignalGroup[]>()
    const [visible_wires, setVisibleWires] = useState<string[]>([]);


    const getAndSetSignalGroups = () => {
        axios.get('/simulations/extract/wires')
            .then(response => setSignalGroups(response.data))
            .catch(error => console.error(error))
    }

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
        getAndSetSignalGroups: getAndSetSignalGroups,
        visible_wires: visible_wires
    }

    return (
        <div>
            <TabMenu {...tabMenuProps} />
            <Workbench {...workbenchProps} />
        </div>
    );
}