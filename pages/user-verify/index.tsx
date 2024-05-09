import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import Image from 'next/image';
import useWindowSize from '@/hooks/useWindowSize';
import Link from 'next/link';
// import axios from 'axios';
import axios from '@/common/config';

export default function VefiryPage() {
  const sizes = useWindowSize();
  const router = useRouter();
  const isDesktop = sizes.width && sizes.width >= 900;
  const { email } = router.query;
  console.log(router);
  const styleBox = {
    width: isDesktop ? '450px' : '100%',
    minHeight: '320px',
    padding: '10px',
    margin: 'auto',
    boxShadow: `0px 1px 2px -1px rgba(0, 0, 0, 0.1),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1)`,
  };

  useEffect(() => {
    let currentURL;
    if (typeof window !== 'undefined') {
      currentURL = window.location.hostname;
    }
    if (email) {
      // Make a GET request to retrieve the user based on the verificationToken
      axios.post('/api/user/verification', {
        email,
        currentURL,
      });
    }
  }, [email]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <Box sx={styleBox}>
        <Image src="/amoro-logo.png" alt="logo" width={167} height={45} />
        <div style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
          <h3>Registration successful</h3>
          <p>{`Please check email ${email} to verify your account.`}</p>
          <p>
            If you do not see the email verification link, check your Spam Box
          </p>
          <Link href="/home">Home</Link>
        </div>
      </Box>
    </div>
  );
}
