import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ 
  title,
  message, 
  isOpen, 
  onClickPositiveButton,
  closeWhenClickOutside = true,
  shouldShowNegativeButton = false,
  onClickNegativeButton = () => {},
  positiveButtonText = "Ok",
  negativeButtonText = "Hủy",
}) {

  const handleClose = () => {
    if (closeWhenClickOutside) {
      onClickNegativeButton();
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            shouldShowNegativeButton &&
            <Button onClick={onClickNegativeButton}>
              {negativeButtonText}
            </Button>
          }
          <Button onClick={onClickPositiveButton}>
            {positiveButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
