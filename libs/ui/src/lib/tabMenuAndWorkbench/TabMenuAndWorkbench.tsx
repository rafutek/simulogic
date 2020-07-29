import React, { useState, useEffect } from 'react';
import { Entity, SignalGroup } from '@simulogic/core';
import { TabMenu, TabMenuProps } from '../tabMenu/TabMenu';
import { Workbench, WorkbenchProps } from '../workbench/Workbench';
import axios from 'axios';

export const TabMenuAndWorkbench = () => {

    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();
    const [wires, setWires] = useState<SignalGroup[]>()

    const getAndSetWires = () => {
        axios.get('/simulations/extract/wires')
            .then(response => setWires(response.data))
            .catch(error => console.error(error))
    }

    const tabMenuProps: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation,
        wires: wires
    }

    const workbenchProps: WorkbenchProps = {
        circuit: selected_circuit,
        simulation: selected_simulation,
        getAndSetWires: getAndSetWires
    }

    useEffect(() => {
        console.log("wires:", wires)
    }, [wires]);

    return (
        <div>
            <TabMenu {...tabMenuProps} />
            <Workbench {...workbenchProps} />
        </div>
    );
}