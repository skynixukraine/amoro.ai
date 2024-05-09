import React, { useEffect } from 'react';

const PopupSuccess: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '5%',
      }}
    >
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      >
        <p>
          Thank you for reaching out. We will get back to you within 1 business
          days.
        </p>
        <p style={{ paddingTop: '20px' }}>
          If you don&apos;t hear from us, please reach out directly at{' '}
          <a href="mailto:hello@amoro.ai">hello@amoro.ai</a>.
        </p>
      </div>
    </div>
  );
};

export default PopupSuccess;
