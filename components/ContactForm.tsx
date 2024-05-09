import * as React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Snackbar,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import useWindowSize from '@/hooks/useWindowSize';
import { ChangeEvent } from 'react';
import classes from './video-template/FormFields..module.css';
import PopupSuccess from './ContactFormSuccess';
// import axios from 'axios';
import axios from '@/common/config';

const ContactForm: React.FC = () => {
  const formInit = {
    name: '',
    email: '',
    contactNumber: '',
    country: '',
    company: '',
    isAmoroUser: '',
    enquiryType: '',
  };
  const [formData, setFormData] = React.useState(formInit);
  const [show, setShow] = React.useState<boolean>(false);
  // console.log(formData);
  // const [success, setSuccess] = React.useState(false);

  const sizes = useWindowSize();
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value as string,
    });
  };
  const handleChangeIsAmoroUser = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value as string,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const htmlContent = `
        <strong>Name:</strong> ${formData.name} <br />
        <strong>Email:</strong> ${formData.email} <br />
        <strong>Contact Number:</strong> ${formData.contactNumber} <br />
        <strong>Country:</strong> ${formData.country} <br />
        <strong>Company:</strong> ${formData.company} <br />
        <strong>Amoro User:</strong> ${formData.isAmoroUser} <br />
        <strong>Enquiry Type:</strong> ${formData.enquiryType} <br />
      `;
    await axios
      .post('/api/email', {
        html: htmlContent,
        type: 'gmail',
        text: 'Contact Email',
        to: 'amoro3388@gmail.com',
        subject: 'Contact Email',
      })
      .then(() => {
        setShow(true);
        hanldeConfirm();
      });
  };
  const hanldeConfirm = async () => {
    const htmlconfirm = `
     Thank you for reaching out to us. If you don't hear from us within 1 business day, please reach out directly to us at <a href="mailto:hello@amoro.ai">hello@amoro.ai</a> <br />
`;
    await axios
      .post('/api/email', {
        html: htmlconfirm,
        type: 'gmail',
        text: 'Amoroai Confirm Email',
        to: formData.email,
        subject: 'Amoroai Confirm Email',
      })
      .then(() => {
        setFormData(formInit);
      });
  };

  return (
    <>
      {/* <Snackbar
        open={success}
        autoHideDuration={3000}
        message="Send email successfully"
      /> */}
      <Grid container>
        {show ? (
          <PopupSuccess />
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '1280px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: `${sizes.width && sizes.width < 768 ? '90%' : '90%'}`,
                  display: 'flex',
                  flexWrap: 'wrap',
                  marginTop: `${
                    sizes.width && sizes.width < 768 ? '20px' : '20px'
                  }`,
                  marginBottom: '20px',
                }}
              >
                <p className={classes.text_lable}>Name</p>
                <TextField
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  style={{ marginBottom: '5px', marginTop: '10px' }}
                />

                <p className={classes.text_lable}>Email address</p>
                <TextField
                  // label="Email address"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  style={{ marginBottom: '5px', marginTop: '10px' }}
                />

                <p className={classes.text_lable}>Contact number</p>
                <TextField
                  // label="Contact number"
                  variant="outlined"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  style={{ marginBottom: '5px', marginTop: '10px' }}
                />

                <p className={classes.text_lable}>Country</p>
                <TextField
                  // label="Country"
                  variant="outlined"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  fullWidth
                  required
                  style={{ marginBottom: '5px', marginTop: '10px' }}
                />

                <p className={classes.text_lable}>Company</p>
                <TextField
                  // label="Company"
                  variant="outlined"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  fullWidth
                  required
                  style={{ marginBottom: '5px', marginTop: '10px' }}
                />
                <FormControl variant="outlined" fullWidth>
                  {/* <InputLabel htmlFor="isAmoroUser">Are you a current user of AMORO?</InputLabel> */}
                  <p className={classes.text_lable}>
                    Are you a current user of AMORO?
                  </p>

                  <Select
                    // label="Are you a current user of AMORO?"
                    name="isAmoroUser"
                    value={formData.isAmoroUser}
                    onChange={handleChangeIsAmoroUser}
                    required
                    style={{ marginBottom: '5px', marginTop: '10px' }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" fullWidth>
                  {/* <InputLabel htmlFor="enquiryType">Select your enquiry type</InputLabel> */}
                  <p className={classes.text_lable}>Select your enquiry type</p>
                  <Select
                    // label="Select your enquiry type"
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleChangeIsAmoroUser}
                    required
                    style={{ marginBottom: '5px', marginTop: '10px' }}
                  >
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Collaboration">Collaboration</MenuItem>
                    <MenuItem value="Acquisition">Acquisition</MenuItem>
                    <MenuItem value="Investment">Investment</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
                <Box mt={2}>
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </Box>
              </div>
            </div>
          </form>
        )}
      </Grid>
    </>
  );
};

export default ContactForm;
