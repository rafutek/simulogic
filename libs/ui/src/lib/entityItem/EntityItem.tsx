import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Entity } from '@simulogic/core';
import { ListItem, ListItemText, IconButton, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 5
    },
    icon: {
        padding: 1
    }
}));

export interface EntityItemProps {
    entity: Entity
}

export const EntityItem = (props: EntityItemProps) => {

    const classes = useStyles();
    const [edit, setEdit] = useState(false);

    const handleEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(true);
    }

    const NameField = () => {
        if (!edit) {
            return <ListItemText>{props.entity.name}</ListItemText>
        } else {
            return (
                <ListItemText>
                    <TextField label="New name" defaultValue={props.entity.name} />
                </ListItemText>
            )
        }
    }

    return (
        <div>
            <ListItem className={classes.root}>
                <NameField />
                <IconButton className={classes.icon} onClick={handleEdit}>
                    <EditIcon />
                </IconButton>
                <IconButton className={classes.icon}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </div>
    );
}