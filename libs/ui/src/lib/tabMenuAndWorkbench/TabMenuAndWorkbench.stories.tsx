import React from 'react';
import { TabMenuAndWorkbench } from './TabMenuAndWorkbench';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'TabMenuAndWorkbench',
    component: TabMenuAndWorkbench,
};

export const Default = () => {
    return <TabMenuAndWorkbench />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <TabMenuAndWorkbench />
        </ThemeProvider>
    )
}
