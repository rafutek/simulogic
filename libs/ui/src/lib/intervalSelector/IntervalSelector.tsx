import React, { useState } from 'react';
import { TextField, makeStyles, Theme, createStyles } from '@material-ui/core';

export interface IntervalSelectorProps {
    setFrom: React.Dispatch<React.SetStateAction<number>>,
    setTo: React.Dispatch<React.SetStateAction<number>>
}

export const IntervalSelector = (component_props: IntervalSelectorProps) => {

    const useStyles = makeStyles((theme: Theme) => createStyles(
        {
            root: {
                '& .MuiTextField-root': {
                    margin: theme.spacing(1),
                    width: 100
                }
            }
        })
    );
    const classes = useStyles();

    const [error_from, setErrorFrom] = useState(false);
    const [error_msg_from, setErrorMsgFrom] = useState("");

    const [error_to, setErrorTo] = useState(false);
    const [error_msg_to, setErrorMsgTo] = useState("");

    interface checkInputProps {
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        setError: React.Dispatch<React.SetStateAction<boolean>>,
        setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const checkInput = (props: checkInputProps) => {
        const value = Number(props.event.target.value);
        if (isNaN(value)) {
            props.setError(true);
            props.setErrorMsg("Must be a number.");
        } else {
            props.setError(false);
            props.setErrorMsg("");
            props.setValue(value);
        }
    };

    const from_props: checkInputProps = {
        event: undefined,
        setError: setErrorFrom,
        setErrorMsg: setErrorMsgFrom,
        setValue: component_props.setFrom
    };
    const from_onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        from_props.event = event;
        checkInput(from_props);
    };

    const to_props: checkInputProps = {
        event: undefined,
        setError: setErrorTo,
        setErrorMsg: setErrorMsgTo,
        setValue: component_props.setTo
    };
    const to_onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        to_props.event = event;
        checkInput(to_props);
    };

    const from_input = <TextField onChange={from_onChange} error={error_from}
        helperText={error_msg_from} label="from" variant="outlined"
    />;

    const to_input = <TextField onChange={to_onChange} error={error_to}
        helperText={error_msg_to} label="to" variant="outlined"
    />;

    return (
        <div className={classes.root}>
            {from_input}
            {to_input}
        </div>
    )
}