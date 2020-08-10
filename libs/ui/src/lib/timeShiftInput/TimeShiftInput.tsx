import React, { useState, ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';

export interface TimeShiftInputProps {
    time_shift: number,
    setTimeShift: (time_shift: number) => void
}

export const TimeShiftInput = (props: TimeShiftInputProps) => {

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
            props.setTimeShift(val);
        }
    }

    return <TextField onChange={checkAndSet} error={error}
        helperText={error_msg} label="shift" variant="outlined"
    />
}