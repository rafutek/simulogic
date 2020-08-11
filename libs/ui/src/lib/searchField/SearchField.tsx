import React, { useState, useEffect } from 'react';
import {
    makeStyles, Theme, createStyles,
    Paper, IconButton, InputBase
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { Entity, entity, SignalGroup } from '@simulogic/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        icon: {
            padding: 1
        }
    }),
);

export interface SearchFieldProps {
    what: entity | "wire",
    setSearchEntityResult?: (search_result: Entity[]) => void,
    setSearchWiresResult?: (search_result: SignalGroup[]) => void,
    refresh?: boolean,
    setRefresh?: (refresh: boolean) => void
}

export const SearchField = (props: SearchFieldProps) => {

    const classes = useStyles();
    const [search_exp, setSearchExp] = useState<string>();

    const search = () => {
        let search_address: string;
        let setSearchResult: (search_result: Entity[] | SignalGroup[]) => void;

        if (props.what != "wire") {
            setSearchResult = props.setSearchEntityResult;
            search_address = `/${props.what}s`; // to get all simulations or circuits
            if (search_exp && search_exp.length > 0) {
                search_address += `/search/${search_exp}`;
            }
        } else {
            setSearchResult = props.setSearchWiresResult;
            if (search_exp && search_exp.length > 0) {
                search_address = `/simulations/extract/wires/${search_exp}`;
            } else {
                search_address = `/simulations/extract/wires`;
            }
        }
        if (search_address) {
            axios.get(search_address)
                .then(response => {
                    setSearchResult ? setSearchResult(response.data) : null;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchExp(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        search();
    }

    useEffect(() => {
        if (props.refresh) {
            search();
            props.setRefresh ? props.setRefresh(false) : null;
        }
    }, [props.refresh]);

    return (
        <div>
            <Paper component="form" onSubmit={handleSubmit} className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder={`Search ${props.what}s`}
                    onChange={handleChange}
                />
                <IconButton type="submit" className={classes.icon}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    )
}