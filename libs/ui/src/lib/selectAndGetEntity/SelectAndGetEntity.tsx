import React, { useState } from 'react';
import { SelectEntity } from '../selectEntity/SelectEntity';
import { GetEntity } from '../getEntity/GetEntity';
import { entity, Entity, Simulation } from '../core'

export interface SelectAndGetEntityProps {
    entity: entity,
    setReceivedEntity: (entity: Simulation | undefined) => void
}

export function SelectAndGetEntity(props: SelectAndGetEntityProps) {

    const [selectedEntity, setSelectedEntity] = useState<Entity>();

    return (
        <div>
            <SelectEntity entity={props.entity} setSelectedEntity={setSelectedEntity} />
            {selectedEntity ? <GetEntity entity={props.entity} id={selectedEntity.id} setReceivedEntity={props.setReceivedEntity} /> : null}
        </div>
    )
}