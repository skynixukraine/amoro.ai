import { Alert, Button, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { styledInputPropsSx } from '../StyledInput';
// import axios from 'axios';
import axios from '@/common/config';
import classes from './LoginComponent.module.css';

const ResetComponent: React.FC<{
  setOpenResetModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setResetSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenResetModal, setResetSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    let currentURL;
    if (typeof window !== 'undefined') {
      currentURL = window.location.hostname;
    }
    if (!email) return;
    try {
      const res: any = await axios.post('/api/user/password', {
        email,
        currentURL,
      });
      if (res.status === 200) {
        setResetSuccess && setResetSuccess(true);
        setOpenResetModal && setOpenResetModal(false);
      } else {
        setError(`Reset failed: ${res?.error}`);
      }
    } catch (e: any) {
      setError(`Reset failed: ${e?.error}`);
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
        <Button fullWidth variant="contained" onClick={handleReset}>
          Reset password
        </Button>
      </Grid>
    </Grid>
  );
};

export default ResetComponent;
