import { IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { styledInputPropsSx } from './StyledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordInput: React.FC<{
  password: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  placeholder?: string;
}> = ({ password, setPassword, disabled = false, placeholder="Enter your Password", }) => {
  const [viewPassword, setViewPassword] = React.useState(false);
  return (
    <TextField
      disabled={disabled}
      fullWidth
      required
      type={viewPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => {
        if (setPassword) setPassword(e.target.value);
      }}
      error={password?.length < 5 && password.length > 0}
      helperText={
        password?.length < 5 && password.length > 0
          ? 'Password should be at least 5 characters long'
          : ''
      }
      placeholder={placeholder}
      InputProps={{
        sx: styledInputPropsSx,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
