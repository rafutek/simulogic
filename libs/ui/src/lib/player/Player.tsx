import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Box, IconButton } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { ExtractionDetails, Entity, WaveDrom, Configuration } from '@simulogic/core';
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
    wavedrom: WaveDrom,
    extraction_details: ExtractionDetails,
    setExtractionDetails: (extraction_details: ExtractionDetails) => void,
    onPlayOrReset?: () => void,
    configuration: Configuration
}

export const Player = (props: PlayerProps) => {
    const classes = useStyles();
    const [reached_start, setReachedStart] = useState(true);
    const [reached_end, setReachedEnd] = useState(true);

    const getBaseExtraction = () => {
        const extraction: ExtractionDetails = {
            id_simu: props.simulation.id,
            id_circuit: props.circuit?.id,
            result: props.extraction_details?.result,
            from: props.extraction_details?.from,
            to: props.extraction_details?.to,
            wires: props.extraction_details?.wires
        };
        return extraction;
    }

    const handlePlayOrReset = () => {
        console.log("\nplay or reset")
        props.onPlayOrReset ? props.onPlayOrReset() : null;
        const new_extraction = getBaseExtraction();
        new_extraction.result = !new_extraction.result;
        new_extraction.wires = null; // to show all the wires
        props.setExtractionDetails(new_extraction);
    }

    useEffect(() => {
        if (props.wavedrom?.foot.tick.startsWith('-')) {
            setReachedStart(true);
        } else setReachedStart(false);
        if (props.wavedrom?.foot.tick.endsWith('+ ')) {
            setReachedEnd(true);
        } else setReachedEnd(false);
    }, [props.wavedrom]);

    const handleNext = () => {
        console.log("go to next interval");
        const new_extraction = getBaseExtraction();
        const time_shift = props.configuration?.time_shift;
        if (time_shift > 0) {
            new_extraction.from += time_shift;
            new_extraction.to += time_shift;
            props.setExtractionDetails(new_extraction);
        } else {
            const space = new_extraction.to - new_extraction.from;
            new_extraction.to += space;
            new_extraction.from += space;
            props.setExtractionDetails(new_extraction);
        }
    }

    const handlePrevious = () => {
        console.log("go to previous interval");
        const new_extraction = getBaseExtraction();
        const time_shift = props.configuration?.time_shift;
        if (time_shift > 0) {
            new_extraction.from -= time_shift;
            new_extraction.to -= time_shift;
            props.setExtractionDetails(new_extraction);
        } else {
            const space = new_extraction.to - new_extraction.from;
            new_extraction.to -= space;
            new_extraction.from -= space;
            if (new_extraction.from < 0) new_extraction.from = 0;
            props.setExtractionDetails(new_extraction);
        }
    }

    const handleStart = () => {
        console.log("go to start");
    }

    const handleEnd = () => {
        console.log("go to end");
    }

    return (
        <Box className={classes.root}>
            <IconButton className={classes.icon} disabled={reached_start}
                onClick={handleStart}>
                <SkipPreviousIcon />
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_start}
                onClick={handlePrevious}>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton className={classes.icon} onClick={handlePlayOrReset}
                disabled={!(props.circuit && props.simulation)}
            >
                {props.extraction_details?.result ? <ReplayIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_end}
                onClick={handleNext}>
                <NavigateNextIcon />
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_end}
                onClick={handleEnd}>
                <SkipNextIcon />
            </IconButton>
        </Box>
    )
}