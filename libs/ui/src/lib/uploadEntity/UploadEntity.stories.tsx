import React from 'react';
import axios from 'axios';
import { UploadEntity, UploadEntityProps } from './UploadEntity';

export default {
    title: 'Upload entity',
    component: UploadEntity,
};

axios.defaults.baseURL = 'http://localhost:3333';

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