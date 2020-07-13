import React, { useState } from 'react';
import { EntitySelector } from '../entitySelector/EntitySelector';
import { EntityGetter } from '../entityGetter/EntityGetter';
import { entity, Entity } from '@simulogic/core'

export interface EntitySelectorAndGetterProps {
    entity: entity,
    setReceivedEntity: (entity: Entity) => void
}

export function EntitySelectorAndGetter(props: EntitySelectorAndGetterProps) {

    const [selectedEntity, setSelectedEntity] = useState<Entity>();

    return (
        <div>
            <EntitySelector entity={props.entity} setSelectedEntity={setSelectedEntity} />
            {selectedEntity ? <EntityGetter entity={props.entity} id={selectedEntity.id} setReceivedEntity={props.setReceivedEntity} /> : null}
        </div>
    )
}