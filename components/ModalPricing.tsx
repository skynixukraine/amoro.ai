import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PricingCard from './PricingCard';
import { PriceType } from '@/common/types';

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
  onfocus: 'none',
  border: 'none',
  outline: 'none',
  overflow: 'auto',
};

interface ModalPricingProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  prices: Array<PriceType>;
  selectedButtonIndex: number | null;
}

const ModalPricing: React.FC<ModalPricingProps> = ({
  open,
  setOpen,
  prices,
  selectedButtonIndex,
}) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modalpricing"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              fontWeight: 700,
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CloseIcon
              fontSize="medium"
              style={{ cursor: 'pointer' }}
              onClick={() => handleClose()}
            />
            Select Payment
          </Typography>
          <Typography component="div" style={{ color: '#6b7280' }}>
            <div style={{ paddingTop: '16px' }}>
              {/* <div
                style={{
                  background: '#EBF5FF',
                  color: '#1E429F',
                  borderRadius: '6px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: 600,
                    gap: '4px',
                    marginBottom: '16px',
                  }}
                >
                  <InfoRoundedIcon fontSize="small" />
                  <div>
                    Monthly Basis Payment And 20% Discount Using Card Payment
                  </div>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '21px' }}>
                  You can buy a package with monthly basis payment for only{' '}
                  <strong style={{ color: '#1E429F' }}>$850/month</strong> or{' '}
                  <strong style={{ color: '#1E429F' }}>claim 20%</strong>{' '}
                  Discount using Card Payment
                </div>
              </div> */}
            </div>
            <PricingCard
              prices={prices}
              selectedButtonIndex={selectedButtonIndex}
            />
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalPricing;
