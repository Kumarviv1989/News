import React,{useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
 function Alert({msg,onHide,show,isError}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const title = isError ? "Error":"Message";
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={show}
        onClose={onHide}
        fullWidth={true}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onHide} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Alert;