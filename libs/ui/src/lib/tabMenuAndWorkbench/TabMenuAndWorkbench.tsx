import React, { useState } from 'react';
import { Entity } from '@simulogic/core';
import { TabMenu, TabMenuProps } from '../tabMenu/TabMenu';
import { Workbench, WorkbenchProps } from '../workbench/Workbench';

export const TabMenuAndWorkbench = () => {

    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();

    const tabMenu_props: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation
    }

    const workbench_props: WorkbenchProps = {
        circuit: selected_circuit,
        simulation: selected_simulation
    }

    return (
        <div>
            <TabMenu {...tabMenu_props} />
            <Workbench {...workbench_props} />
        </div>
    );
}