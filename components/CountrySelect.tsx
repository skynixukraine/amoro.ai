import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styledInputPropsSx } from './StyledInput';
import { CountryType } from '@/common/types';
import countries from '@/lib/countries';

const CountrySelect: React.FC<{
  country: CountryType;
  setCountry?: React.Dispatch<React.SetStateAction<CountryType>>;
  disabled?: boolean;
}> = ({ country, setCountry, disabled = false }) => {
  return (
    <Autocomplete
      disabled={disabled}
      value={country}
      onChange={(event: any, newValue: CountryType | null) => {
        if (newValue && setCountry) setCountry(newValue);
      }}
      fullWidth
      disableClearable
      options={countries}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label} ({option.code})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          InputProps={{
            ...params.InputProps,
            sx: styledInputPropsSx,
            startAdornment: (
              <img
                src={`https://flagcdn.com/w20/${country?.code.toLowerCase()}.png`}
                style={{ height: 'auto', width: '28px', marginRight: '10px' }}
              />
            ),
          }}
        />
      )}
    />
  );
};

export default CountrySelect;
