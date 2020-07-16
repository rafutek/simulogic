import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MemoryIcon from '@material-ui/icons/Memory';
import InputIcon from '@material-ui/icons/Input';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';
import { SearchField, SearchFieldProps } from '../searchField/SearchField';
import { Entity } from '@simulogic/core';
import { List } from '@material-ui/core';
import { EntityItem } from '../entityItem/EntityItem';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        position: "fixed",
        height: "100%"
    },
    tabs: {
        color: "white",
    },
    tab: {
        minWidth: 0,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    },
    bottom: {
        position: "fixed",
        bottom: 0
    },
    panels: {
        backgroundColor: theme.palette.secondary.main
    }
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    hide: boolean;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, hide, ...other } = props;

    return (
        <div
            hidden={hide || value != index}
            {...other}
        >
            {value == index && (
                <Box p={1}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export const TabMenu = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [hidePanel, setHidePanel] = useState(true);
    const [circuits, setCircuits] = useState<Entity[]>();


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        // Toggle tab panel
        if (hidePanel) {
            setHidePanel(false);
        }
        else if (newValue == value) {
            setHidePanel(true);
        }
        setValue(newValue);
    };


    const printSearchResult = (search_result: Entity[]) => {
        console.log(search_result);
    }
    const searchCircuitsProps: SearchFieldProps = {
        what: "circuits",
        setSearchResult: setCircuits
    }
    const searchSimulationsProps: SearchFieldProps = {
        what: "simulations",
        setSearchResult: printSearchResult
    }
    const searchWiresProps: SearchFieldProps = {
        what: "wires",
        setSearchResult: printSearchResult
    }

    const CircuitsList = () => {
        if (circuits) {
            return (
                <List>
                    {circuits.map(circuit => <EntityItem entity={circuit} />)}
                </List>
            )
        } else return null;
    }

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                className={classes.tabs}
            >
                <Tab icon={<MemoryIcon />} className={classes.tab} />
                <Tab icon={<InputIcon />} className={classes.tab} />
                <Tab icon={<SettingsInputComponentIcon />} className={classes.tab} />
                <Tab icon={<BuildIcon />} className={classes.tab} />
                <Tab icon={<SettingsIcon />} className={`${classes.tab} ${classes.bottom}`} />
            </Tabs>
            <div className={classes.panels}>
                <TabPanel value={value} index={0} hide={hidePanel} >
                    <SearchField {...searchCircuitsProps} />
                    <CircuitsList />
                </TabPanel>
                <TabPanel value={value} index={1} hide={hidePanel} >
                    <SearchField {...searchSimulationsProps} />
                </TabPanel>
                <TabPanel value={value} index={2} hide={hidePanel} >
                    <SearchField {...searchWiresProps} />
                </TabPanel>
                <TabPanel value={value} index={3} hide={hidePanel} >
                    Workbench tweaks
            </TabPanel>
                <TabPanel value={value} index={4} hide={hidePanel} >
                    Parameters
            </TabPanel>
            </div>
        </div>
    );
}