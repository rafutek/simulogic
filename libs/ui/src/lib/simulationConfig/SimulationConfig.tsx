import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { IntervalSelector } from '../intervalSelector/IntervalSelector';
import { NumEventsInput } from '../numEventsInput/NumEventsInput';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
    },
    "@global": {
        ".MuiFormHelperText-root.Mui-error": {
            color: "white"   
        }
    },
}));

export interface SimulationConfigProps {
}

export const SimulationConfig = (props: SimulationConfigProps) => {
    const classes = useStyles();

    const [disabled, setDisabled] = useState(true);
    const [start, setStart] = useState<number>();
    const [end, setEnd] = useState<number>();

    useEffect(() => {
        if(start && end && start < end) {
            setDisabled(false);
        } else setDisabled(true);
    }, [start, end]);

    const handleConfiguration = () => {
        setDisabled(true);
    }

    return (
        <Grid container className={classes.root} direction={"column"} alignItems={"center"}>
            <Grid item >
                <IntervalSelector start={start} end={end} setStart={setStart} setEnd={setEnd} />
            </Grid>
            <Grid item>
                <NumEventsInput />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" disabled={disabled} 
                    onClick={handleConfiguration}>
                    <CheckIcon />
                </Button>
            </Grid>
        </Grid>
    )
}