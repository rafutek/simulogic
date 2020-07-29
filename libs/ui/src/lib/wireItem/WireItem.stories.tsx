import React from 'react';
import { WireItem, WireItemProps } from './WireItem';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'WireItem',
    component: WireItem,
};

const props: WireItemProps = {
    index: 1,
    name: "wire1",
    visible_wires: ["wire"]
};

export const Default = () => {
    return <WireItem {...props} />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <WireItem {...props}/>
        </ThemeProvider>
    )
}
