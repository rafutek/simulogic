import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { entity, WaveDrom } from '@simulogic/core'

export interface GetEntityProps {
    entity: entity,
    id: number,
    setReceivedEntity: (entity: WaveDrom | undefined) => void
}

export const GetEntity = (props: GetEntityProps) => {

    const [data, setData] = useState<WaveDrom | undefined>();

    const getEntity = () => {
        axios.get(`/${props.entity}s/${props.id}`)
            .then((response) => {
                console.log(response.data);
                setData(response.data);
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
            {data ? <p>received {props.entity}</p> : null}
        </div>
    )
}