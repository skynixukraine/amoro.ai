import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Link from 'next/link';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '80vw',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,

  display: 'flex',
  flexDirection: 'column',
};

interface ModalTryForFreeProps {
  open: number|undefined;
  setOpen: React.Dispatch<React.SetStateAction<number|undefined>>;
  deleteDraft: (id: number) => void
}

const ModalConfirm: React.FC<ModalTryForFreeProps> = ({
  open,
  setOpen, 
  deleteDraft
}
) => {
  const handleClose = () => setOpen(undefined);

  return (
    <div>
      <Modal
        open={open !== undefined}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign={'center'}
            marginBottom={"20px"}
          >
           Are you sure you want to delete this draft?
          </Typography>
          <div style={{ display:'flex', flexDirection:'row', gap:"20px" }}>
            <Button variant="outlined" sx={{ textTransform: 'none' }} fullWidth  
            onClick={()=> open && deleteDraft(open )}>
              Confirm
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              fullWidth
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalConfirm;
