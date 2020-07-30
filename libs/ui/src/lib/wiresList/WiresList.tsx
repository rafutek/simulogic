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
    signal_groups: SignalGroup[]
}

export const WiresList = (props: WiresListProps) => {

    const classes = useStyles();
    const [visible_wires, setVisibleWires] = useState<string[]>([]);


    const handleClickVisibility = (wire: string) => {
        if (visible_wires.includes(wire)) {
            setVisibleWires(visible_wires.filter(visible_wire => visible_wire != wire));
        }
        else setVisibleWires(visible_wires.concat(wire));
    }

    interface SignalGroupProps {
        signal_group: SignalGroup
    }
    const SignalGroup = (group_props: SignalGroupProps) => {
        const { signal_group } = group_props;

        const wires_list = <List>
            {signal_group.signals.map(signal =>
                <WireItem name={signal} visible={visible_wires.includes(signal)}
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

    const listWires = (signal_groups: SignalGroup[]) => {
        let wires_list: string[] = [];
        signal_groups.forEach(signal_group => {
            wires_list.push(...signal_group.signals);
        });
        return wires_list;
    }

    // Set all wires each time signal groups change
    useEffect(() => {
        if (props.signal_groups) {
            setVisibleWires(listWires(props.signal_groups));
        }
    }, props.signal_groups);

    return (
        <List>
            {props.signal_groups ?
                props.signal_groups.map(signal_group =>
                    <SignalGroup signal_group={signal_group} />)
                : null}
        </List>
    );
}