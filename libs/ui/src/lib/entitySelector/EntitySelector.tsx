import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { List, ListItem, Dialog } from '@material-ui/core';
import { entity, Entity } from '@simulogic/core'

export interface EntitySelectorProps {
    entity: entity;
    setSelectedEntity: (entity: Entity) => void;
}

export const EntitySelector = (props: EntitySelectorProps) => {

    const [data, setData] = useState<[]>();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<Entity>();

    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        axios.get(`/${props.entity}s`)
            .then(function (response) {
                setData(response.data);
                setOpenDialog(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const EntitiesDialog = () => {
        if (data && data.length > 0) {
            return (
                <Dialog open={openDialog} onClose={handleClose}>
                    <List>
                        {data.map((entity: Entity) =>
                            <ListItem button onClick={() => handleClick(entity)} key={entity.uuid}>
                                {entity.name}
                            </ListItem>
                        )}
                    </List>
                </Dialog>
            )
        } else return null;
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleClick = (entity: Entity) => {
        setOpenDialog(false);
        setSelectedEntity(entity);
        props.setSelectedEntity(entity);
    };

    return (
        <div>
            <Button onClick={onClick} variant="contained" color="primary">
                Select {props.entity}
            </Button>
            <EntitiesDialog />
            {selectedEntity ?
                <p>{selectedEntity.name} (id={selectedEntity.uuid})</p>
                : null
            }
        </div>
    )
}