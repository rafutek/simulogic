import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@material-ui/core';

export interface IntervalSelectorProps {
    start: number,
    end: number,
    setStart: (start: number) => void,
    setEnd: (to: number) => void
}

export const IntervalSelector = (props: IntervalSelectorProps) => {

    const [error_start, setErrorFrom] = useState(false);
    const [error_msg_start, setErrorMsgFrom] = useState("");

    const [error_end, setErrorTo] = useState(false);
    const [error_msg_end, setErrorMsgTo] = useState("");

    interface checkInputProps {
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        setError: (error: boolean) => void,
        setErrorMsg: (error_msg: string) => void,
        setValue: (value: number) => void
    };
    const checkAndSetInput = (input_props: checkInputProps) => {
        const value = Number(input_props.event.target.value);
        if (isNaN(value)) {
            input_props.setError(true);
            input_props.setErrorMsg("Must be a number.");
        }
        else if (value < 0) {
            input_props.setError(true);
            input_props.setErrorMsg("Must be equal or greater than 0.");
        }
        else {
            input_props.setError(false);
            input_props.setErrorMsg("");
            input_props.setValue(value);
        }
    };

    const start_props: checkInputProps = {
        event: undefined,
        setError: setErrorFrom,
        setErrorMsg: setErrorMsgFrom,
        setValue: props.setStart
    };
    const onChangeStart = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        start_props.event = event;
        checkAndSetInput(start_props);
    };

    const end_props: checkInputProps = {
        event: undefined,
        setError: setErrorTo,
        setErrorMsg: setErrorMsgTo,
        setValue: props.setEnd
    };
    const onChangeEnd = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        end_props.event = event;
        checkAndSetInput(end_props);
    };

    useEffect(() => {
        if (props.start >= props.end) {
            setErrorFrom(true);
            setErrorMsgFrom("Must be less than end value");
            setErrorTo(true);
            setErrorMsgTo("Must be greater than start value");
        } else {
            setErrorFrom(false);
            setErrorMsgFrom("");
            setErrorTo(false);
            setErrorMsgTo("");
        }
    }, [props.start, props.end]);

    const start_input = <TextField onChange={onChangeStart} error={error_start}
        helperText={error_msg_start} label="interval start" variant="outlined"
        defaultValue={props.start}
    />;

    const end_input = <TextField onChange={onChangeEnd} error={error_end}
        helperText={error_msg_end} label="interval end" variant="outlined"
    />;

    return (
        <Grid container direction={"column"} spacing={1}>
            <Grid item >{start_input}</Grid>
            <Grid item >{end_input}</Grid>
        </Grid>
    )
}