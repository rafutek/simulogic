import React from 'react';
import { makeStyles, Theme, Box, IconButton } from '@material-ui/core';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ReplayIcon from '@material-ui/icons/Replay';

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

export const Player = () => {
    const classes = useStyles();

    interface IconProps {
        children: React.ReactNode
    }
    const Icon = (icon_props: IconProps) => {
        return <IconButton className={classes.icon}>
            {icon_props.children}
        </IconButton>

    }

    return (
        <Box className={classes.root}>
            <Icon>
                <SkipPreviousIcon />
            </Icon>
            <Icon>
                <NavigateBeforeIcon />
            </Icon>
            <Icon>
                <PlayArrowIcon />
            </Icon>
            <Icon>
                <NavigateNextIcon />
            </Icon>
            <Icon>
                <SkipNextIcon />
            </Icon>
        </Box>
    )
}