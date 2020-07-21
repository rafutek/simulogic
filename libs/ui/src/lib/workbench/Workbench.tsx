import React, { useState, useEffect } from 'react';
import { entity, Entity, WaveDrom, SimulationProps } from '@simulogic/core';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import axios from 'axios';
import { TimeDiagram } from '../timeDiagram/TimeDiagram';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        alignContent: "center"
    },
    item: {
        textAlign: "center"
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
    }, [props.simulation])

    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item className={classes.item}>
                <EntityStatus what={"circuit"} />
                <EntityStatus what={"simulation"} />
            </Grid>
            <Grid item className={classes.item}>
                <TimeDiagram data={simulation_wavedrom} />
            </Grid>
            <Grid item className={classes.item}>
                item 3
            </Grid>
        </Grid>
    );
}