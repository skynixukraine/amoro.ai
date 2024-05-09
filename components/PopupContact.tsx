import React from 'react';
import ContactForm from './ContactForm';
import { Box, Modal } from '@mui/material';

const CloseWindowSvg: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <g clipPath="url(#clip0_93_1369)">
      <path
        d="M9.61317 8L15.6517 1.96146C15.7607 1.85622 15.8476 1.73033 15.9074 1.59114C15.9672 1.45195 15.9986 1.30225 16 1.15077C16.0013 0.999286 15.9724 0.849059 15.915 0.708852C15.8577 0.568645 15.773 0.441266 15.6658 0.334148C15.5587 0.22703 15.4314 0.142318 15.2911 0.0849552C15.1509 0.0275921 15.0007 -0.00127326 14.8492 4.30753e-05C14.6978 0.00135941 14.548 0.0328313 14.4089 0.0926224C14.2697 0.152413 14.1438 0.239326 14.0385 0.34829L8 6.38683L1.96146 0.34829C1.74629 0.140474 1.45811 0.0254816 1.15898 0.0280809C0.859851 0.0306803 0.57371 0.150663 0.362187 0.362187C0.150663 0.57371 0.0306803 0.859851 0.0280809 1.15898C0.0254816 1.45811 0.140474 1.74629 0.34829 1.96146L6.38683 8L0.34829 14.0385C0.239326 14.1438 0.152413 14.2697 0.0926224 14.4089C0.0328313 14.548 0.00135941 14.6978 4.30753e-05 14.8492C-0.00127326 15.0007 0.0275921 15.1509 0.0849552 15.2911C0.142318 15.4314 0.22703 15.5587 0.334148 15.6658C0.441266 15.773 0.568645 15.8577 0.708852 15.915C0.849059 15.9724 0.999286 16.0013 1.15077 16C1.30225 15.9986 1.45195 15.9672 1.59114 15.9074C1.73033 15.8476 1.85622 15.7607 1.96146 15.6517L8 9.61317L14.0385 15.6517C14.2537 15.8595 14.5419 15.9745 14.841 15.9719C15.1401 15.9693 15.4263 15.8493 15.6378 15.6378C15.8493 15.4263 15.9693 15.1401 15.9719 14.841C15.9745 14.5419 15.8595 14.2537 15.6517 14.0385L9.61317 8Z"
        fill="#111928"
      />
    </g>
    <defs>
      <clipPath id="clip0_93_1369">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
interface PopupProps {
  open: boolean;
  onClose: () => void;
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1024,
  bgcolor: '#fff',
  boxShadow: 24,
  p: 4,
  borderRadius: '24px',
  height: '80vh',
};

const Popup: React.FC<PopupProps> = ({ open, onClose }) => {
  const loginStyles = {
    ...style,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={loginStyles}>
        <div style={{ flexGrow: 1 }}>
          <CloseWindowSvg onClick={onClose} />
          <span style={{ marginLeft: '12px' }}>Close</span>
        </div>
        <p
          style={{
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '125%',
            paddingTop: '20px',
            paddingLeft: '5%',
          }}
        >
          Contact Us
        </p>
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            overflowY: 'auto',
            maxHeight: 'calc(80vh - 80px)',
          }}
        >
          <ContactForm />
        </div>
      </Box>
    </Modal>
  );
};

export default Popup;
