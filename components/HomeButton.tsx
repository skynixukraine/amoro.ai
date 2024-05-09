import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

function GoToHomeButton({}: Props) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onAgree = () => {
    router.push('/');
  };

  return (
    <>
      <Button
        onClick={onAgree}
        variant="outlined"
        color="primary"
        sx={{
          // borderColor: 'primary.main',
          textTransform: 'none',       
        }}
      >
        Back To Home
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to go to the home page? Your data will be lost if
            you go to the home page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
          >
            Disagree
          </Button>
          <Button
            variant="contained"
            onClick={onAgree}
            autoFocus
            sx={{ textTransform: 'none', color: '#fff' }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GoToHomeButton;
