import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, Divider } from '@material-ui/core';
import { Entity, entity, SignalGroup } from '@simulogic/core';
import axios from 'axios';
import { List } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WireItem, WireItemProps } from '../wireItem/WireItem';


const useStyles = makeStyles((theme: Theme) => ({
    block: {
        display: "block"
    }
}));

export interface WiresListProps {
    signal_groups: SignalGroup[],
    visible_wires: string[],
    setVisibleWires: (visible_wires: string[]) => void
}

export const WiresList = (props: WiresListProps) => {

    const classes = useStyles();

    const handleClickVisibility = (wire: string) => {
        console.log("handle visibility")
        if (props.visible_wires) {
            if (props.visible_wires.includes(wire)) {
                props.setVisibleWires(props.visible_wires.filter(visible_wire => visible_wire != wire));
            }
            else props.setVisibleWires(props.visible_wires.concat(wire));
        }
    }

    interface SignalGroupProps {
        signal_group: SignalGroup
    }
    const SignalGroup = (group_props: SignalGroupProps) => {
        const { signal_group } = group_props;

        const wires_list = <List>
            {signal_group.signals.map(signal =>
                <WireItem name={signal} visible={props.visible_wires?.includes(signal)}
                    handleClickVisibility={handleClickVisibility} />
            )}
        </List>

        if (signal_group.name) {
            return (
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {signal_group.name}
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        {wires_list}
                    </AccordionDetails>
                </Accordion>
            )
        }
        else return wires_list
    }

    return (
        <List>
            {props.signal_groups ?
                props.signal_groups.map(signal_group =>
                    <SignalGroup signal_group={signal_group} />)
                : null}
        </List>
    );
}