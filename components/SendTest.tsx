import { Modal, Box, Button, TextField } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import classes from './AlertContinue.module.css';
import { useState, useMemo } from 'react';
import getCorrectRegularMail from '@/utils/getCorrectRegularMail';
// import axios from 'axios';
import axios from '@/common/config';

const SendTest: React.FC<{
  templateData: any;
  pi: string;
  veevaApprovalFlag: string;
  veevaApproval: string;
}> = ({ templateData, veevaApprovalFlag, veevaApproval, pi }) => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorPreferences = useMemo(() => {
    const { body, footer } = templateData?.layout || {};
    return { body, footer };
  }, [templateData.layout]);

  const handleSendTest = async () => {
    setIsLoading(true);
    const {
      optimizer: { formData: emailData },
      layout: {
        banner: { imgUrl: bannerImage },
      },
    } = templateData;
    const { body: bodyColorsData, footer: footerColorsData } = colorPreferences;

    const htmlContent = await getCorrectRegularMail({
      emailData,
      bannerImage,
      bodyColorsData,
      footerColorsData,
      footerData: templateData.formData.footers,
      pi,
      veevaApprovalFlag,
      veevaApproval,
      variation: templateData.layout.variation,
      isHtml: true,
    });
    axios
      .post('/api/email', {
        html: htmlContent,
        text: 'Test Email',
        to: email,
        subject: 'Mail Test',
      })
      .then(() => {
        console.log('Email sent');
        setIsLoading(false);
      });
  };

  return (
    <>
      <Button
        sx={{ textTransform: 'none', margin: '8px' }}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Send Test
      </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.alertbox}>
          <button className={classes.closebtn} onClick={() => setOpen(false)}>
            <CloseOutlined />
          </button>
          <div className={classes.textbox}>
            <p>Enter your email?</p>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div
            style={{
              gap: '10px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="success"
              onClick={() => handleSendTest()}
            >
              Yes, send
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default SendTest;
