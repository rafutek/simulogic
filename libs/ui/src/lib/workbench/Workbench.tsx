import React, { useState, useEffect } from 'react';
import { entity, Entity, WaveDrom, ExtractionDetails, SignalGroup, Configuration } from '@simulogic/core';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import axios from 'axios';
import { TimeDiagram } from '../timeDiagram/TimeDiagram';
import { Player } from '../player/Player';
import { isNullOrUndefined } from 'util';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "grid",
        position: "fixed",
        zIndex: -1,
        height: "100%"
    },
    item: {
        textAlign: "center",
        margin: "auto",
        overflow: "hidden"
    }
}));

export interface WorkbenchProps {
    circuit: Entity,
    simulation: Entity,
    onChangeSimulation: () => void,
    visible_wires: string[],
    configuration: Configuration
}

export const Workbench = (props: WorkbenchProps) => {
    const classes = useStyles();
    const [simulation_wavedrom, setSimulationWaveDrom] = useState<WaveDrom>();
    const [extraction_details, setExtractionDetails] = useState<ExtractionDetails>();
    const [simulation_changed, setSimulationChanged] = useState(false);
    const [new_visible_wires, setNewVisibleWires] = useState(false);

    interface EntityStatusProps {
        what: entity
    }
    const EntityStatus = (status_props: EntityStatusProps) => {
        const default_val = "select a " + status_props.what;
        let entity: Entity;
        if (status_props.what == "circuit") {
            entity = props.circuit;
        } else if (status_props.what == "simulation") {
            entity = props.simulation;
        }
        return (
            <h4>Actual {status_props.what}: {entity ? entity.name : default_val}</h4>
        )
    }

    // Manage simulation change
    useEffect(() => {
        if (props.simulation) {
            handleSimulationChange();
        }
        else {
            setSimulationWaveDrom(null);
        }
    }, [props.simulation]);

    const handleSimulationChange = async () => {
        setSimulationChanged(true);
        setNewVisibleWires(true);
        setExtractionDetails({ uuid_simu: props.simulation.uuid });
    }

    // Manage visible wires change
    useEffect(() => {
        if (new_visible_wires) {
            setNewVisibleWires(false);
        }
        else if (props.visible_wires) {
            const new_extraction: ExtractionDetails = {
                uuid_simu: props.simulation.uuid,
                uuid_circuit: props.circuit?.uuid,
                result: extraction_details.result,
                interval: extraction_details.interval,
                wires: props.visible_wires
            };
            setExtractionDetails(new_extraction);
        }
    }, [props.visible_wires]);

    // Manage configuration change
    useEffect(() => {
        if (props.configuration && simulation_wavedrom) {
            const new_extraction: ExtractionDetails = {
                uuid_simu: props.simulation.uuid,
                uuid_circuit: props.circuit?.uuid,
                result: extraction_details.result,
                wires: extraction_details.wires,
                interval: props.configuration.interval
            };
            setExtractionDetails(new_extraction);
        }
    }, [props.configuration]);

    // Get the simulation extracted from the server
    // when the extraction details change
    useEffect(() => {
        if (extraction_details) {
            axios.post(`/simulations/extract`, extraction_details)
                .then(response => {
                    setSimulationWaveDrom(response.data);
                    if (simulation_changed) {
                        props.onChangeSimulation();
                        setSimulationChanged(false);
                    }
                }).catch(err => console.error(err))
        }
    }, [extraction_details]);

    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item className={classes.item}>
                <EntityStatus what={"circuit"} />
                <EntityStatus what={"simulation"} />
            </Grid>
            <Grid item className={classes.item}
                hidden={isNullOrUndefined(simulation_wavedrom)}
            >
                <TimeDiagram data={simulation_wavedrom} />
            </Grid>
            <Grid item className={classes.item}
                hidden={isNullOrUndefined(simulation_wavedrom)}
            >
                <Player circuit={props.circuit} simulation={props.simulation}
                    wavedrom={simulation_wavedrom}
                    extraction_details={extraction_details}
                    setExtractionDetails={setExtractionDetails}
                    onPlayOrReset={() => {
                        setSimulationChanged(true);
                        setNewVisibleWires(true);
                    }}
                    configuration={props.configuration}
                />
            </Grid>
        </Grid>
    );
}