import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Box, IconButton } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { ExtractionDetails, Entity, WaveDrom } from '@simulogic/core';
import axios from 'axios';
import { IntervalSelector } from '../intervalSelector/IntervalSelector';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        
    }
}));

export interface SimulationConfigProps {
}

export const SimulationConfig = (props: SimulationConfigProps) => {
    const classes = useStyles();

    const [from, setFrom] = useState<number>();
    const [to, setTo] = useState<number>();


    return (
        <div>
            <IntervalSelector from={from} to={to}
                setFrom={setFrom} setTo={setTo}
            />

        </div>
    )
}