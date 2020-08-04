import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MemoryIcon from '@material-ui/icons/Memory';
import InputIcon from '@material-ui/icons/Input';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';
import { SearchField, SearchFieldProps } from '../searchField/SearchField';
import { Entity, entity, SignalGroup } from '@simulogic/core';
import { List } from '@material-ui/core';
import { EntityItem, EntityItemProps } from '../entityItem/EntityItem';
import { EntityUploader } from '../entityUploader/EntityUploader';
import { WiresList } from '../wiresList/WiresList';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        position: "fixed",
        height: "100%"
    },
    tabs: {
        color: "white"
    },
    tab: {
        zIndex: 1,
        minWidth: 0,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        },
    },
    bottom: {
        position: "fixed",
        bottom: 0
    },
    panels: {
        backgroundColor: theme.palette.secondary.main
    },
    panel: {
        padding: 10
    }
}));

export interface TabMenuProps {
    selected_circuit: Entity,
    setSelectedCircuit: (circuit: Entity) => void,
    selected_simulation: Entity,
    setSelectedSimulation: (simulation: Entity) => void,
    signal_groups: SignalGroup[]
    visible_wires: string[],
    setVisibleWires: (visible_wires: string[]) => void,
    onSearchWires: (result: SignalGroup[]) => void
}

export const TabMenu = (props: TabMenuProps) => {
    const classes = useStyles();
    const [selected_tab_id, setSelectedTabId] = useState(0);
    const [hide_panel, setHidePanel] = useState(true);
    const [circuits, setCircuits] = useState<Entity[]>();
    const [simulations, setSimulations] = useState<Entity[]>();
    const [refresh_circuits, setRefreshCircuits] = useState(true);
    const [refresh_simulations, setRefreshSimulations] = useState(true);
    const [signal_groups_found, setSignalGroupsFound] = useState<SignalGroup[]>();

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
        hide: boolean;
    }

    const TabPanel = (props: TabPanelProps) => {
        const { children, value, index, hide, ...other } = props;

        return (
            <div className={classes.panel}
                hidden={hide || value != index}
                {...other}
            >
                {children}
            </div>
        );
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (hide_panel) {
            setHidePanel(false);
        }
        else if (newValue == selected_tab_id) {
            setHidePanel(true);
        }
        setSelectedTabId(newValue);
    };

    const searchCircuitsProps: SearchFieldProps = {
        what: "circuit",
        setSearchEntityResult: setCircuits,
        refresh: refresh_circuits,
        setRefresh: setRefreshCircuits
    }
    const searchSimulationsProps: SearchFieldProps = {
        what: "simulation",
        setSearchEntityResult: setSimulations,
        refresh: refresh_simulations,
        setRefresh: setRefreshSimulations
    }
    const searchWiresProps: SearchFieldProps = {
        what: "wire",
        setSearchWiresResult: setSignalGroupsFound
    }

    useEffect(() => {
        signal_groups_found ? props.onSearchWires(signal_groups_found) : null;
    }, [signal_groups_found]);

    // EntitiesList is a local component for listing the circuits or simulations
    interface EntitiesListProps {
        entities: Entity[],
        what: entity
    };
    const EntitiesList = (entities_props: EntitiesListProps) => {
        const { entities, what } = entities_props;
        if (entities) {
            return (
                <List>
                    {entities.map(entity => {
                        const item_props: EntityItemProps = {
                            what: what,
                            entity: entity,
                            selected_entity: null,
                            setSelectedEntity: null
                        };
                        if (what == "circuit") {
                            item_props.onRename = () => setRefreshCircuits(true);
                            item_props.onDelete = () => setRefreshCircuits(true);
                            item_props.selected_entity = props.selected_circuit;
                            item_props.setSelectedEntity = props.setSelectedCircuit;
                        }
                        else if (what == "simulation") {
                            item_props.onRename = () => setRefreshSimulations(true);
                            item_props.onDelete = () => setRefreshSimulations(true);
                            item_props.selected_entity = props.selected_simulation;
                            item_props.setSelectedEntity = props.setSelectedSimulation;
                        }
                        return <EntityItem {...item_props} />
                    })}
                </List>
            )
        } else return null;
    }

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                value={selected_tab_id}
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
                <TabPanel value={selected_tab_id} index={0} hide={hide_panel} >
                    <EntityUploader entity="circuit" onUpload={() => setRefreshCircuits(true)} />
                    <SearchField {...searchCircuitsProps} />
                    <EntitiesList entities={circuits} what={"circuit"} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={1} hide={hide_panel} >
                    <EntityUploader entity="simulation" onUpload={() => setRefreshSimulations(true)} />
                    <SearchField {...searchSimulationsProps} />
                    <EntitiesList entities={simulations} what={"simulation"} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={2} hide={hide_panel} >
                    <SearchField {...searchWiresProps} />
                    <WiresList signal_groups={props.signal_groups} visible_wires={props.visible_wires}
                        setVisibleWires={props.setVisibleWires} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={3} hide={hide_panel} >
                    Workbench tweaks
                </TabPanel>
                <TabPanel value={selected_tab_id} index={4} hide={hide_panel} >
                    Parameters
            </TabPanel>
            </div>
        </div>
    );
}