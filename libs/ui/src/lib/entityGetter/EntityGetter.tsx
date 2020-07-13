import React from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { entity, Entity } from '@simulogic/core'

export interface EntityGetterProps {
    entity: entity,
    id: number,
    setReceivedEntity: (entity: Entity) => void
}

export const EntityGetter = (props: EntityGetterProps) => {

    const getEntity = () => {
        axios.get(`/${props.entity}s/${props.id}`)
            .then((response) => {
                console.log(response.data);
                props.setReceivedEntity(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const GetEntityButton = () => {
        return <Button variant="contained" color="primary" onClick={getEntity}>
            Get {props.entity}
        </Button>;
    }

    return (
        <div>
            <GetEntityButton />
        </div>
    )
}