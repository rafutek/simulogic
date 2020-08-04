import React, { useState, useEffect } from 'react';
import { TextField, makeStyles, Theme, createStyles, Grid } from '@material-ui/core';

export interface IntervalSelectorProps {
    from: number,
    to: number,
    setFrom: (from: number) => void,
    setTo: (to: number) => void
}

export const IntervalSelector = (props: IntervalSelectorProps) => {

    const useStyles = makeStyles((theme: Theme) => createStyles(
        {
            container: {
                margin: theme.spacing(1)
            },
            item: {
                // margin: "auto",
                padding: theme.spacing(1)
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

    const from_props: checkInputProps = {
        event: undefined,
        setError: setErrorFrom,
        setErrorMsg: setErrorMsgFrom,
        setValue: props.setFrom
    };
    const from_onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        from_props.event = event;
        checkAndSetInput(from_props);
    };

    const to_props: checkInputProps = {
        event: undefined,
        setError: setErrorTo,
        setErrorMsg: setErrorMsgTo,
        setValue: props.setTo
    };
    const to_onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        to_props.event = event;
        checkAndSetInput(to_props);
    };

    useEffect(() => {
        if (props.from >= props.to) {
            setErrorFrom(true);
            setErrorMsgFrom("Must be less than 'to' value");
        } else {
            setErrorFrom(false);
            setErrorMsgFrom("");
        }
    }, [props.from]);

    useEffect(() => {
        if (props.to <= props.from) {
            setErrorTo(true);
            setErrorMsgTo("Must be greater than 'from' value");
        } else {
            setErrorTo(false);
            setErrorMsgTo("");
        }
    }, [props.to]);

    const from_input = <TextField onChange={from_onChange} error={error_from}
        helperText={error_msg_from} label="from" variant="outlined"
    />;

    const to_input = <TextField onChange={to_onChange} error={error_to}
        helperText={error_msg_to} label="to" variant="outlined"
    />;

    return (
        <Grid container className={classes.container}>
            <Grid item className={classes.item}>{from_input}</Grid>
            <Grid item className={classes.item}>{to_input}</Grid>
        </Grid>
    )
}