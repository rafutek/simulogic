import React from 'react';
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            hidden={value != index}
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


export const TabMenu = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState<number>();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (newValue == value) {
            newValue = null; // to toggle the tab panel
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
                <TabPanel value={value} index={0}>
                    Item One
            </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
            </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
            </TabPanel>
                <TabPanel value={value} index={3}>
                    Item Four
            </TabPanel>
                <TabPanel value={value} index={4}>
                    Item Five
            </TabPanel>
            </div>
        </div>
    );
}