import React from 'react';
import { Workbench, WorkbenchProps } from './Workbench';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'Workbench',
    component: Workbench,
};

const props: WorkbenchProps = {
    circuit: {
        id: 1,
        name: "test.logic"
    },
    simulation: {
        id: 1,
        name: "test.simu"
    },
    visible_wires: [],
    onChangeSimulation: () => console.log("get and set signal groups")
};

export const Default = () => {
    return <Workbench {...props} />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <Workbench {...props}/>
        </ThemeProvider>
    )
}
