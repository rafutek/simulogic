import React from 'react';
import { WiresList, WiresListProps } from './WiresList';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'WiresList',
    component: WiresList,
};

const props: WiresListProps = {
    signal_groups: [
        { "name": "input", "signals": ["a1", "a2"] },
        { "name": "output", "signals": ["s1"] }
    ]
};

export const Default = () => {
    return <WiresList {...props} />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <WiresList {...props} />
        </ThemeProvider>
    )
}
