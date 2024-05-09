import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  onfocus:'none',
  border: 'none',
  outline:'none',
  overflow: 'auto'
};

interface ModalTryForFreeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAcountUsage: React.FC<ModalTryForFreeProps> = ({
  open,
  setOpen,
}) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
           
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight:700, fontSize:'24px', display:'flex',alignItems:'center',gap:'10px'}}>
            <CloseIcon fontSize='medium' style={{cursor:'pointer'}} onClick={()=> handleClose()}/>
            Account Usage Limitations
          </Typography>
          <Typography component="div" style={{color:'#6b7280'}}>
            <p>
              <strong style={{color:'#000'}}>1.Single User:</strong> Each registered account on Amoro is intended for
              use by a single individual only. Sharing of account credentials or
              allowing multiple users to access the same account is strictly
              prohibited.
            </p>
            <p>
                <strong style={{color:'#000'}}>2.Device Limitation:</strong> A single user account may be accessed from a
              maximum of two (2) different user devices, which may include but
              is not limited to personal computers, smartphones, tablets, and
              similar devices. Any attempt to exceed this device limitation may
              result in the suspension or termination of the account.
            </p>
            <p>
            <strong style={{color:'#000'}}>3.Brand Restriction:</strong> Each user account is associated with and
              limited to the use of a single brand or entity, as specified
              during registration. Using the same account for multiple brands or
              entities is not permitted, except under special circumstances. If
              you require access to [Your Software Name] for multiple brands,
              you may submit a written request to our admin team for
              consideration.
            </p>
            <p>
            <strong style={{color:'#000'}}>4.Special Requests:</strong> In cases where users have a legitimate need to
              manage more than one brand, we encourage you to contact our admin
              team and submit a written request outlining the specific reasons
              for the exception. Our team will review such requests on a
              case-by-case basis and determine whether an exception can be
              granted.
            </p>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalAcountUsage;
