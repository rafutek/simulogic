import React from 'react';
import BaseBar from '@material-ui/core/AppBar';
import {
    makeStyles, Theme, createStyles,
    IconButton, Toolbar, Typography
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

const repoLink = "https://github.com/rafutek/simulogic";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0
        },
        title: {
            flexGrow: 1,
            color: theme.palette.primary.main,
            font: "small-caps bold 24px fantasy"
        },
        color: {
            backgroundColor: "#c3cfe8"
        }
    }),
);

export const AppBar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BaseBar position="static" className={classes.color} >
                <Toolbar variant="dense">
                    <Typography variant="h5" className={classes.title}>
                        Simulogic
                    </Typography>
                    <IconButton href={repoLink} color="secondary">
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </BaseBar>
        </div>
    )
}