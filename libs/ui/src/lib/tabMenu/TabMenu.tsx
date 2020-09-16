import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MemoryIcon from '@material-ui/icons/Memory';
import InputIcon from '@material-ui/icons/Input';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import BuildIcon from '@material-ui/icons/Build';
import { SearchField, SearchFieldProps } from '../searchField/SearchField';
import { Entity, entity, SignalGroup, Configuration } from '@simulogic/core';
import { List, Box } from '@material-ui/core';
import { EntityItem, EntityItemProps } from '../entityItem/EntityItem';
import { EntityUploader } from '../entityUploader/EntityUploader';
import { WiresList } from '../wiresList/WiresList';
import { SimulationConfig } from '../simulationConfig/SimulationConfig';

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
    },
    selected: {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main
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
    onSearchWires: (result: SignalGroup[]) => void,
    configuration: Configuration,
    setConfiguration: (config: Configuration) => void
}

export const TabMenu = (props: TabMenuProps) => {
    const classes = useStyles();
    const [selected_tab_id, setSelectedTabId] = useState(0);
    const [hidden_panel, setHiddenPanel] = useState(true);
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
        if (hidden_panel) {
            setHiddenPanel(false);
        }
        else if (newValue == selected_tab_id) {
            setHiddenPanel(true);
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
                        return <EntityItem key={`${what}_${entity.uuid}`} {...item_props} />
                    })}
                </List>
            )
        } else return null;
    }

    const dynamicClassName = (tab_id: number, selected_tab_id: number, hidden_panel: boolean) => {
        let className = `${classes.tab} `;
        if (!hidden_panel && tab_id == selected_tab_id) {
            className += `${classes.selected}`;
        }
        return className;
    }

    return (
        <Box boxShadow={5} className={classes.root}>
            <Tabs
                indicatorColor={"primary"}
                orientation="vertical"
                value={selected_tab_id}
                onChange={handleChange}
                className={classes.tabs}
            >
                <Tab icon={<MemoryIcon />} className={dynamicClassName(0, selected_tab_id, hidden_panel)} />
                <Tab icon={<InputIcon />} className={dynamicClassName(1, selected_tab_id, hidden_panel)} />
                <Tab icon={<SettingsInputComponentIcon />} className={dynamicClassName(2, selected_tab_id, hidden_panel)} />
                <Tab icon={<BuildIcon />} className={dynamicClassName(3, selected_tab_id, hidden_panel)} />
            </Tabs>
            <div className={classes.panels}>
                <TabPanel value={selected_tab_id} index={0} hide={hidden_panel} >
                    <EntityUploader entity="circuit" onUpload={() => setRefreshCircuits(true)} />
                    <SearchField {...searchCircuitsProps} />
                    <EntitiesList entities={circuits} what={"circuit"} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={1} hide={hidden_panel} >
                    <EntityUploader entity="simulation" onUpload={() => setRefreshSimulations(true)} />
                    <SearchField {...searchSimulationsProps} />
                    <EntitiesList entities={simulations} what={"simulation"} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={2} hide={hidden_panel} >
                    <SearchField {...searchWiresProps} />
                    <WiresList signal_groups={props.signal_groups} visible_wires={props.visible_wires}
                        setVisibleWires={props.setVisibleWires} />
                </TabPanel>
                <TabPanel value={selected_tab_id} index={3} hide={hidden_panel} >
                    <SimulationConfig configuration={props.configuration}
                        setConfiguration={props.setConfiguration}
                        selected_simulation={props.selected_simulation}
                    />
                </TabPanel>
            </div>
        </Box>
    );
}