import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, Divider } from '@material-ui/core';
import { SignalNamesGroup } from '@simulogic/core';
import { List } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WireItem } from '../wireItem/WireItem';


const useStyles = makeStyles((theme: Theme) => ({
    block: {
        display: "block"
    }
}));

export interface WiresListProps {
    signal_groups: SignalNamesGroup[],
    visible_wires: string[],
    setVisibleWires: (visible_wires: string[]) => void
}

export const WiresList = (props: WiresListProps) => {

    const classes = useStyles();

    const handleClickVisibility = (wire: string) => {
        if (props.visible_wires) {
            if (props.visible_wires.includes(wire)) {
                props.setVisibleWires(props.visible_wires.filter(visible_wire => visible_wire != wire));
            }
            else props.setVisibleWires(props.visible_wires.concat(wire));
        }
    }

    interface SignalGroupProps {
        signal_group: SignalNamesGroup
    }
    const SignalGroup = (group_props: SignalGroupProps) => {
        const { signal_group } = group_props;

        if (signal_group.signals_names && signal_group.signals_names.length > 0) {
            const wires_list = <List>
                {signal_group.signals_names.map(signal =>
                    <WireItem key={signal} name={signal} visible={props.visible_wires?.includes(signal)}
                        handleClickVisibility={handleClickVisibility} />
                )}
            </List>

            if (signal_group.group_name) {
                return (
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {signal_group.group_name}
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                            {wires_list}
                        </AccordionDetails>
                    </Accordion>
                )
            }
            else return wires_list
        } else return null
    }

    return (
        <List>
            {props.signal_groups ?
                props.signal_groups.map(signal_group =>
                    <SignalGroup key={signal_group.group_name} signal_group={signal_group} />)
                : null}
        </List>
    );
}