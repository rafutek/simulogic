import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { entity } from '@simulogic/core';
import { Input, Button, makeStyles, Theme, createStyles } from '@material-ui/core';

export interface EntityUploaderProps {
    entity: entity,
    onUpload: () => void,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: theme.spacing(1)
        },
        button: {
            width: "100%"
        }
    }),
);

export const EntityUploader = (props: EntityUploaderProps) => {
    const classes = useStyles();

    // const [files, setFiles] = useState<FileList>();

    const Extension = Object.freeze({ "circuit": ".logic", "simulation": ".simu" })
    const extension = Extension[props.entity];

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i]);
            }
            axios.post(`/${props.entity}s`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(val => {
                props.onUpload();
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    return (
        <div className={classes.root}>
            <input
                hidden
                accept={extension}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleInput}
            />
            <label htmlFor="contained-button-file">
                <Button className={classes.button} variant="contained" color="primary"
                    component="span">
                    <AddIcon />
                </Button>
            </label>
        </div>
    )
}