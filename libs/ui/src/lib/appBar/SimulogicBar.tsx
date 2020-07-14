import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {
    makeStyles, Theme, createStyles,
    IconButton, Toolbar, Typography
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';

const repoLink = "https://github.com/rafutek/simulogic";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export const SimulogicBar = () => {
    const classes = useStyles();

    return (
            <AppBar position="static" color="primary">
                <Toolbar variant="dense">
                    <Typography variant="h5" className={classes.title}>
                        Simulogic
                    </Typography>
                    <IconButton href={repoLink} color="secondary">
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
    )
}