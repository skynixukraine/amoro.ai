import React from 'react';
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';

const StyledInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 10,
    position: 'relative',
    backgroundColor: '#f9fafb',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '16px 14px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    color: '#6B7280',
    marginTop: '10px',
  },
}));

export const styledInputPropsSx = {
  borderRadius: 3,
  backgroundColor: '#f9fafb',
  marginTop: '10px',
};

export const StyledCategoryTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#F9FAFB',
        color: '#111928',
        padding: 15,
        paddingLeft: '1rem',
        fontSize: '1.2rem',
        fontWeight: 700,
        marginBottom: '1rem',
      }}
    >
      {children}
    </div>
  );
};

export default StyledInput;
