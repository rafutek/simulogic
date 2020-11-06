import React, { useState } from 'react';
import { WiresList, WiresListProps } from './WiresList';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'WiresList',
    component: WiresList,
};

const props: WiresListProps = {
    signal_groups: [
        { "group_name": "input", "signals_names": ["a1", "a2"] },
        { "group_name": "output", "signals_names": ["s1"] }
    ],
    visible_wires: null,
    setVisibleWires: null
};

export const Default = () => {
    const [visible_wires, setVisibleWires] = useState<string[]>([]);
    props.visible_wires = visible_wires;
    props.setVisibleWires = setVisibleWires;
    return <WiresList {...props} />
}

export const WithTheme = () => {
    const [visible_wires, setVisibleWires] = useState<string[]>([]);
    props.visible_wires = visible_wires;
    props.setVisibleWires = setVisibleWires;
    return (
        <ThemeProvider theme={theme}>
            <WiresList {...props} />
        </ThemeProvider>
    )
}
