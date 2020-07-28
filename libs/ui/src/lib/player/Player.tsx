import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Box, IconButton } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ReplayIcon from '@material-ui/icons/Replay';
import { SimulationProps, Entity, WaveDrom } from '@simulogic/core';
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
    setSimulationWaveDrom: (wavedrom: WaveDrom) => void
}

export const Player = (props: PlayerProps) => {
    const classes = useStyles();
    const [contain_result, setContainResult] = useState(false);
    let post_obj: SimulationProps = {
        id_simu: props.simulation?.id
    };
    const [reached_start, setReachedStart] = useState(true);
    const [reached_end, setReachedEnd] = useState(true);

    const handlePlayOrReset = () => {
        post_obj.id_simu = props.simulation.id;
        post_obj.id_circuit = props.circuit.id;
        post_obj.result = !contain_result;

        axios.post(`/simulations/extract`, post_obj)
            .then(response => {
                props.setSimulationWaveDrom(response.data);
                setContainResult(post_obj.result);
            }).catch(err => {
                console.log(err);
            })
    }

    // Reset Play button when user changes circuit or simulation
    useEffect(() => {
        setContainResult(false);
    }, [props.circuit, props.simulation]);

    return (
        <Box className={classes.root}>
            <IconButton className={classes.icon} disabled={reached_start}>
                <SkipPreviousIcon/>
            </IconButton>
            <IconButton className={classes.icon} disabled={reached_start}>
                <NavigateBeforeIcon />
            </IconButton>
            <IconButton className={classes.icon} onClick={handlePlayOrReset}
                disabled={!(props.circuit && props.simulation)}
            >
                {contain_result ? <ReplayIcon /> : <PlayArrowIcon />}
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