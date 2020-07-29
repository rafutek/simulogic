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
    index: number,
    name: string,
    visible_wires: string[]
}

export const WireItem = (props: WireItemProps) => {

    const classes = useStyles();
    const [visible, setVisible] = useState<boolean>();

    const VisibilityOnOffIcon = () => {
        if (visible) {
            return <VisibilityOffIcon />
        } else {
            return <VisibilityIcon />
        }
    }

    const handleVisibility = () => {
        setVisible(!visible);
    }

    useEffect(() => {
        if (props.visible_wires && props.visible_wires.length > 0 &&
            !props.visible_wires.includes(props.name)) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [props.visible_wires])

    return (
        <div>
            <ListItem className={classes.root}>
                <ListItemText>{props.name}</ListItemText>
                <IconButton className={classes.icon} onClick={handleVisibility}>
                    <VisibilityOnOffIcon />
                </IconButton>
            </ListItem>
        </div>
    );
}