import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { styledInputPropsSx } from '../StyledInput';
import Link from 'next/link';

import classes from './LoginComponent.module.css';
import PasswordInput from '../PasswordInput';
import useWindowSize from '@/hooks/useWindowSize';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const LoginComponent: React.FC<{
  setOpenLoginModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenResetModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenLoginModal, setOpenSignupModal, setOpenResetModal }) => {
  const sizes = useWindowSize();
  const router = useRouter();

  const isDesktop = sizes.width && sizes.width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkedRememberMe, setCheckedRememberMe] = useState(false);

  const theme = useTheme();

  const handleLogin = async () => {
    try {
      let response = await signIn('credentials', { redirect: false, email, password });
      console.log(response);
      if(response && response.ok) {
        setOpenLoginModal && setOpenLoginModal(false);
        router.push('/home');
      }else{
        setError(response?.error || "Server error!")
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Grid container spacing={2} className={classes.container}>
      {error && <Alert severity="error">{error}</Alert>}
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
              onChange={(event) => setCheckedRememberMe(event.target.checked)}
            />
          }
        />
        <Link
          href={isDesktop ? '#' : '/forgot-password'}
          onClick={() => {
            isDesktop && setOpenResetModal 
            ? setOpenResetModal(true)
            : () => {}
          }}
          style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
        >
          Forgot Password?
        </Link>
      </Grid>
      <Grid item xs={12}>
        <p>
          Don&apos;t have an account yet?{' '}
          <Link
            href={isDesktop ? '#' : '/signup'}
            style={{ color: theme.palette.primary.main }}
            onClick={
              isDesktop && setOpenLoginModal && setOpenSignupModal
                ? () => {
                    setOpenLoginModal(false);
                    setOpenSignupModal(true);
                  }
                : () => {}
            }
          >
            Sign up
          </Link>
        </p>
      </Grid>
    </Grid>
  );
};

export default LoginComponent;
