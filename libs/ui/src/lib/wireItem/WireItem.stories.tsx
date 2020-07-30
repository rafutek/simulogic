import React, { useState } from 'react';
import { WireItem, WireItemProps } from './WireItem';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'WireItem',
    component: WireItem,
};

const props: WireItemProps = {
    name: "wire1",
    visible: true,
    handleClickVisibility: (wire: string) => console.log(`toggle ${wire} visibility`)
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
