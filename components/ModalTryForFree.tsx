import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Link from 'next/link';
import { useRouter } from 'next/router';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '80vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ModalTryForFreeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTryForFree: React.FC<ModalTryForFreeProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [agreement, setAgreement] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    setButtonDisabled(true);

    const data = {
      'First name': firstName,
      'Last name': lastName,
      'Email address': email,
      Company: companyName,
      Country: country,
      'I agree to privacy policy & the terms and condition of REIAI': agreement
        ? 'yes'
        : 'no',
    };

    console.log(data);

    fetch('/api/google-sheets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log('SUCCESSFULLY SUBMITTED');
        router.push('/templates');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign={'center'}
          >
            Generate Pharma Emailers On The Spot With A Few Clicks
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="First name"
              placeholder="First Name"
              sx={{ mb: 3, mt: 3, width: '80%' }}
            />
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              name="Last name"
              placeholder="Last Name"
              sx={{ mb: 3, width: '80%' }}
            />
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="Email address"
              placeholder="Email address"
              sx={{ mb: 3, width: '80%' }}
              error={email.length > 0 && !emailRegex.test(email)}
              helperText={
                emailRegex.test(email) ? '' : 'Enter a valid email address'
              }
            />
            <TextField
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              name="Company"
              placeholder="Company Name"
              sx={{ mb: 3, width: '80%' }}
            />
            <TextField
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              name="Country"
              placeholder="Country"
              sx={{ mb: 1, width: '80%' }}
            />
            <div
              style={{ width: '80%', display: 'flex', alignItems: 'center' }}
            >
              <Checkbox
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                inputProps={{ 'aria-label': 'modal-agree-terms' }}
              />
              <Typography component={'span'} fontSize={'0.7rem'}>
                I acknowledge and agree with the{' '}
                <Link
                  href="https://drive.google.com/file/d/1NLOTPoOABjECEBFtt63miub1jD-OyMaE/view?usp=sharing"
                  target="_blank"
                >
                  Privacy Policy and Terms and condition
                </Link>{' '}
                of Rei AI.
              </Typography>
            </div>

            <Button
              sx={{ mt: 3, width: '60%' }}
              type="submit"
              variant="contained"
              disabled={
                !(
                  firstName.length > 0 &&
                  lastName.length > 0 &&
                  email.length > 0 &&
                  emailRegex.test(email) &&
                  companyName.length > 0 &&
                  country.length > 0 &&
                  agreement &&
                  !buttonDisabled
                )
              }
            >
              Enter
            </Button>
            {buttonDisabled && <CircularProgress sx={{ mt: 3 }} />}
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalTryForFree;
