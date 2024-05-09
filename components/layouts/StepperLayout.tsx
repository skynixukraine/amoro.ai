import * as React from 'react';
import {
  Box,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import StepperComponent from '@/components/Stepper';
import { ColorPreferenceType, StepType } from '@/common/types';
import useWindowSize from '@/hooks/useWindowSize';
import { StyledCategoryTitle } from '../StyledInput';
import { useCallback, useState, useEffect } from 'react';
import { TwitterPicker } from 'react-color';
import { usePageContext } from '@/context';
import { onImageUpload } from '@/utils';
import ProgressBar from '../ProgressBar';

type Props = {
  steps: Array<StepType>;
  children?: React.ReactNode;
  stepIndex: number
};

const StepperLayout = ({ steps, stepIndex }: Props) => {
  const { updatePageContext, templateData } = usePageContext();
  const [activeStep, setActiveStep] = React.useState(stepIndex);
  const [isUploading, setIsUploading] = React.useState(false);
  useEffect(() => {
    setActiveStep(stepIndex)
  }, [stepIndex])

  const sizes = useWindowSize();
  const [openColorPicker1, setOpenColorPicker1] = useState(false);
  const [openColorPicker2, setOpenColorPicker2] = useState(false);

  const [uploadFileName, setUploadFileName] = useState('');

  const updateBannerImage = useCallback(
    (upload: string, imgUrl: string | null) => {
      const { layout } = templateData;
      updatePageContext({
        layout: {
          ...layout,
          banner: { upload, imgUrl },
        },
      });
    },
    [templateData, updatePageContext]
  );

  const updateColorPreferences = useCallback(
    (key: string, preferences: ColorPreferenceType) => {
      const { layout } = templateData;
      let newPreferences;
      if (key === 'body') newPreferences = { body: { ...preferences } };
      if (key === 'footer') newPreferences = { footer: { ...preferences } };
      updatePageContext({
        layout: { ...layout, ...newPreferences },
      });
    },
    [templateData, updatePageContext]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true)
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.files && e.target.files[0] && setUploadFileName(e.target.files[0].name)
    let url = await onImageUpload(file);
    // const reader = new FileReader();
    // reader.onloadend = () => {
      if (url) {
        updateBannerImage('yes', url);
      }
      // };
      // reader.readAsDataURL(file);
    setIsUploading(false)
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
    <Box sx={{ bgcolor: '#ffffff', display: 'flex', justifyContent: 'center' }}>
      <Grid
        container
        sx={{
          paddingTop: sizes.width && sizes.width < 768 ? 0 : 4,
          paddingBottom: 4,
          margin: 0,
          fontWeight: 500,
          fontFamily: 'Inter',
          maxWidth: '1280px',
          width: '100%'
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <Box
            bgcolor={'#fff'}
            sx={{
              px: 3,
              pt: sizes.width && sizes.width < 768 ? 0 : 3,
              pb: 3,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <StepperComponent activeStep={activeStep} steps={steps} />
            {activeStep === 2 && (
              <>
                {sizes.width && sizes.width < 768 ? (
                  <Box sx={{ marginTop: '24px' }} />
                ) : (
                  <Divider sx={{ my: '32px' }} flexItem />
                )}
                <div style={{ width: '100%' }}>
                  <StyledCategoryTitle>Customize Design</StyledCategoryTitle>
                  <label>1. Banner/email header</label>
                  <RadioGroup
                    value={templateData.layout.banner.upload}
                    onChange={(e) => updateBannerImage(e.target.value, null)}
                    row
                  // sx={{ marginBottom: '16px' }}
                  >
                    <Tooltip title="Upload a 16:9 banner for optimised results">
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                    </Tooltip>
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                  {templateData.layout.banner.upload === 'yes' && (
                    <div style={{ marginBottom: '16px', marginTop: '10px' }}>
                      <label style={{ fontWeight: 500 }}>Upload Image</label>
                      <div
                        style={{
                          background: '#F9FAFB',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          border: '1px solid #D1D5DB',
                          cursor: 'pointer',
                          position: 'relative',
                          margin: '10px 0px',
                        }}
                      >
                        <div
                          style={{
                            background: '#0F6937',
                            flex: '1',
                            color: 'white',
                            borderRadius: '8px 0 0 8px',
                            height: '100%',
                            width: '40%',
                            padding: '14px 20px',
                            fontSize: 13
                          }}
                        >
                          Choose file
                        </div>
                        <div
                          style={{
                            flex: '2',
                            width: '60%',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '10px',
                            fontSize: '10px',
                            paddingRight: '10px',
                            wordBreak: 'break-all',
                          }}
                        >
                          {uploadFileName !== ''
                            ? uploadFileName
                            : 'No file chosen'}
                        </div>
                        <input
                          type="file"
                          className="upload-input"
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: 0,
                            cursor: 'pointer',
                          }}
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  )}
                  <div style={{ height: '16px' }}></div>
                  <label>2. Colors</label>
                  <RadioGroup
                    onChange={(e) =>
                      updateColorPreferences('body', {
                        colorPreference: e.target.value == 'yes' ? 'yes' : 'no',
                        preferredColor: '#000',
                      })
                    }
                    row
                  // sx={{ marginBottom: '5px' }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Select Color"
                      value="yes"
                    />

                    <FormControlLabel
                      control={<Radio />}
                      label="By Default"
                      value="no"
                    />
                  </RadioGroup>
                  {templateData.layout.body.colorPreference == 'yes' && (
                    <>
                      <ClickAwayListener
                        onClickAway={() => setOpenColorPicker1(false)}
                      >
                        <>
                          <Box display="flex" alignItems="center">
                            <Box
                              width={36}
                              height={36}
                              mr={1}
                              border={'1px solid gray'}
                              bgcolor={templateData.layout.body.preferredColor}
                              onClick={() => setOpenColorPicker1((openColorPicker1) => !openColorPicker1)}
                            />
                            <Typography
                              variant="body1"
                              component={'p'}
                              color={
                                templateData.layout.body.preferredColor !==
                                  '#ffffff'
                                  ? templateData.layout.body.preferredColor
                                  : '#000000'
                              }
                              fontWeight={700}
                              fontSize={'20px'}
                              textAlign={'center'}
                            >
                              {templateData.layout.body.preferredColor}
                            </Typography>
                          </Box>
                          {openColorPicker1 && (<TwitterPicker
                            color={templateData.layout.body.preferredColor}
                            onChangeComplete={(color) =>
                              updateColorPreferences('body', {
                                colorPreference: 'yes',
                                preferredColor: color.hex,
                              })
                            }
                          />)}
                        </>
                      </ClickAwayListener>
                    </>
                  )}
                  <div style={{ height: '16px' }}></div>
                  <label>3. Footer Color</label>
                  <RadioGroup
                    onChange={(e) =>
                      updateColorPreferences('footer', {
                        colorPreference: e.target.value == 'yes' ? 'yes' : 'no',
                        preferredColor: '#000',
                      })
                    }
                    row
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label="Select Color"
                      value="yes"
                    />

                    <FormControlLabel
                      control={<Radio />}
                      label="By Default"
                      value="no"
                    />
                  </RadioGroup>
                  {templateData.layout.footer.colorPreference == 'yes' && (
                    <>
                      <ClickAwayListener
                        onClickAway={() => setOpenColorPicker2(false)}
                      >
                        <>
                          <Box display="flex" alignItems="center">
                            <Box
                              width={36}
                              height={36}
                              mr={1}
                              border={'1px solid gray'}
                              bgcolor={templateData.layout.footer.preferredColor}
                              onClick={() => setOpenColorPicker2((openColorPicker2) => !openColorPicker2)}
                            />
                            <Typography
                              variant="body1"
                              color={
                                templateData.layout.footer.preferredColor !==
                                  '#ffffff'
                                  ? templateData.layout.footer.preferredColor
                                  : '#000000'
                              }
                              fontWeight={700}
                              fontSize={'20px'}
                              textAlign={'center'}
                            >
                              {templateData.layout.footer.preferredColor}
                            </Typography>
                          </Box>
                          {openColorPicker2 && (
                            <TwitterPicker
                              color={templateData.layout.footer.preferredColor}
                              onChangeComplete={(color) =>
                                updateColorPreferences('footer', {
                                  colorPreference: 'yes',
                                  preferredColor: color.hex,
                                })
                              }
                            />
                          )}
                        </>
                      </ClickAwayListener>
                    </>
                  )}
                </div>
              </>
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={9}
          padding={0}
          sx={{ maxWidth: '100vw' }}
        >
          <Box sx={{ bgcolor: '#ffffff', p: 3, pt: sizes.width && sizes.width < 768 ? 0 : 3, mt: sizes.width && sizes.width < 768 ? 0 : 3 }}>
            {steps.map(({ component }, index) =>
              activeStep === index
                ? React.cloneElement(component, {
                  key: index,
                  handleNext,
                  handleBack,
                })
                : null
            )}
          </Box>
        </Grid>
      </Grid>
    </Box >
    <ProgressBar open={isUploading}  message="Loading..." handleClose={() => setIsUploading(false)}/>
    </>

  );
};

export default StepperLayout;
