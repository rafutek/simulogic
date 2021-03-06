import React, { useState } from 'react';
import { SearchField, SearchFieldProps } from './SearchField';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../SimulogicTheme';
import { Entity } from '@simulogic/core';

export default {
    title: 'SearchField',
    component: SearchField,
};

const printSearchResult = (search_result: any) => {
    console.log(search_result);
}

export const Circuits = () => {
    const props: SearchFieldProps = {
        what: "circuit",
        setSearchEntityResult: printSearchResult
    };
    return <SearchField {...props} />
}

export const CircuitsWithTheme = () => {
    const props: SearchFieldProps = {
        what: "circuit",
        setSearchEntityResult: printSearchResult
    };
    return (
        <ThemeProvider theme={theme}>
            <SearchField {...props} />
        </ThemeProvider>
    )
}

export const Simulations = () => {
    const props: SearchFieldProps = {
        what: "simulation",
        setSearchEntityResult: printSearchResult
    };
    return <SearchField {...props} />
}