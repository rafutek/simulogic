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
    onRename?: () => void,
    onDelete?: () => void,
    selected_entity: Entity,
    setSelectedEntity: (entity: Entity) => void
}

export const EntityItem = (props: EntityItemProps) => {

    const classes = useStyles();
    const [edit, setEdit] = useState(false);
    let new_name: string;

    const getKey = () => {
        const key = `${props.what}_${props.entity.id}`;
        console.log(key)
        return key;
    }

    const handleEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(true);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (new_name) {
            rename();
        }
    }

    const rename = () => {
        axios.get(`/${props.what}s/${props.entity.id}/rename/${new_name}`)
            .then(val => {
                props.entity.name = new_name;
                setEdit(false);
                props.onRename ? props.onRename() : null;
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleBlur = (event: any) => {
        setEdit(false);
    }

    const handleDelete = (event: any) => {
        axios.delete(`/${props.what}s/${props.entity.id}`)
            .then(val => {
                props.onDelete ? props.onDelete() : null;
                props.setSelectedEntity(null); // the selected entity has been deleted
            })
            .catch(error => {
                console.log(error);
            });
    }

    const NameField = () => {
        if (!edit) {
            return <ListItemText>{props.entity.name}</ListItemText>
        } else {
            return (
                <ListItemText>
                    <form onSubmit={handleSubmit} >
                        <Input autoFocus placeholder="New name" defaultValue={props.entity.name}
                            onChange={(e) => new_name = e.target.value} onBlur={handleBlur} />
                    </form>
                </ListItemText>
            )
        }
    }

    const isSelected = (current_entity: Entity, selected_entity: Entity) => {
        return selected_entity && current_entity && selected_entity.id == current_entity.id;
    }

    return (
        <ListItem className={classes.root} button
            selected={isSelected(props.entity, props.selected_entity)}
            onClick={() => props.setSelectedEntity(props.entity)}
        >
            <NameField />
            <IconButton className={classes.icon} onClick={handleEdit}
                disabled={!isSelected(props.entity, props.selected_entity)}>
                <EditIcon />
            </IconButton>
            <IconButton className={classes.icon} onClick={handleDelete}
                disabled={!isSelected(props.entity, props.selected_entity)}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
}