import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Grid, Button, Alert, CircularProgress } from '@mui/material';
import PasswordInput from '@/components/PasswordInput';
// import axios from 'axios';
import axios from '@/common/config';
import Image from 'next/image';
import useWindowSize from '@/hooks/useWindowSize';

export default function Password() {
  const router = useRouter();
  const { resetToken } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sizes = useWindowSize();

  useEffect(() => {
    if (resetToken) {
      // Make a GET request to retrieve the user based on the resetToken
      axios
        .get(`/api/user/password?resetToken=${resetToken}`)
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'An error occurred');
          setLoading(false);
        });
    }
  }, [resetToken]);

  const handleReset = async () => {
    if (password != confirmPassword) {
      setError('The new password and confirm password do not match');
      return;
    }
    let { email }: any = user;
    if (!email && !resetToken) return;
    try {
      setLoading(true);
      const res = await axios.put('/api/user/password', {
        email,
        resetToken,
        newPassword: password,
      });

      if (res.status === 200) {
        setLoading(false);
        router.push('/signin');
      }
    } catch (e) {
      setError('An error occurred');
      alert(e);
    }
  };

  const styleBox = {
    width: '100%',
    minHeight: '420px',
    padding: '10px',
    margin: 'auto',
    boxShadow: `0px 1px 2px -1px rgba(0, 0, 0, 0.1),
    0px 1px 3px 0px rgba(0, 0, 0, 0.1)`,
    backgroundColor: '#fff',
    marginTop: sizes.width && sizes.width > 767 ? '180px' : 0,
    marginBottom: sizes.width && sizes.width > 767 ? '150px' : 0,
    zIndex: 999,
  };

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'relative',
        }}
      >
        {sizes.width && sizes.width > 767 && (
          <Image
            src="/img/top-shape.svg"
            alt="logo"
            width={200}
            height={200}
            style={{
              position: 'absolute',
              top: 0,
              left: -30,
            }}
          />
        )}
        <Box sx={styleBox}>
          <Image src="/amoro-logo.png" alt="logo" width={167} height={45} />
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <CircularProgress />}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <Link
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  marginBottom: '16px',
                }}
                href="/"
              ></Link>
            </div>
            <p
              style={{
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '125%',
              }}
            >
              Create new password?
            </p>
            <Grid item xs={12}>
              <label>New Password</label>
              <PasswordInput
                password={password}
                setPassword={setPassword}
                placeholder="Enter your new password"
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <label>Confirm password</label>
              <PasswordInput
                password={confirmPassword}
                setPassword={setConfirmPassword}
                placeholder="Enter confirmation password"
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleReset}
                disabled={loading || error == 'The reset token was expired'}
              >
                Save password
              </Button>
            </Grid>
          </div>
        </Box>
        {sizes.width && sizes.width > 767 && (
          <Image
            src="/img/bottom-shape.svg"
            alt="logo"
            width={150}
            height={150}
            style={{
              position: 'absolute',
              bottom: 0,
              right: -60,
            }}
          />
        )}
      </div>
    </div>
  );
}
