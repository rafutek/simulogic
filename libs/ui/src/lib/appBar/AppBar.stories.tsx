import React from 'react';
import { AppBar } from './AppBar'
import { theme } from '../SimulogicTheme';
import { ThemeProvider } from '@material-ui/core/styles';


export default {
    title: 'AppBar',
    component: AppBar,
};

export const Default = () => {
    return <AppBar />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <AppBar />
        </ThemeProvider>
    )
}