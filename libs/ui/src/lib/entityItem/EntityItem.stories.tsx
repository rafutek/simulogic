import React from 'react';
import { EntityItem, EntityItemProps } from './EntityItem';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';

export default {
    title: 'EntityItem',
    component: EntityItem,
};

const props: EntityItemProps = {
    entity: {
        id: 1,
        name: "name test"
    }
};

export const Default = () => {
    return <EntityItem {...props} />
}

export const WithTheme = () => {
    return (
        <ThemeProvider theme={theme}>
            <EntityItem {...props}/>
        </ThemeProvider>
    )
}
