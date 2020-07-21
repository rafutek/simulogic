import React, { useState } from 'react';
import { entity, Entity } from '@simulogic/core';
import { Grid, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        alignContent: "center"
    },

}));

export interface WorkbenchProps {
    circuit: Entity,
    simulation: Entity
}

export const Workbench = (props: WorkbenchProps) => {
    const classes = useStyles();

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

    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item>
                <EntityStatus what={"circuit"} />
                <EntityStatus what={"simulation"} />
            </Grid>
            <Grid item >
                item 2
            </Grid>
            <Grid item>
                item 3
            </Grid>
        </Grid>
    );
}