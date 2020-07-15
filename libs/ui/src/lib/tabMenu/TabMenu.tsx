import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MemoryIcon from '@material-ui/icons/Memory';
import InputIcon from '@material-ui/icons/Input';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        position: "fixed",
        height: "100%"
    },
    tabs: {
        color: "white",
    },
    tab: {
        minWidth: 0,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    },
    bottom: {
        position: "fixed",
        bottom: 0
    },
    panels: {
        backgroundColor: theme.palette.secondary.main
    }
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    hide: boolean;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, hide, ...other } = props;

    return (
        <div
            hidden={hide || value != index}
            {...other}
        >
            {value == index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export const TabMenu = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [hidePanel, setHidePanel] = useState(true);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        // Toggle tab panel
        if (hidePanel) {
            setHidePanel(false);
        }
        else if (newValue == value) {
            setHidePanel(true);
        }
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                className={classes.tabs}
            >
                <Tab icon={<MemoryIcon />} className={classes.tab} />
                <Tab icon={<InputIcon />} className={classes.tab} />
                <Tab icon={<SettingsInputComponentIcon />} className={classes.tab} />
                <Tab icon={<BuildIcon />} className={classes.tab} />
                <Tab icon={<SettingsIcon />} className={`${classes.tab} ${classes.bottom}`} />
            </Tabs>
            <div className={classes.panels}>
                <TabPanel value={value} index={0} hide={hidePanel} >
                    Item One
            </TabPanel>
                <TabPanel value={value} index={1} hide={hidePanel} >
                    Item Two
            </TabPanel>
                <TabPanel value={value} index={2} hide={hidePanel} >
                    Item Three
            </TabPanel>
                <TabPanel value={value} index={3} hide={hidePanel} >
                    Item Four
            </TabPanel>
                <TabPanel value={value} index={4} hide={hidePanel} >
                    Item Five
            </TabPanel>
            </div>
        </div>
    );
}