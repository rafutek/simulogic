import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Entity, entity } from '@simulogic/core';
import { ListItem, ListItemText, IconButton, Input } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 5
    },
    icon: {
        padding: 1
    }
}));

export interface EntityItemProps {
    what: entity,
    entity: Entity
}

export const EntityItem = (props: EntityItemProps) => {

    const classes = useStyles();
    const [edit, setEdit] = useState(false);
    let new_name: string;

    const handleEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(true);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(new_name){
            rename();
        }
    }

    const rename = () => {
        axios.get(`/${props.what}s/${props.entity.id}/rename/${new_name}`)
            .catch(error => {
                console.log(error);
            });
    }

    const handleBlur = (event: any) => {
        setEdit(false);
    }

    const NameField = () => {
        if (!edit) {
            return <ListItemText>{props.entity.name}</ListItemText>
        } else {
            return (
                <ListItemText>
                    <form onSubmit={handleSubmit} >
                        <Input autoFocus placeholder="New name" defaultValue={props.entity.name} 
                        onChange={(e) => new_name = e.target.value} onBlur={handleBlur}/>
                    </form>
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