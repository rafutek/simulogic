import React from 'react';
import { SimulationConfig } from './SimulationConfig';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'SimulationConfig',
    component: SimulationConfig,
};

export const Default = () => {
    return <SimulationConfig />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <SimulationConfig />
        </ThemeProvider>
    )
}
