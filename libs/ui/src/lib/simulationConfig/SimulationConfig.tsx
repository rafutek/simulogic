import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Box, IconButton, Grid } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { ExtractionDetails, Entity, WaveDrom } from '@simulogic/core';
import axios from 'axios';
import { IntervalSelector } from '../intervalSelector/IntervalSelector';
import { NumEventsInput } from '../numEventsInput/NumEventsInput';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
    }
}));

export interface SimulationConfigProps {
}

export const SimulationConfig = (props: SimulationConfigProps) => {
    const classes = useStyles();

    const [start, setStart] = useState<number>();
    const [end, setEnd] = useState<number>();


    return (
        <Grid container className={classes.root} direction={"column"} alignItems={"center"}>
            <Grid item >
                <IntervalSelector start={start} end={end} setStart={setStart} setEnd={setEnd} />
            </Grid>
            <Grid item>
                <NumEventsInput />
            </Grid>
        </Grid>
    )
}