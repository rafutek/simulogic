import React, { useState } from 'react';
import { TabMenu, TabMenuProps } from './TabMenu';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';
import { Entity } from '@simulogic/core';

export default {
    title: 'TabMenu',
    component: TabMenu,
};

export const Default = () => {
    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();

    const tabMenuProps: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation
    }
    return <TabMenu {...tabMenuProps} />
}

export const WithTheme = () => {
    const [selected_circuit, setSelectedCircuit] = useState<Entity>();
    const [selected_simulation, setSelectedSimulation] = useState<Entity>();

    const tabMenuProps: TabMenuProps = {
        selected_circuit,
        setSelectedCircuit: setSelectedCircuit,
        selected_simulation,
        setSelectedSimulation: setSelectedSimulation
    }

    return (
        <ThemeProvider theme={theme}>
            <TabMenu {...tabMenuProps} />
        </ThemeProvider>
    )
}
