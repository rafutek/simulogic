import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { Entity, entity, SignalGroup } from '@simulogic/core';
import axios from 'axios';
import { List } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WireItem, WireItemProps } from '../wireItem/WireItem';


const useStyles = makeStyles((theme: Theme) => ({
    accordion_details: {
        display: "block"
    }
}));

export interface WiresListProps {
    signal_groups: SignalGroup[]
}

export const WiresList = (props: WiresListProps) => {

    const classes = useStyles();

    interface SignalGroupProps {
        signal_group: SignalGroup
    }
    const SignalGroup = (group_props: SignalGroupProps) => {
        const { signal_group } = group_props;
        const wires_list = <List>
            {signal_group.signals.map((signal, idx) =>
                <WireItem index={idx} name={signal} visible_wires={null} />
            )}
        </List>

        if (signal_group.name) {
            return (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {signal_group.name}
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordion_details}>
                        {wires_list}
                    </AccordionDetails>
                </Accordion>
            )
        }
        else return wires_list
    }

    return (
        <List>
            {props.signal_groups.map(signal_group =>
                <SignalGroup signal_group={signal_group} />
            )}
        </List>
    );
}