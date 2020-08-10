import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { IntervalSelector } from '../intervalSelector/IntervalSelector';
import { NumEventsInput } from '../numEventsInput/NumEventsInput';
import { Configuration, Entity } from '@simulogic/core';
import UndoIcon from '@material-ui/icons/Undo';
import { TimeShiftInput } from '../timeShiftInput/TimeShiftInput';

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
    const [max_events, setMaxEvents] = useState<number>();
    const [time_shift, setTimeShift] = useState<number>();

    useEffect(() => {
        if (props.selected_simulation && start >= 0 && end > 0 && start < end) {
            setDisabled(false);
        }
        else if (time_shift) {
            setDisabled(false);
        }
        else if (max_events) {
            setDisabled(false);
        }
        else setDisabled(true);
    }, [start, end, time_shift, max_events]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const config: Configuration = {
            interval_start: start,
            interval_end: end,
            time_shift: time_shift,
            max_events: max_events
        };
        props.setConfiguration(config);
    }

    const isUndoDisabled = () => {
        if (props.configuration?.interval_start != null ||
            props.configuration?.time_shift != null || props.configuration?.max_events != null
        ) {
            return false;
        }
        else return true;
    }

    const handleUndo = () => {
        const config: Configuration = {
            interval_start: null,
            interval_end: null,
            time_shift: null,
            max_events: null
        };
        props.setConfiguration(config);
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
                <NumEventsInput max_events={max_events} setMaxEvents={setMaxEvents} />
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