import React from 'react';
import { SimulogicBar } from './SimulogicBar'
import { theme } from '../SimulogicTheme';
import { ThemeProvider } from '@material-ui/core/styles';


export default {
    title: 'SimulogicBar',
    component: SimulogicBar,
};

export const Default = () => {
    return <SimulogicBar />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <SimulogicBar />
        </ThemeProvider>
    )
}