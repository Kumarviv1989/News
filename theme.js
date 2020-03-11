import {createMuiTheme} from '@material-ui/core/styles'

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
    spacing: 7,
    typography: {
      // In Chinese and Japanese the characters are usually larger,
      // so a smaller fontsize may be appropriate.
      fontSize: 12,
      htmlFontSize: 16,
  
    },
    palette: {
      primary: indigo,
      secondary: pink,
      error: red,
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },props: {
      MuiButton: {
        size: 'large'
      },
  
      MuiFilledInput: {
        margin: 'dense',
      },
      MuiFormControl: {
        margin: 'dense',
      },
      MuiFormHelperText: {
        margin: 'dense',
      },
      MuiIconButton: {
        size: 'small',
      },
      MuiInputBase: {
        margin: 'dense',dense: "true",
      },
      MuiInputLabel: {
        margin: 'dense',
      },
      MuiListItem: {
        dense: "true",
      },
      MuiOutlinedInput: {
        margin: 'dense',
      },
      MuiFab: {
        size: 'small',
      },
      MuiTable: {
        size: 'small',
      },
      MuiTextField: {
        margin: 'dense',
      },
      MuiToolbar: {
        variant: 'dense',
      },
    },
    overrides:{
      MuiDialogTitle: {
        root: {
          backgroundColor: indigo[200],
          '& h6': {
            color: 'black'
          }
        }
      },
      MuiButton:{
        label:{
          whiteSpace:"nowrap",
          textOverflow:"ellipses"
        }
      }
    }
  });