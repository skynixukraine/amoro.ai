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
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  packageSelected?: string
}

const ModalPayWithCard: React.FC<ModalTryForFreeProps> = ({
  open,
  setOpen,
  packageSelected
}) => {
  const handleClose = () => setOpen(false);

  const smartLink = process.env.NEXT_PUBLIC_STRIPE_SMART_PACKAGE_CHECKOUT_LINK;
  const premiumLink =
    process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PACKAGE_CHECKOUT_LINK;

  if (!smartLink || !premiumLink)
    return <div>Error! The payments links are not configured!</div>;

  return (
    <div>
      <Modal
        open={open}
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
          >
            Choose the package
          </Typography>
          {packageSelected && packageSelected === 'Smart' && (
            <Link href={smartLink} style={{ margin: '10px' }}>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                fullWidth
              >
                Smart Package
              </Button>
            </Link>
          )}
          {packageSelected && packageSelected === 'Premium' && (
            <Link href={premiumLink} style={{ margin: '10px' }}>
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                fullWidth
              >
                Premium Package
              </Button>
            </Link>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ModalPayWithCard;
