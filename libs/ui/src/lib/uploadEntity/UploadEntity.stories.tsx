import React from 'react';
import { UploadEntity, UploadEntityProps } from './UploadEntity';

export default {
    title: 'Upload entity',
    component: UploadEntity,
};

export const Circuit = () => {
    const props: UploadEntityProps = {
        entity: "circuit",
        onUpload: () => { console.log("uploaded circuit") }
    }
    return <UploadEntity {...props} />
}

export const Simulation = () => {
    const props: UploadEntityProps = {
        entity: "simulation",
        onUpload: () => { console.log("uploaded simulation") }
    }
    return <UploadEntity {...props} />
}