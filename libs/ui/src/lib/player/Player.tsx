import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Box, IconButton } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { ExtractionDetails, Entity, WaveDrom, Configuration, Interval } from '@simulogic/core';
import axios from 'axios';
import { isNotEmpty, isEmpty } from 'class-validator';

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
            interval: props.extraction_details?.interval,
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

    const getFullInterval = async () => {
        let full_interval: Interval;
        await axios.get(`/simulations/extract/interval`)
            .then(response => {
                full_interval = response.data;
            }).catch(err => console.error(err));
        return full_interval;
    }

    const handleNext = async () => {
        let time_shift = props.configuration.time_shift;
        const new_extraction = getBaseExtraction();
        const { start, end } = new_extraction.interval;
        const full_interval = await getFullInterval();
        if (isNotEmpty(start) && isNotEmpty(end)) {
            if (isEmpty(time_shift))
                time_shift = end - start;
            if (end + time_shift <= full_interval.end) {
                new_extraction.interval.start += time_shift;
                new_extraction.interval.end += time_shift;
            }
            else {
                new_extraction.interval.end = full_interval.end;
                new_extraction.interval.start = full_interval.end - time_shift;
            }
        }
        else if (isEmpty(start)) { // interval starts from simulation start
            if (isEmpty(time_shift))
                time_shift = end - full_interval.start;
            if (end + time_shift <= full_interval.end) {
                new_extraction.interval.end += time_shift;
                new_extraction.interval.start = full_interval.start + time_shift;
            }
            else {
                new_extraction.interval.end = full_interval.end;
                new_extraction.interval.start = full_interval.end - time_shift;
            }
        }
        props.setExtractionDetails(new_extraction);
    }

    const handlePrevious = async () => {
        let time_shift = props.configuration.time_shift;
        const new_extraction = getBaseExtraction();
        const { start, end } = new_extraction.interval;
        const full_interval = await getFullInterval();
        if (isNotEmpty(start) && isNotEmpty(end)) {
            if (isEmpty(time_shift))
                time_shift = end - start;
            if (start - time_shift >= full_interval.start) {
                new_extraction.interval.start -= time_shift;
                new_extraction.interval.end -= time_shift;
            }
            else {
                new_extraction.interval.start = full_interval.start;
                new_extraction.interval.end = full_interval.start + time_shift;
            }
        }
        else if (isEmpty(end)) { // interval ends at simulation end
            if (isEmpty(time_shift))
                time_shift = full_interval.end - start;
            if (start - time_shift >= full_interval.start) {
                new_extraction.interval.start -= time_shift;
                new_extraction.interval.end = full_interval.end - time_shift;
            }
            else {
                new_extraction.interval.start = full_interval.start;
                new_extraction.interval.end = full_interval.start + time_shift;
            }
        }
        props.setExtractionDetails(new_extraction);
    }

    const handleStart = async () => {
        let time_length: number;
        const new_extraction = getBaseExtraction();
        const { start, end } = new_extraction.interval;
        const full_interval = await getFullInterval();
        if (isNotEmpty(start) && isNotEmpty(end)) {
                time_length = end - start;
        }
        else if (isEmpty(end)) { // interval ends at simulation end
            time_length = full_interval.end - start;
        }
        new_extraction.interval.start = full_interval.start;
        new_extraction.interval.end = full_interval.start + time_length;
        props.setExtractionDetails(new_extraction);
    }

    const handleEnd = async () => {
        let time_length: number;
        const new_extraction = getBaseExtraction();
        const { start, end } = new_extraction.interval;
        const full_interval = await getFullInterval();
        if (isNotEmpty(start) && isNotEmpty(end)) {
                time_length = end - start;
        }
        else if (isEmpty(start)) { // interval starts from simulation start
            time_length = end - full_interval.start;
        }
        new_extraction.interval.end = full_interval.end;
        new_extraction.interval.start = full_interval.end - time_length;
        props.setExtractionDetails(new_extraction);
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