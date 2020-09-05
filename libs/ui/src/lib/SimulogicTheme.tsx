import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[800],
        },
        secondary: {
            main: grey[600],
        },
    },
    overrides: {
        MuiTab: {
            textColorInherit: {
                "&$selected": {
                    "opacity": "" // managed in TabMenu
                }
            }
        },
        MuiAccordionDetails: {
            root: {
                display: "block"
            }
        }
    }
});
