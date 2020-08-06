import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';

export interface NumEventsInputProps {
    max_events: number,
    setMaxEvents: (max_events: number) => void
}

export const NumEventsInput = (props: NumEventsInputProps) => {

    const [error, setError] = useState(false);
    const [error_msg, setErrorMsg] = useState("");

    const checkAndSet = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = Number(event.target.value);
        if (isNaN(val) || val <= 0) {
            setError(true);
            setErrorMsg("Must be a number greater than 0.")
        }
        else {
            setError(false);
            setErrorMsg("");
            props.setMaxEvents(val);
        }
    }

    return <TextField onChange={checkAndSet} error={error}
        helperText={error_msg} label="number of events" variant="outlined"
    />
}