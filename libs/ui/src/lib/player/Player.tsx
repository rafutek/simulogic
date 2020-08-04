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

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        display: "inline-block",
        borderRadius: 5
    },
    icon: {
        color: "white",
        borderRadius: 5,
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.3)"
        }
    }
}));

export interface PlayerProps {
    circuit: Entity,
    simulation: Entity,
    setSimulationWaveDrom: (wavedrom: WaveDrom) => void,
    extraction_details: ExtractionDetails,
    setExtractionDetails: (extraction_details: ExtractionDetails) => void,
    onPlayOrReset?: () => void
}

export const Player = (props: PlayerProps) => {
    const classes = useStyles();
    const [contain_result, setContainResult] = useState(false);
    let post_obj: ExtractionDetails = {
        id_simu: props.simulation?.id
    };
    const [reached_start, setReachedStart] = useState(true);
    const [reached_end, setReachedEnd] = useState(true);

    const handlePlayOrReset = () => {
        console.log("\nplay or reset")
        props.onPlayOrReset ? props.onPlayOrReset() : null;
        const new_extraction: ExtractionDetails = {
            id_simu: props.simulation.id,
            id_circuit: props.circuit.id,
            result: !props.extraction_details.result,
            from: props.extraction_details.from,
            to: props.extraction_details.to,
            wires: null // to show all the wires
        };
        props.setExtractionDetails(new_extraction);
    }

    return (
        <Box className={classes.root}>
            <IconButton className={classes.icon} disabled={reached_start}>
                <SkipPreviousIcon />
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_start}>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton className={classes.icon} onClick={handlePlayOrReset}
                disabled={!(props.circuit && props.simulation)}
            >
                {props.extraction_details?.result ? <ReplayIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_end}>
                <NavigateNextIcon />
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_end}>
                <SkipNextIcon />
            </IconButton>
        </Box>
    )
}