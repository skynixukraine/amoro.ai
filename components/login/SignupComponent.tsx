import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Alert,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import StyledInput, { styledInputPropsSx } from '../StyledInput';
import CountrySelect from '../CountrySelect';
import { CountryType } from '@/common/types';
import Link from 'next/link';

import classes from './SignupComponent.module.css';
import PasswordInput from '../PasswordInput';
import countries from '@/lib/countries';
import useWindowSize from '@/hooks/useWindowSize';
// import axios from 'axios';
import axios from '@/common/config';
import { useRouter } from 'next/router';

const SignupComponent: React.FC<{
  setOpenLoginModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenPrivacyModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setTermsofUseModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  setOpenLoginModal,
  setOpenSignupModal,
  setOpenPrivacyModal,
  setTermsofUseModal,
}) => {
  const sizes = useWindowSize();
  const router = useRouter();

  const isDesktop = sizes.width && sizes.width >= 900;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brand, setBrand] = useState('');
  const [therapyArea, setTherapyArea] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobFunction, setJobFunction] = useState('Others');
  const [country, setCountry] = useState<CountryType>(
    countries.find((country) => country.code === 'SG') || countries[0]
  );
  const [veevaFlag, setVeevaFlag] = useState('no');

  const theme = useTheme();

  const handleSignup = async () => {
    try {
      if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !companyName ||
        !brand ||
        !jobTitle ||
        !jobFunction ||
        !country ||
        !veevaFlag ||
        !therapyArea
      ) {
        setError('Please fill in your information!');
        return;
      } else if (firstName.length < 3 || lastName.length < 3) {
        setError(
          'First name or last name must be at least 3 characters in length'
        );
      } else {
        setError('');
        setLoading(true);
        const res = await axios.post('/api/auth/signup', {
          email,
          password,
          firstName,
          lastName,
          companyName,
          brand,
          jobTitle,
          jobFunction,
          therapyArea,
          country: country.code,
          veevaFlag,
        });

        if (res.status === 201) {
          setLoading(false);
          /*
          await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
          });
          */
          setOpenSignupModal && setOpenSignupModal(false);
          router.push(`/user-verify?email=${email}`);
        }
      }

      const body = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        userGroup: 'Amoro trial users',
      };

      await axios
        .post('/api/contact', body)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err: any) {
      if (err) {
        setLoading(false);
        console.log(err);
        if (err.response.status === 401) {
          setError(err.message);
        } else {
          setError(err.response?.data?.message);
        }
      }
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && <CircularProgress />}
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} md={6}>
          <label>First Name</label>
          <TextField
            required
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Last Name</label>
          <TextField
            required
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Email ID</label>
          <TextField
            required
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Password</label>
          <PasswordInput password={password} setPassword={setPassword} />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Company Name</label>
          <TextField
            required
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Brand</label>
          <TextField
            required
            fullWidth
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Therapy Area</label>
          <TextField
            required
            fullWidth
            value={therapyArea}
            onChange={(e) => setTherapyArea(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Job Title</label>
          <TextField
            required
            fullWidth
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <label>Job Function</label>
            <Select
              fullWidth
              value={jobFunction}
              onChange={(e) => setJobFunction(e.target.value)}
              input={<StyledInput />}
            >
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Medical">Medical</MenuItem>
              <MenuItem value="Commercial Excellence">
                Commercial Excellence
              </MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Digital">Digital</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Innovation">Innovation</MenuItem>
              <MenuItem value="Transformation">Transformation</MenuItem>
              <MenuItem value="Content Team">Content Team</MenuItem>
              <MenuItem value="Agency">Agency</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Country</label>
          <CountrySelect country={country} setCountry={setCountry} />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>Are you using Veeva?</label>
          <FormControl fullWidth sx={{ marginTop: '10px' }}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              row
              value={veevaFlag}
              onChange={(e) => setVeevaFlag(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            required
            control={<Checkbox />}
            label={
              <div className={classes.textPrivacy}>
                <div>Privacy & Policy</div>
                <span className={classes.textGrey}>
                  {/* I have read and agree to Amoro */}I have read and agree to
                  Amoro.AI’s
                </span>
                <Link
                  onClick={() => {
                    isDesktop &&
                      setOpenPrivacyModal &&
                      setOpenPrivacyModal(true);
                    isDesktop &&
                      setOpenSignupModal &&
                      setOpenSignupModal(false);
                  }}
                  className={classes.textLink}
                  href={isDesktop ? '#' : '/privacy-policy'}
                >
                  Privacy Policy
                </Link>
                <span style={{ paddingLeft: '10px' }}>and</span>
                <Link
                  onClick={() => {
                    isDesktop && setTermsofUseModal && setTermsofUseModal(true);
                    isDesktop &&
                      setOpenSignupModal &&
                      setOpenSignupModal(false);
                  }}
                  className={classes.textLink}
                  href={isDesktop ? '#' : '/Terms-of-Use'}
                >
                  Terms of Use
                </Link>
              </div>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" onClick={handleSignup}>
            Sign up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <p>
            Already have an account?{' '}
            <Link
              href={isDesktop ? '#' : '/signin'}
              style={{ color: theme.palette.primary.main }}
              onClick={
                isDesktop && setOpenSignupModal && setOpenLoginModal
                  ? () => {
                      setOpenSignupModal(false);
                      setOpenLoginModal(true);
                    }
                  : () => {}
              }
            >
              Sign in
            </Link>
          </p>
        </Grid>
      </Grid>
    </>
  );
};

export default SignupComponent;
