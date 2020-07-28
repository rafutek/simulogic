import React, { useState, useEffect } from 'react';
import { entity, Entity, WaveDrom, SimulationProps } from '@simulogic/core';
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
    simulation: Entity
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

    useEffect(() => {
        if (props.simulation) {
            const post_obj: SimulationProps = {
                id_simu: props.simulation.id
            };
            axios.post(`/simulations/extract`, post_obj)
                .then(response => {
                    console.log(response.data)
                    setSimulationWaveDrom(response.data);
                }).catch(err => {
                    console.log(err);
                })
        }
        else {
            setSimulationWaveDrom(null);
        }
    }, [props.simulation])

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
                    setSimulationWaveDrom={setSimulationWaveDrom} />
            </Grid>
        </Grid>
    );
}