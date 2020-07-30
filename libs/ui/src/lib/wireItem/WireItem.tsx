import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Entity, entity } from '@simulogic/core';
import { ListItem, ListItemText, IconButton } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 5
    },
    icon: {
        padding: 1
    }
}));

export interface WireItemProps {
    name: string,
    visible: boolean,
    handleClickVisibility: (wire: string) => void
}

export const WireItem = (props: WireItemProps) => {

    const classes = useStyles();

    const VisibilityOnOffIcon = () => {
        if (props.visible) {
            return <VisibilityOffIcon />
        } else {
            return <VisibilityIcon />
        }
    }

    return (
        <div>
            <ListItem className={classes.root}>
                <ListItemText>{props.name}</ListItemText>
                <IconButton className={classes.icon}
                    onClick={() => props.handleClickVisibility(props.name)}>
                    <VisibilityOnOffIcon />
                </IconButton>
            </ListItem>
        </div>
    );
}