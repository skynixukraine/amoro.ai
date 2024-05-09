import PasswordInput from '@/components/PasswordInput';
import { styledInputPropsSx } from '@/components/StyledInput';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

import classes from '@/components/login/LoginComponent.module.css';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkedRememberMe, setCheckedRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await signIn('credentials', { redirect: false, email, password });
      if(response && response.ok) {
        router.push('/admin');
      }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Box
      sx={{
        width: 'calc(100vw - 32px)',
        height: 'calc(100vh - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: '#F8F7FA',
      }}
    >
      <Box
        sx={{
          maxWidth: '340px',
          backgroundColor: 'white',
          padding: '24px 16px',
          borderRadius: '6px',
          boxShadow: '0px 4px 18px 0px rgba(75, 70, 92, 0.10)',
        }}
      >
        <img src="/amoro-logo.png" width={167} height={45} alt="logo" />
        <p
          style={{
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '125%',
          }}
        >
          Welcome to Amoro 👋
        </p>
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={12}>
            <label>Email ID</label>
            <TextField
              type="email"
              placeholder="Enter your email ID"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ sx: styledInputPropsSx }}
            />
          </Grid>
          <Grid item xs={12}>
            <label>Password</label>
            <PasswordInput password={password} setPassword={setPassword} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" onClick={handleLogin}>
              Sign in
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.rememberMeLost}>
            <FormControlLabel
              label="Remember me"
              sx={{ color: '#6B7280' }}
              control={
                <Checkbox
                  checked={checkedRememberMe}
                  onChange={(event) =>
                    setCheckedRememberMe(event.target.checked)
                  }
                />
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
