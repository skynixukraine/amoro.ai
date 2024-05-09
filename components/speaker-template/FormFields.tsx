import CallToActionDropdown from '@/components/CallToActionDropdown';
import GenericDropdownControl from '@/components/GenericDropdownControl';
import EmailFooter from '@/components/email-footer/FooterSetup';
import { usePageContext } from '@/context';
import HighlightOff from '@mui/icons-material/HighlightOff';
import Remove from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  SelectChangeEvent,
  Snackbar,
  Divider,
  Typography,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { grey, red } from '@mui/material/colors';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useForm,
  Controller,
  useFieldArray,
  UseFieldArrayReturn,
  Control,
  FormState,
  UseFormGetFieldState,
  UseFormWatch,
  UseFormTrigger,
  UseFormSetValue,
} from 'react-hook-form';
import { generateEmail } from '@/services/openaiService';
import { buildSpeakerOptimizerFormData, onImageUpload } from '@/utils';
import { OptimizerFormFieldType, SpeakerFormValuesType } from '@/common/types';
import SpeakerInput from '@/components/SpeakerInput';
import { speakerFormDefaultValues } from '@/common/constants';
import GoToHomeButton from '../HomeButton';
import SquareIconButton from '../SquareIconButton';
import { StyledCategoryTitle } from '../StyledInput';
import { useSaveContent } from '@/hooks/useSaveContent';
import FooterInput from '../FooterInput';
import classes from './SpeakerGeneratorFormFields.module.css';
import { RemoveCircleOutline } from '@mui/icons-material';
import StyledFileInput from '../StyledFileInput';
import useWindowSize from '@/hooks/useWindowSize';
import AlertContinue from '../AlertContinue';
import ProgressBar from '../ProgressBar';


interface CopyGeneratorFormFieldsProps {
  handleNext: Function;
  handleBack: Function;
  pi: string;
  setPi: (pi: string) => void;
  userId: number;
  veevaApprovalFlag: string;
  setVeevaApprovalFlag: (flag: string) => void;
}

const CopyGeneratorSpeakerFormFields = ({
  handleNext,
  handleBack,
  pi,
  setPi,
  userId,
  veevaApprovalFlag,
  setVeevaApprovalFlag,
}: CopyGeneratorFormFieldsProps) => {
  const handlePiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPi(event.target.value);
  };

  const handleTypeOfVeevaFlag = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setVeevaApprovalFlag(event.target.value as string);
  };

  const { updatePageContext, templateData } = usePageContext();
  const attahmentEleRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null)
  const sessionStorageKey = 'video$generator$frm';
  // const savedFormData = process?.browser ? fetchFromSessionStorage(sessionStorageKey) : {};
  const { saveContent } = useSaveContent();
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState,
    getFieldState,
    setValue,
    reset,
    getValues,
    trigger,
  } = useForm<SpeakerFormValuesType>({
    mode: 'onTouched',
    defaultValues: { ...speakerFormDefaultValues },
  });

  const ctaFieldsArray: UseFieldArrayReturn<
    SpeakerFormValuesType,
    'ctas',
    'id'
  > = useFieldArray({
    control,
    name: 'ctas',
  });

  const footerFieldsArray: UseFieldArrayReturn<
    SpeakerFormValuesType,
    'footers'
  > = useFieldArray({
    control,
    name: 'footers',
  });

  const speakerFieldsArray: UseFieldArrayReturn<
    SpeakerFormValuesType,
    'speakers',
    'id'
  > = useFieldArray({
    control,
    name: 'speakers',
  });

  const { errors } = formState;
  const attachmentThumbnail = watch('attachment');

  // Update page context with form data
  const updatePageContextValues = useCallback(
    (newData: object = {}) => {
      updatePageContext({
        ...newData,
      });
    },
    [updatePageContext]
  );

  // Reset page when clear button clicked
  function onClearBtnClick() {
    reset({ ...speakerFormDefaultValues });
    // deleteFromSessionStorage(sessionStorageKey);
    updatePageContext({
      formData: { ...speakerFormDefaultValues },
      optimizer: { formData: [], emailContent: '' },
      layout: { body: {}, footer: {} },
      export: { subject: '', htmlContent: '' },
    });
  }

  const sizes = useWindowSize();

  // update form with the saved context values
  useEffect(() => {
    const existingFormData = templateData?.formData;
    if (existingFormData) {
      reset({ ...(existingFormData || {}) });
    }

    return () => { };
  }, [templateData, reset]);

  const generateEmailWrapper = useCallback(async (emailTmplData: any) => {
    const email = await generateEmail(emailTmplData);
    return email;
    // let optimizerFormData: Array<OptimizerFormFieldType> = [];
    // if (email) {
    //   const subjectLineArr = email.match(/Subject\s*:\s*(.*)/i);
    //   const [subjectLine] = subjectLineArr || [];

    //   if (subjectLine) {
    //     const additionalFields = getDataForEmailTemplate();
    //     optimizerFormData = convertEmailContentIntoOptimizerFields(email, additionalFields);
    //   }
    // }
    // return {optimizerFormData, emailContent: email};
  }, []);

  // Form submit event
  const onSubmit = useCallback(
    async (formData: SpeakerFormValuesType) => {
      setOpen(true)
      // saveToSessionStorage(sessionStorageKey, formData);

      const { eventType, bodyText1, bodyText2, toneOfVoice, wordsLength } =
        formData;
      const emailTmplData = {
        typeOfEmail: eventType,
        messages: [bodyText1, bodyText2],
        tone: toneOfVoice,
        length: wordsLength,
      };
      // const {optimizerFormData, emailContent } = await generateEmailWrapper(emailTmplData);
      // let emailRawData: string | undefined | null;
      // if(!skipEmailDataGeneration){
      // }
      const emailRawData = await generateEmailWrapper(emailTmplData);
      const { optimizerFormData, emailContent } = buildSpeakerOptimizerFormData(
        formData,
        emailRawData
      );
      //Update the DB
      //  const newId = saveContent({
      //     userId,
      //     currentId: templateData.currentId,
      //     invitationLayout: {
      //       formData,
      //       optimizer: { formData: optimizerFormData, emailContent },
      //     }
      //   });
      updatePageContextValues({
        formData,
        optimizer: { formData: optimizerFormData, emailContent },
        //currentId: newId ? Number(newId) : NaN,
      });
      // }else{
      //   updateGeneratorContextValues({formData});
      // }
      handleNext && handleNext();
    },
    [handleNext, generateEmailWrapper, updatePageContextValues]
  );

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const generateEmailContinueWrapper = useCallback(() => {
    const ctaData = getValues('ctas');
    const attachment = getValues('attachment');
    const attachmentLink = getValues('attachmentLink');
    const { formData } = templateData?.optimizer;
    let tempFormData = [...formData];
    const ctaFields: Array<OptimizerFormFieldType> = [
      ...(ctaData || [])
        .map(({ ctaType, ctaAction, ctaCustomLabel }, index) => ({
          type: 'cta',
          key: index,
          value: '',
          label: 'Button Type ' + (index + 1),
          ctaType,
          ctaAction,
          ctaCustomLabel,
        }))
        .filter(
          ({ ctaType }) =>
            ctaType !== null && ctaType !== undefined && ctaType !== ''
        ),
    ];

    let ctaPosition: { position: number; key: number }[] = [];
    for (let index = 0; index < tempFormData.length; index++) {
      if (tempFormData[index].type === 'cta') {
        ctaPosition.push({
          position: index,
          key: Number(tempFormData[index].key),
        });
      }
    }
    let removeCTAFormData = tempFormData.filter((item) => item.type !== 'cta');
    ctaFields &&
      ctaFields.length > 0 &&
      ctaFields.map((cta, idx) => {
        const position = ctaPosition.find((item) => {
          return item.key == cta.key;
        });
        if (position) {
          removeCTAFormData.splice(position.position, 0, cta);
        }
        if (idx + 1 > ctaPosition.length) {
          if (idx === 0) {
            let paragraphIndex = removeCTAFormData.findIndex(
              (item) => item.type === 'paragraph'
            );
            removeCTAFormData.splice(paragraphIndex + 1, 0, cta);
          } else {
            let lastCtaIndex = removeCTAFormData.findIndex(
              (item) => item.type === 'cta' && item.key === Number(cta.key) - 1
            );
            removeCTAFormData.splice(lastCtaIndex + 1, 0, cta);
          }
        }
      });
    let paragraphIndex = removeCTAFormData.findIndex(
      (item) => item.type === 'paragraph'
    );
    let attachmentThumbnail: OptimizerFormFieldType | null = null;
    if (attachment && attachment !== '') {
      attachmentThumbnail = {
        type: 'imageLink',
        key: 'attachment',
        value: attachment,
        label: '',
        attachmentLink,
        comments: '',
      };
      let attachmentIdx = removeCTAFormData.findIndex(
        (item) => item.type === 'imageLink'
      );
      if (attachmentIdx >= 0) {
        removeCTAFormData[attachmentIdx] = attachmentThumbnail
      } else {
        removeCTAFormData.splice(paragraphIndex + 1, 0, attachmentThumbnail);
      }

    }

    return { fData: removeCTAFormData };
  }, [getValues]);

  const handleFormSubmitContinue = useCallback(() => {
    console.log('dsadaa');
    const formData = getValues();
    const { fData } = generateEmailContinueWrapper();
    updatePageContext({
      formData,
      optimizer: { ...templateData.optimizer, formData: fData },
    });
    handleNext && handleNext();
  }, [handleSubmit]);

  function getFormData() {
    const formData = getValues();
    const { optimizer, layout } = templateData;
    const { formData: existingOptimizerFormData } = optimizer;

    const { optimizerFormData } = buildSpeakerOptimizerFormData(formData);
    let newFormData: Array<OptimizerFormFieldType> = [];
    const keys = ['subject', 'paragraph1', 'paragraph2', 'referenceText'];
    if (existingOptimizerFormData?.length > 0) {
      const tempObj: any = {};

      existingOptimizerFormData.forEach((item, index) => {
        const key = item.key.toString();
        if (keys.includes(key)) {
          tempObj[key] = item;
        }
      });

      keys.forEach((key) => {
        if (tempObj[key]) {
          newFormData.push(tempObj[key]);
        }
        if (key == 'paragraph1') {
          newFormData = [...newFormData, ...optimizerFormData];
        }
      });
    } else {
      newFormData = [...optimizerFormData];
    }

    return {
      newFormData,
      optimizer,
      formData,
      layout
    }
  }

  function onNextButtonClick() {
    let { newFormData, optimizer } = getFormData();
    // let tempObj: any = {};
    // // String, OptimizerFormFieldType
    // optimizerFormData.forEach((item) => {
    //   const { type, key } = item;
    //   const objKey: string = `${type}_${key}`;
    //   tempObj[objKey] = {...item};
    // });

    // const newFormData = existingOptimizerFormData.map(item => {
    //   const { type, key } = item;
    //   const objKey: string = `${type}_${key}`;
    //   if(tempObj[objKey]) {
    //     const temp = {...tempObj[objKey]};
    //     delete tempObj[objKey];
    //     return temp;
    //   }else{
    //     return item;
    //   }
    // });

    // // find last position of cta and add additinal CTAs after that
    // if(Object.keys(tempObj)?.length > 0){

    //   let ctaLastIndex = -1;
    //   newFormData.map(({type, key}, index) => {
    //     if(type === 'cta') ctaLastIndex = index;
    //   });
    //   if(ctaLastIndex === -1){
    //     ctaLastIndex = newFormData?.length == 1 ?  0 : 2;
    //   }

    //   Object.keys(tempObj).forEach((key, index) => {
    //     const item = tempObj[key];
    //     newFormData.splice(ctaLastIndex + index + 1, 0, {...item});
    //     delete tempObj[key];
    //   })
    //   tempObj = null;
    // }

    updatePageContextValues({
      optimizer: { ...optimizer, formData: [...newFormData] },
    });
    handleNext && handleNext();
  }

  const onSaveButtonClick = async () => {
    setIsLoading(true)
    let { newFormData, optimizer, formData, layout } = getFormData();

    const newId = await saveContent({
      userId,
      status: 'Generator',
      currentId: templateData.currentId,
      invitationLayout: {
        optimizer: { ...optimizer, formData: [...newFormData] },
        formData,
        layout,
        pi,
        veevaApprovalFlag,
      }
    });

    if (newId) {
      updatePageContextValues({
        currentId: Number(newId),
        formData: formData
      });
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <>
      <Grid container>
        <Box
          component="form"
          noValidate
          // mt={1}
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <Grid
            container
            item
            className={classes.container}
            xs={12}
            sm={12}
            md={12}
            lg={10}
            xl={10}
            rowSpacing={2}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <StyledCategoryTitle>Event Type</StyledCategoryTitle>
              <FormControl fullWidth error={!!errors?.eventType}>
                <label>Type of Event</label>
                <Controller
                  control={control}
                  name="eventType"
                  rules={{ required: 'Select event type' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="eventType-label"
                      id="eventType-select"
                      // label="What is this event about"
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <MenuItem value="Product Launch">Product Launch</MenuItem>
                      <MenuItem value="Webinar">Webinar</MenuItem>
                      <MenuItem value="Medical Event">Medical Event</MenuItem>
                      <MenuItem value="Internal Event">Internal Event</MenuItem>
                      <MenuItem value="Round table discussion">
                        Round table discussion
                      </MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Controller
                control={control}
                name="speakers"
                // rules={{ required: "What is this video about"}}
                render={({field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label="Who is the speaker?"
                    // error={!!(errors?.aboutVideo)}
                    // helperText={errors?.aboutVideo?.message}
                    placeholder="Who is the speaker? (if any)"
                  />
                )}
              />
            </Grid> */}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <label>Key message 1</label>
              <Controller
                control={control}
                name="bodyText1"
                // rules={{ required: "What is this video about"}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    // label="What do you want to tell them? 1"
                    multiline
                    rows={4}
                    // error={!!(errors?.aboutVideo)}
                    // helperText={errors?.aboutVideo?.message}
                    placeholder="What do you want to tell them?"
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              alignSelf="center"

            // textAlign={'center'}
            >
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <label>Event Thumbnail</label>
                  {currentImage && <img src={URL.createObjectURL(currentImage)} width={64}/>}
                  <Controller
                    control={control}
                    name={'attachment'}
                    render={({ field }) => (
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{ display: attachmentThumbnail ? 'none' : '' }}
                        >
                          <StyledFileInput
                            handleFileChange={async (
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const imageFile =
                                (event.target.files &&
                                  event.target.files.length > 0 &&
                                  event.target.files[0]) ||
                                null;
                              if (imageFile) {
                                setIsUploading(true);
                                let url = await onImageUpload(imageFile);
                                field.onChange(url);
                                setCurrentImage(imageFile)
                                setIsUploading(false)
                              }
                            }}
                            handleDropFileChange={async (
                              event: React.DragEvent<HTMLInputElement>
                            ) => {
                              const droppedFile = event.dataTransfer.files[0];
                              if (droppedFile) {
                                setIsUploading(true);
                                let url = await onImageUpload(droppedFile);
                                field.onChange(url);
                                setCurrentImage(droppedFile)
                                setIsUploading(false)
                              }
                            }}
                          />
                        </div>

                        <label htmlFor="speaker_attachment">
                          {attachmentThumbnail && (
                            <div
                              style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'center',
                              }}
                            >
                              <div
                                style={{
                                  position: 'relative',
                                  height: '120px',
                                  width: '200px',
                                }}
                              >
                                <Image
                                  height="120"
                                  width="200"
                                  alt="Attachment thumbnail"
                                  src={attachmentThumbnail}
                                  style={{
                                    cursor: 'pointer',
                                    objectFit: 'cover',
                                  }}
                                />
                                <HighlightOff
                                  onClick={() => {
                                    field.onChange(null);
                                    (
                                      document.getElementById(
                                        'speaker_attachment'
                                      ) as HTMLInputElement
                                    ).value = '';
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    right: '-12px',
                                    top: '-12px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    fontSize: '30px',
                                    color: red[300],
                                    cursor: 'pointer',
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    )}
                  />
                </FormControl>
              </Grid>
              <FormControl variant="outlined">
                <Controller
                  control={control}
                  name="attachment"
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <input
                        style={{ display: 'none' }}
                        ref={attahmentEleRef}
                        id="speaker_attachment"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={async (
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const imageFile =
                            (event.target.files &&
                              event.target.files.length > 0 &&
                              event.target.files[0]) ||
                            null;
                          if (imageFile) {
                            // if(attachmentThumbnail) {
                            //   URL.revokeObjectURL(attachmentThumbnail)
                            // }
                            let url = await onImageUpload(imageFile);
                            field.onChange(url);

                            // var reader = new FileReader();
                            // reader.readAsDataURL(imageFile);
                            // reader.onloadend = () =>
                            //   field.onChange(reader.result as string);
                          }
                        }}
                      />
                    </div>
                  )}
                />
              </FormControl>
            </Grid>

            {attachmentThumbnail ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Controller
                  control={control}
                  name="attachmentLink"
                  // rules={{ required: "What is this video about"}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Insert exact full URL of attachment(if any)"
                      placeholder="Insert exact full URL of attachment(if any)"
                    />
                  )}
                />
              </Grid>
            ) : null}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <SpeakerList
                speakerFieldsArray={speakerFieldsArray}
                control={control}
                formState={formState}
                getFieldState={getFieldState}
                watch={watch}
              />
            </Grid>

            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl error={!!errors?.videoType} >
                <FormLabel id="video-type-group-label"></FormLabel>
                <Controller
                  control={control}
                  name="videoType"
                  render={({field}) => (
                    <RadioGroup
                      {...field}
                      row
                      aria-labelledby="video-type-group-label"
                      name="videoType"
                    >
                      <FormControlLabel value="url" control={<Radio />} label="Video URL" />
                      <FormControlLabel value="upload" control={<Radio />} label="Upload video" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {(watch('videoType') == 'url' || !watch('videoType')) ? <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Controller
                control={control}
                name="videoURL"
                rules={{ required: "Enter Video URL"}}
                render={({field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label="Video URL"
                    error={!!(errors?.videoURL)}
                    // helperText={errors?.videoURL?.message}
                    placeholder="Video URL"
                  />
                )}
              />
            </Grid> : null }

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} alignSelf="center" textAlign="center">
              <InputLabel sx={{marginBottom: 1.5}}>Video thumbnail</InputLabel>
              <FormControl variant='outlined'>
                  <Controller
                    control={control}
                    name='videoThumbnail'
                    // rules={{ required: true }}
                    render={({field }) => (
                      <>
                        <input
                          style={{ display: 'none' }}
                          id="videoThumbnail"
                          type='file'
                          accept='image/png,image/jpeg'
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const imageFile = event.target.files && event.target.files.length > 0 && event.target.files[0] || null;
                            if(imageFile){
                              if(videoThumbnail) {
                                URL.revokeObjectURL(videoThumbnail)
                              }
                              const videoThumbnailUrl = URL.createObjectURL(imageFile); 
                              field.onChange(videoThumbnailUrl);
                            }
                          }}
                        />
                        <label htmlFor="videoThumbnail">
                          <Image
                            height='120'
                            width='120'
                            alt='Video thumbnail'
                            src={videoThumbnail || '/img/upload-image-icon.png'}
                            style={{ cursor: 'pointer' }}
                          />
                        </label>
                        {videoThumbnail ? <HighlightOff
                          onClick={() => field.onChange(undefined)}
                          sx={{
                            position: 'absolute',
                            right: '-12px',
                            top: '-12px',
                            background: 'white',
                            borderRadius: '50%',
                            fontSize: '30px',
                            color: red[300],
                            cursor: 'pointer'
                          }}
                        /> : null}
                      </>
                    )}
                  />
                </FormControl>
              </Grid> */}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <label>Key message 2</label>
              <Controller
                control={control}
                name="bodyText2"
                // rules={{ required: "What is this video about"}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    // label="What do you want to tell them?"
                    multiline
                    rows={4}
                    // error={!!(errors?.aboutVideo)}
                    // helperText={errors?.aboutVideo?.message}
                    placeholder="What do you want to tell them? 2"
                  />
                )}
              />
            </Grid>

            <CTAList
              ctaFieldsArray={ctaFieldsArray}
              control={control}
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
            />

            {/* <CallToActionDropdown
              control={control} 
              ctaLabel="Select your call to action"
              ctaActionLabel="Call to action URL"
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
            /> */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <StyledCategoryTitle>Event Content Details</StyledCategoryTitle>
            </Grid>
            <GenericDropdownControl
              control={control}
              name="toneOfVoice"
              label="Tone Of Voice"
              formState={formState}
              getFieldState={getFieldState}
              menuItems={[
                { value: '', label: 'Select' },
                { value: 'formal', label: 'Formal' },
                { value: 'friendly', label: 'Friendly' },
                { value: 'informal', label: 'Informal' },
                { value: 'professional', label: 'Professional' },
                { value: 'conversational', label: 'Conversational' },
                // { value: 'humorous', label: 'Humorous' },
              ]}
            />
            <GenericDropdownControl
              control={control}
              name="wordsLength"
              label="Contents Length"
              formState={formState}
              getFieldState={getFieldState}
              menuItems={[
                { value: '', label: 'Select' },
                { value: 'Short < 30 words', label: 'Short < 30 words' },
                {
                  value: 'Medium (30-60 words)',
                  label: 'Medium (30-60 words)',
                },
                { value: 'Long (60-100 words)', label: 'Long (60-100 words)' },
              ]}
            />

            <FooterList
              footerFieldsArray={footerFieldsArray}
              control={control}
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
              setValue={setValue}
            />
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              height={'40px'}
            ></Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <StyledCategoryTitle>Regulatory And Approval</StyledCategoryTitle>
            </Grid>
            <Grid item xs={12}>
              <label>Insert PI/API</label>
              <TextField
                fullWidth
                variant="outlined"
                // label="Insert PI/API"
                placeholder="Insert PI/API"
                margin="normal"
                value={pi}
                onChange={handlePiChange}
                inputProps={{ id: 'insert pi' }}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <label>Do You Have Veeva Approval Code</label>
              <FormControl fullWidth>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="no"
                  row
                  value={veevaApprovalFlag}
                  onChange={handleTypeOfVeevaFlag}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {open &&
              <ProgressBar open={open} message=" Generating..." handleClose={() => { }} isprogress />
            }


            {sizes.width && sizes.width < 768 ? (
              <Grid
                item
                xs={12}
                sx={{
                  '& button': {
                    width: '90%',
                  },
                }}
              >
                <Grid container flexDirection={'column'} alignItems={'center'}>
                  {templateData.optimizer?.formData.length > 0 ? (
                    <Button
                      // type="submit"
                      onClick={() => handleFormSubmitContinue()}
                      variant="contained"
                      color="primary"
                      sx={{
                        color: 'white',
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        textTransform: 'none',
                        marginBottom: '8px',
                      }}
                    >
                      Continue
                    </Button>

                  ) : null}

                  <ProgressButton
                    color={
                      templateData.optimizer?.formData.length > 0
                        ? 'secondary'
                        : 'primary'
                    }
                    trigger={trigger}
                    handleFormSubmit={handleFormSubmit}
                  />
                  <Button
                    onClick={onSaveButtonClick}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderColor: 'primary.main',
                      textTransform: 'none',
                      marginTop: '8px',
                    }}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleBack()}
                    variant="outlined"
                    color="primary"
                    disabled={true}
                    sx={{ borderColor: 'primary.main', textTransform: 'none', marginTop: '8px' }}
                  >
                    Previous
                  </Button>
                  <Divider style={{ margin: '10px 0' }} flexItem>
                    or
                  </Divider>
                  <Button
                    onClick={onClearBtnClick}
                    variant="outlined"
                    color="primary"
                    disabled={true}
                    sx={{
                      borderColor: 'primary.main',
                      textTransform: 'none',
                    }}
                  >
                    Clear all
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                justifyContent={'space-between'}
                item
                mt={2}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                columnSpacing={2}
              >
                <Grid item>
                  <span style={{ marginLeft: '-8px' }}>
                    <GoToHomeButton />
                  </span>
                  <Button
                    onClick={onClearBtnClick}
                    variant="outlined"
                    color="primary"
                    disabled={true}
                    sx={{
                      borderColor: 'primary.main',
                      textTransform: 'none',
                      marginLeft: '8px'
                    }}
                  >
                    Clear All
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    onClick={() => handleBack()}
                    variant="outlined"
                    color="primary"
                    disabled={true}
                    sx={{ borderColor: 'primary.main', textTransform: 'none', marginRight: '8px' }}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={onSaveButtonClick}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderColor: 'primary.main',
                      textTransform: 'none',
                      marginRight: '8px',
                    }}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <ProgressButton
                    color={
                      templateData.optimizer?.formData.length > 0
                        ? 'secondary'
                        : 'primary'
                    }
                    trigger={trigger}
                    handleFormSubmit={handleFormSubmit}
                  />
                  {templateData.optimizer?.formData.length > 0 ? (

                    <Button
                      // type="submit"
                      onClick={() => handleFormSubmitContinue()}
                      variant="contained"
                      color="primary"
                      sx={{
                        color: 'white',
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        textTransform: 'none',
                        marginLeft: '8px'
                      }}
                    >
                      Continue
                    </Button>

                  ) : null}
                </Grid>


              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <Snackbar
        open={isLoading}
        autoHideDuration={6000}
        message="Template Successfully Saved"
      />
       <ProgressBar open={isUploading}  message="Loading..." handleClose={() => setIsUploading(false)}/>
    </>
  );
};
export default React.memo(CopyGeneratorSpeakerFormFields);

type CTADropdownProps = {
  control: Control<SpeakerFormValuesType>;
  formState: FormState<SpeakerFormValuesType>;
  getFieldState: UseFormGetFieldState<SpeakerFormValuesType>;
  watch: UseFormWatch<SpeakerFormValuesType>;
};

type CTAListProps = {
  ctaFieldsArray: UseFieldArrayReturn<SpeakerFormValuesType, 'ctas', 'id'>;
} & CTADropdownProps;

function CTAList({
  ctaFieldsArray,
  control,
  formState,
  getFieldState,
  watch,
}: CTAListProps) {
  const { fields, remove, append } = ctaFieldsArray;

  const addCTAHandler = () => {
    append({
      ctaType: '',
      ctaAction: '',
      ctaCustomLabel: null,
    });
  };

  return (
    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} mt={"20px"}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} position="relative">
        <StyledCategoryTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Call To Action
            <Button
              variant="outlined"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={addCTAHandler}
            >
              Add CTA
            </Button>
          </Box>
        </StyledCategoryTitle>
      </Grid>

      {fields.map((field, index) => {
        return (
          <CallToActionDropdown
            index={index}
            key={field.id}
            control={control}
            ctaLabel={`Button Type ${index + 1}`}
            ctaActionLabel={`Button CTA Link ${index + 1}`}
            ctaCustomLabel={`Custome Call to Action Text ${index + 1}`}
            formState={formState}
            getFieldState={getFieldState}
            watch={watch}
            ctaTypeFieldName={`ctas.${index}.ctaType`}
            ctaActionFieldeName={`ctas.${index}.ctaAction`}
            ctaCustomFieldeName={`ctas.${index}.ctaCustomLabel`}
            onDeleteButtonClick={() => remove(index)}
          />
        );
      })}
    </Grid>
  );
}

type SpeakerListFormProps = {
  control: Control<SpeakerFormValuesType>;
  formState: FormState<SpeakerFormValuesType>;
  getFieldState: UseFormGetFieldState<SpeakerFormValuesType>;
  watch: UseFormWatch<SpeakerFormValuesType>;
};

type SpeakerListProps = {
  speakerFieldsArray: UseFieldArrayReturn<
    SpeakerFormValuesType,
    'speakers',
    'id'
  >;
} & SpeakerListFormProps;

function SpeakerList({
  speakerFieldsArray,
  control,
  formState,
  getFieldState,
  watch,
}: SpeakerListProps) {
  const { fields, remove, append } = speakerFieldsArray;

  const addCTAHandler = () => {
    append({
      topic: '',
      speakerName: '',
      speakerTitle: '',
    });
  };

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      rowSpacing={1}
      mt={3}
      sx={{ borderRadius: 2 }}
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} position="relative">
        <StyledCategoryTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Speaker
            <Button
              variant="outlined"
              color="primary"
              sx={{ textTransform: 'none' }}
              onClick={addCTAHandler}
            >
              Add New
            </Button>
          </Box>
        </StyledCategoryTitle>
      </Grid>
      {fields.map((field, index) => {
        return (
          <SpeakerInput
            key={field.id}
            index={index + 1}
            control={control}
            topicFieldLabel={`Topic ${index + 1}`}
            topicFieldName={`speakers.${index}.topic`}
            nameFieldLabel={`Speaker Name ${index + 1}`}
            nameFieldName={`speakers.${index}.speakerName`}
            titleFieldLabel={`Speaker Title ${index + 1}`}
            titleFieldName={`speakers.${index}.speakerTitle`}
            formState={formState}
            getFieldState={getFieldState}
            onDeleteButtonClick={() => remove(index)}
          />
        );
      })}
    </Grid>
  );
}

// type CATButtonProps = {
//   ctaIndex: number,
//   remove: Function
// } & CTADropdownProps;

// const CallToActionButton = React.memo(function CallToActionButton({
//   ctaIndex, remove, control, formState, getFieldState, watch
// }: CATButtonProps) {

//   function onDeleteButtonClick(event: MouseEvent) {
//     remove(ctaIndex);
//   }

//   return (

//   )
// });

const ProgressButton = ({
  color,
  handleFormSubmit,
  trigger,
}: {
  color: 'primary' | 'secondary';
  handleFormSubmit: Function;
  trigger: UseFormTrigger<SpeakerFormValuesType>;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onButtonClick() {
    const result = await trigger();
    if (result) {
      handleFormSubmit();
      const timer = setInterval(async () => {
        // setLoading(true);
        setProgress((prevProgress: number) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 0;
          }
          return prevProgress + 5;
        });
      }, 1000);
      return true;
    }
    return false;
  }

  useEffect(() => {
    setLoading(false);
    setProgress(0);

    return () => {
      setLoading(false);
      setProgress(0);
    };
  }, []);

  return (
    <Button
      onClick={onButtonClick}
      // type="submit"
      variant="contained"
      color={color}
      sx={{
        color: 'white',
        borderColor: 'primary.main',
        borderWidth: '2px',
        textTransform: 'none',
      }}
      disabled={loading}
    >
      Generate Content
      {/* {loading && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'rgb(26, 144, 255)',
            borderRadius: '5px',
            color: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          {progress}%
        </div>
      )} */}
    </Button>
  );
};

type FooterListProps = {
  footerFieldsArray: UseFieldArrayReturn<SpeakerFormValuesType, 'footers'>;
  setValue: UseFormSetValue<any>;
} & CTADropdownProps;

function FooterList({
  footerFieldsArray,
  control,
  formState,
  setValue,
  getFieldState,
  watch,
}: FooterListProps) {
  const { fields, remove, append } = footerFieldsArray;

  const addContentHandler = () => {
    append({
      text: '',
      image: null,
    });
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <StyledCategoryTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          Footer
          <Button
            sx={{ textTransform: 'none' }}
            onClick={addContentHandler}
            variant="outlined"
          >
            Add New
          </Button>
        </div>
      </StyledCategoryTitle>
      {fields.map((field, index) => {
        return (
          <React.Fragment key={index}>
            <FooterInput
              key={field.id}
              index={index}
              control={control}
              setValue={setValue}
              footerLabel={`Email footer ${index + 1}`}
              logoLabel={`Company Logo ${index + 1}`}
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
              footerFieldName={`footers.${index}.text`}
              logoFieldeName={`footers.${index}.image`}
              onDeleteButtonClick={() => index != 0 && remove(index)}
            />
          </React.Fragment>
        );
      })}
    </Grid>
  );
}
