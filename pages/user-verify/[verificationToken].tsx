import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Alert, CircularProgress } from '@mui/material';
// import axios from 'axios';
import axios from '@/common/config';
import Image from 'next/image';
import useWindowSize from '@/hooks/useWindowSize';

export default function VerifyToken() {
  const sizes = useWindowSize();
  const router = useRouter();
  const { verificationToken } = router.query;
  const [isVerify, setIsVerify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isDesktop = sizes.width && sizes.width >= 900;

  useEffect(() => {
    if (verificationToken) {
      // Make a GET request to retrieve the user based on the verificationToken
      axios
        .get(`/api/user/verification?token=${verificationToken}`)
        .then((response) => {
          if (response.status === 200) {
            setIsVerify(true);
            setLoading(false);
            setSuccess(
              response.data.message || 'Your account has been verified.'
            );
          }
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'The email was verified');
          setLoading(false);
        });
    }
  }, [verificationToken]);

  setTimeout(() => {
    router.push('/signin');
  }, 5000);

  const styleBox = {
    width: isDesktop ? '450px' : '100%',
    minHeight: '320px',
    padding: '10px',
    margin: 'auto',
    boxShadow: `0px 1px 2px -1px rgba(0, 0, 0, 0.1),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1)`,
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <Box sx={styleBox}>
        <Image src="/amoro-logo.png" alt="logo" width={167} height={45} />
        <div style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
          {isVerify && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}
        </div>
      </Box>
    </div>
  );
}
