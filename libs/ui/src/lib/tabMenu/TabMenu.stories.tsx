import React from 'react';
import { TabMenu } from './TabMenu';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'TabMenu',
    component: TabMenu,
};

export const Default = () => {
    return <TabMenu />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <TabMenu />
        </ThemeProvider>
    )
}
