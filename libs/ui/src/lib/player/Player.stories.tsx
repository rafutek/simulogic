import React from 'react';
import { Player } from './Player';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'Player',
    component: Player,
};

export const Default = () => {
    return <Player />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <Player />
        </ThemeProvider>
    )
}
