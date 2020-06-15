import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export interface UploadEntityProps {
    entity: "simulation" | "circuit";
    onUpload: (uploaded: true) => void;
}

export const UploadEntity = (props: UploadEntityProps) => {

    const [file, setFile] = useState<File>();
    const [uploaded, setUploaded] = useState(false);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            axios.post(`/${props.entity}s`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(() => {
                    setUploaded(true);
                    props.onUpload(true);
                })
                .catch((error) => {
                    setUploaded(false);
                    props.onUpload(true);
                    console.log(error);
                });
        }
    }

    const UploadButton = () => {
        if (file) {
            return (
                <div>
                    <Button type="submit" variant="contained" color="primary">
                        Upload
                    </Button>
                    {uploaded ? <p>uploaded</p> : <p>not uploaded</p>}
                </div>
            )
        }
        else return null;
    }

    const Extension = Object.freeze({ "circuit": ".logic", "simulation": ".simu" })
    const extension = Extension[props.entity];

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    hidden
                    accept={extension}
                    id={`contained-button-file-${extension}`}
                    type="file"
                    onChange={onChange}
                />
                <label htmlFor={`contained-button-file-${extension}`}>
                    <Button variant="contained" color="primary" component="span">
                        Choose {props.entity} to upload
                    </Button>
                </label>

                <h3>file: {file?.name}</h3>
                <UploadButton />
            </form>
        </div>
    )
}