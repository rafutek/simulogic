import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { IntervalSelector } from '../intervalSelector/IntervalSelector';
import { Configuration, Entity, Interval } from '@simulogic/core';
import UndoIcon from '@material-ui/icons/Undo';
import { TimeShiftInput } from '../timeShiftInput/TimeShiftInput';
import { isEmpty, isNotEmpty } from 'class-validator';

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
    configuration: Configuration,
    setConfiguration: (config: Configuration) => void,
    selected_simulation: Entity
}

export const SimulationConfig = (props: SimulationConfigProps) => {
    const classes = useStyles();

    const [disabled, setDisabled] = useState(true);
    const [start, setStart] = useState<number>();
    const [end, setEnd] = useState<number>();
    const [time_shift, setTimeShift] = useState<number>();

    const isIntervalOK = (start: number, end: number) => {
        if (isEmpty(start) && isNotEmpty(end) && end > 0) {
            return true;
        }
        else if (isEmpty(end) && isNotEmpty(start) && start >= 0) {
            return true;
        }
        else if (isNotEmpty(start) && isNotEmpty(end) && end > 0 && start < end) {
            return true;
        }
        else return false;
    }

    useEffect(() => {
        if (props.selected_simulation && isIntervalOK(start, end)) {
            setDisabled(false);
        }
        else if (time_shift) {
            setDisabled(false);
        }
        else setDisabled(true);
    }, [start, end, time_shift]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const config: Configuration = {};
        if (isIntervalOK(start, end)) config.interval = { start, end };
        if (isNotEmpty(time_shift)) config.time_shift = time_shift;
        props.setConfiguration(config);
    }

    const isUndoDisabled = () => {
        return isEmptyInterval(props.configuration?.interval) &&
            isEmpty(props.configuration?.time_shift);
    }

    const isEmptyInterval = (interval: Interval) => {
        return isEmpty(interval?.start) && isEmpty(interval?.end);
    }

    const handleUndo = () => {
        props.setConfiguration({});
    }

    return (
        <Grid container className={classes.root} direction={"column"} alignItems={"center"}
            component={"form"} onSubmit={handleSubmit} spacing={2}
        >
            <Grid item >
                <IntervalSelector start={start} end={end} setStart={setStart} setEnd={setEnd} />
            </Grid>
            <Grid item>
                <TimeShiftInput time_shift={time_shift} setTimeShift={setTimeShift} />
            </Grid>
            <Grid item>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="contained" color="primary" disabled={isUndoDisabled()}
                            onClick={handleUndo} >
                            <UndoIcon />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" disabled={disabled}
                            type="submit">
                            <CheckIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}