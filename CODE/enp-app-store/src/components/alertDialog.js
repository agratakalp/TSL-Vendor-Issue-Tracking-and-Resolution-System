import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({Mode, Head, Warn}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOpen = () => {
      setOpen(!open);
    };
    if(Mode === "A" || Mode === "R" || Mode === "UA"){
        handleClickOpen();
      }
  }, [Mode]);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleNo = () => {
    setOpen(!open);
    window.location.reload();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{Head}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {Warn}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Yes</Button>
          <Button onClick={handleNo} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
