import React, { useState, useEffect } from 'react';
import { TextField, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';

export interface NumEventsInputProps {
}

export const NumEventsInput = (props: NumEventsInputProps) => {

    const useStyles = makeStyles((theme: Theme) => createStyles(
        {
            root: {
                margin: theme.spacing(1),
            }
        })
    );
    const classes = useStyles();


    return <TextField className={classes.root} onChange={null} error={null}
        helperText={null} label="number of events" variant="outlined"
    />
}