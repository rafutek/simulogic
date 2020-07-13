import React from 'react';
import { EntityUploader, EntityUploaderProps } from './EntityUploader';

export default {
    title: 'EntityUploader',
    component: EntityUploader,
};

export const Circuit = () => {
    const props: EntityUploaderProps = {
        entity: "circuit",
        onUpload: () => { console.log("uploaded circuit") }
    }
    return <EntityUploader {...props} />
}

export const Simulation = () => {
    const props: EntityUploaderProps = {
        entity: "simulation",
        onUpload: () => { console.log("uploaded simulation") }
    }
    return <EntityUploader {...props} />
}