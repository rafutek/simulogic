import React, { useState, useEffect } from 'react';
import { entity, Entity, WaveDrom, SimulationProps, SignalGroup } from '@simulogic/core';
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
        margin: "auto"
    }
}));

export interface WorkbenchProps {
    circuit: Entity,
    simulation: Entity,
    getAndSetSignalGroups: () => void,
    visible_wires: string[]
}

export const Workbench = (props: WorkbenchProps) => {
    const classes = useStyles();
    const [simulation_wavedrom, setSimulationWaveDrom] = useState<WaveDrom>();

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
            getSimulationAndWires();
        }
        else {
            setSimulationWaveDrom(null);
        }
    }, [props.simulation]);

    const getSimulationAndWires = async () => {
        console.log("get simu and wires")
        await getSimulation();
        props.getAndSetSignalGroups();
    }

    const getSimulation = async () => {
        const post_obj: SimulationProps = {
            id_simu: props.simulation.id
        };
        await axios.post(`/simulations/extract`, post_obj)
            .then(response => {
                setSimulationWaveDrom(response.data);
            }).catch(err => console.error(err))
    }

    // Manage visible wires change
    useEffect(() => {
        if (props.visible_wires) {
            console.log("workbench visible wires:", props.visible_wires);
        }
    }, [props.visible_wires]);


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
                    setSimulationWaveDrom={setSimulationWaveDrom}
                    getAndSetWires={props.getAndSetSignalGroups}
                />
            </Grid>
        </Grid>
    );
}