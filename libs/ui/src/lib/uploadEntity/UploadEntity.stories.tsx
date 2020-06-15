import React from 'react';
import axios from 'axios';
import { UploadEntity } from './UploadEntity';

export default {
    title: 'Upload entity',
    component: UploadEntity,
};

axios.defaults.baseURL = 'http://localhost:3333';

const onUpload = (value: boolean) => {
    console.log("uploaded file")
}

export const Circuit = () => <UploadEntity entity="circuit" onUpload={onUpload} />

export const Simulation = () => <UploadEntity entity="simulation" onUpload={onUpload} />