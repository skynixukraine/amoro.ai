import CallToActionDropdown from '@/components/CallToActionDropdown';
import GenericDropdownControl from '@/components/GenericDropdownControl';
import EmailFooter from '@/components/email-footer/FooterSetup';
import { usePageContext } from '@/context';
import HighlightOff from '@mui/icons-material/HighlightOff';
import classes from './FormFields..module.css';
import SearchIcon from '@mui/icons-material/Search';
import Remove from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Tooltip,
} from '@mui/material';
import { grey, red } from '@mui/material/colors';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
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
import {
  convertEmailContentIntoOptimizerFields,
  deleteFromSessionStorage,
  fetchFromSessionStorage,
  onImageUpload,
  saveToSessionStorage,
} from '@/utils';
import { FooterContentType, OptimizerFormFieldType, VideoFormValuesType } from '@/common/types';
import { videoFormDefaultValues } from '@/common/constants';
import GoToHomeButton from '../HomeButton';
import SquareIconButton from '../SquareIconButton';
import { useSaveContent } from '@/hooks/useSaveContent';
import { SelectChangeEvent } from '@mui/material';
import { defaultPageContextValue } from '@/context/PageContext';
import FooterInput from '../FooterInput';
import useWindowSize from '@/hooks/useWindowSize';
import { StyledCategoryTitle } from '../StyledInput';
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

// type CTAActionType = {
//   ctaType: string;
//   ctaAction: string;
// }

// export type VideoFormValuesType = {
//   aboutVideo: string;
//   speaker: string;
//   bodyText1: string;
//   bodyText2: string;
//   videoType: 'url' | 'uploaded';
//   videoURL: string;
//   videoThumbnail: string;
//   ctas: Array<CTAActionType>;
//   toneOfVoice: string;
//   wordsLength: string;
//   footerText: string;
//   footerImage: string | '';
//   footerImgDirection: 'left' | 'right',
// }
const UploadFileIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.207 5.23769L11.207 1.13529C11.1141 1.03978 11.0038 0.964005 10.8823 0.912302C10.7608 0.860598 10.6305 0.833984 10.499 0.833984C10.3675 0.833984 10.2372 0.860598 10.1157 0.912302C9.99424 0.964005 9.88389 1.03978 9.791 1.13529L5.791 5.23769C5.60349 5.43027 5.49826 5.69136 5.49844 5.96351C5.49863 6.23567 5.60423 6.49661 5.792 6.68891C5.97977 6.88122 6.23434 6.98915 6.49971 6.98896C6.76507 6.98877 7.01949 6.88047 7.207 6.68789L9.5 4.33619V13.142C9.5 13.414 9.60536 13.6749 9.79289 13.8672C9.98043 14.0595 10.2348 14.1676 10.5 14.1676C10.7652 14.1676 11.0196 14.0595 11.2071 13.8672C11.3946 13.6749 11.5 13.414 11.5 13.142V4.33619L13.793 6.68789C13.9816 6.87471 14.2342 6.97808 14.4964 6.97575C14.7586 6.97341 15.0094 6.86555 15.1948 6.6754C15.3802 6.48524 15.4854 6.22801 15.4877 5.9591C15.49 5.69019 15.3892 5.43112 15.207 5.23769Z"
      fill="#9CA3AF"
    />
    <path
      d="M18.5 12.6292H13.5V13.142C13.5 13.958 13.1839 14.7406 12.6213 15.3176C12.0587 15.8946 11.2956 16.2188 10.5 16.2188C9.70435 16.2188 8.94129 15.8946 8.37868 15.3176C7.81607 14.7406 7.5 13.958 7.5 13.142V12.6292H2.5C1.96957 12.6292 1.46086 12.8453 1.08579 13.23C0.710714 13.6146 0.5 14.1364 0.5 14.6804V18.7828C0.5 19.3268 0.710714 19.8485 1.08579 20.2332C1.46086 20.6179 1.96957 20.834 2.5 20.834H18.5C19.0304 20.834 19.5391 20.6179 19.9142 20.2332C20.2893 19.8485 20.5 19.3268 20.5 18.7828V14.6804C20.5 14.1364 20.2893 13.6146 19.9142 13.23C19.5391 12.8453 19.0304 12.6292 18.5 12.6292ZM16 18.7828C15.7033 18.7828 15.4133 18.6926 15.1666 18.5235C14.92 18.3545 14.7277 18.1142 14.6142 17.8331C14.5007 17.552 14.4709 17.2427 14.5288 16.9443C14.5867 16.6458 14.7296 16.3717 14.9393 16.1566C15.1491 15.9414 15.4164 15.7949 15.7074 15.7355C15.9983 15.6762 16.2999 15.7067 16.574 15.8231C16.8481 15.9395 17.0824 16.1367 17.2472 16.3897C17.412 16.6427 17.5 16.9401 17.5 17.2444C17.5 17.6524 17.342 18.0437 17.0607 18.3322C16.7794 18.6207 16.3978 18.7828 16 18.7828Z"
      fill="#9CA3AF"
    />
  </svg>
);

const CopyGeneratorVideoFormFields = ({
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
  const sessionStorageKey = 'video$generator$frm';
  // const savedFormData = process?.browser ? fetchFromSessionStorage(sessionStorageKey) : {};
  const { saveContent } = useSaveContent();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const sizes = useWindowSize();

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
  } = useForm<VideoFormValuesType>({
    mode: 'onTouched',
    defaultValues: { ...videoFormDefaultValues },
  });
  const ctaFieldsArray: UseFieldArrayReturn<VideoFormValuesType, 'ctas'> =
    useFieldArray({
      control,
      name: 'ctas',
    });

  const footerFieldsArray: UseFieldArrayReturn<VideoFormValuesType, 'footers'> =
    useFieldArray({
      control,
      name: 'footers',
    });

  const { errors } = formState;
  const videoThumbnail = watch('videoThumbnail');

  // Update page context with form data
  const updatePageContextValues = useCallback(
    (newData: object = {}) => {
      updatePageContext({
        ...templateData,
        ...newData,
      });
    },
    [templateData, updatePageContext]
  );

  // Reset page when clear button clicked
  function onClearBtnClick() {
    reset({ ...videoFormDefaultValues });
    deleteFromSessionStorage(sessionStorageKey);
    updatePageContext(defaultPageContextValue);
  }

  async function getFormData() {
    const formData = getValues();
    const { aboutVideo, bodyText1, bodyText2, toneOfVoice, wordsLength } =
      formData;
    const emailTmplData = {
      typeOfEmail: aboutVideo,
      messages: [bodyText1, bodyText2],
      tone: toneOfVoice,
      length: wordsLength,
    };
    const { optimizerFormData, emailContent } = await generateEmailWrapper(
      emailTmplData
    );

    return {
      optimizerFormData,
      emailContent,
      formData
    };
  }

  const onSaveButtonClick = async () => {
    setIsLoading(true)
    let { optimizerFormData, emailContent, formData } = await getFormData();
    let { layout } = templateData;
    const newId = await saveContent({
      userId,
      status: 'Generator',
      currentId: templateData.currentId,
      videoLayout: {
        formData,
        optimizer: { formData: optimizerFormData, emailContent },
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

  useEffect(() => {
    const existingFormData = templateData?.formData;
    if (existingFormData) {
      reset({ ...(existingFormData || {}) });
    }

    return () => { };
  }, [templateData, reset]);


  // update form with the saved context values
  // useEffect(() => {
  //   const existingFormData = videoTemplateData?.generator?.formData;
  //   // console.log('existingFormData', videoTemplateData, existingFormData);
  //   if (existingFormData) {
  //     reset({ ...(existingFormData || {}) });
  //   }

  //   return () => {};
  // }, [videoTemplateData, reset]);

  const generateEmailWrapper = useCallback(
    async (emailTmplData: any) => {
      // setLoading(true)

      // const timer = setInterval(() => {
      //   setProgress((prevProgress: number) => {
      //     if (prevProgress >= 100) {
      //       clearInterval(timer)
      //       setLoading(false);
      //       setProgress(0);
      //       // return 0;
      //     }
      //     return prevProgress + 10
      //   })
      // }, 1300);

      const email = await generateEmail(emailTmplData);
      let optimizerFormData: Array<OptimizerFormFieldType> = [];
      if (email) {
        const subjectLineArr = email.match(/Subject\s*:\s*(.*)/i);
        const [subjectLine] = subjectLineArr || [];

        if (subjectLine) {
          const ctaData = getValues('ctas');
          const videoThumbnail = getValues('videoThumbnail');
          const videoThumbnailUrl = getValues('videoURL');
          const ctaFileds: Array<OptimizerFormFieldType> = [
            ...(ctaData || [])
              .map(({ ctaType, ctaAction, ctaCustomLabel }, index) => ({
                type: 'cta',
                key: index,
                value: '',
                label: 'Button type ' + (index + 1),
                ctaType,
                ctaAction,
                ctaCustomLabel,
              }))
              .filter(
                ({ ctaType }) =>
                  ctaType !== null && ctaType !== undefined && ctaType !== ''
              ),
          ];

          let thumbnailImg: OptimizerFormFieldType;
          if (videoThumbnail && videoThumbnail !== '') {
            thumbnailImg = {
              type: 'image',
              key: 'thumbnail',
              value: videoThumbnail,
              label: '',
              imageActionUrl: videoThumbnailUrl || null,
            };
            ctaFileds.unshift({ ...thumbnailImg });
          }
          optimizerFormData = convertEmailContentIntoOptimizerFields(
            email,
            [],
            ctaFileds
          );
        }
      }
      return { optimizerFormData, emailContent: email };
    },
    [getValues]
  );

  // Form submit event
  const onSubmit: SubmitHandler<VideoFormValuesType> = useCallback(
    async (formData: VideoFormValuesType) => {
      // saveToSessionStorage(sessionStorageKey, formData);
      setOpen(true)

      const { aboutVideo, bodyText1, bodyText2, toneOfVoice, wordsLength } =
        formData;
      const emailTmplData = {
        typeOfEmail: aboutVideo,
        messages: [bodyText1, bodyText2],
        tone: toneOfVoice,
        length: wordsLength,
      };
      const { optimizerFormData, emailContent } = await generateEmailWrapper(
        emailTmplData
      );

      updatePageContextValues({
        formData,
        optimizer: { formData: optimizerFormData, emailContent },
      });
      handleNext && handleNext();
    },
    [generateEmailWrapper, handleNext, updatePageContextValues]
  );

  const generateEmailContinueWrapper = useCallback(() => {
    const ctaData = getValues('ctas');
    const videoThumbnail = getValues('videoThumbnail');
    const videoThumbnailUrl = getValues('videoURL');
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
    let thumbnailImg: OptimizerFormFieldType;
    if (videoThumbnail && videoThumbnail !== '') {
      thumbnailImg = {
        type: 'image',
        key: 'thumbnail',
        value: videoThumbnail,
        label: '',
        imageActionUrl: videoThumbnailUrl || null,
      };

      let thumbnailImgIndex = removeCTAFormData.findIndex(
        (item) => item.type === 'image'
      );
      if (thumbnailImgIndex >= 0) {
        removeCTAFormData[thumbnailImgIndex] = thumbnailImg;
      } else {
        removeCTAFormData.splice(paragraphIndex + 1, 0, thumbnailImg);
      }
    }


    return { fData: removeCTAFormData };
  }, [getValues]);

  const handleFormSubmitContinue = useCallback(() => {
    const formData = getValues();
    const { fData } = generateEmailContinueWrapper();
    updatePageContext({
      formData,
      optimizer: { ...templateData.optimizer, formData: fData },
    });
    handleNext && handleNext();
  }, [handleSubmit]);





  const inputRef = useRef<HTMLInputElement>(null);
  let [currentImage, setCurrentImage] = useState<File | null>(null);

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit);
  }, [handleSubmit, onSubmit]);
  return (
    <>
      <Grid container>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          mt={1}
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            lg={10}
            xl={10}
            rowSpacing={2}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <StyledCategoryTitle>
                Video Type and Recipient
              </StyledCategoryTitle>
              <p className={classes.title_input}>Type of Video</p>
              <FormControl fullWidth error={!!errors?.aboutVideo}>
                {/* <InputLabel id="aboutVideo-label">
                  Select category
                </InputLabel> */}
                <Controller
                  control={control}
                  name="aboutVideo"
                  rules={{ required: 'Select video type' }}
                  render={({ field }) => (
                    <Select
                      required
                      labelId="aboutVideo-label"
                      id="aboutVideo-select"
                      placeholder="Select category"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <MenuItem value="Product intro">Product intro</MenuItem>
                      <MenuItem value="Product demo">Product demo</MenuItem>
                      <MenuItem value="Disease awareness">
                        Disease awareness
                      </MenuItem>
                      <MenuItem value="KOL video">KOL video</MenuItem>
                      <MenuItem value="Event/webinar playback">
                        Event/webinar playback
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <p className={classes.text_lable}>Who’s the Speaker</p>
              <Controller
                control={control}
                name="speaker"
                // rules={{ required: "What is this video about"}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    // label="Who is the speaker?"
                    // error={!!(errors?.aboutVideo)}
                    // helperText={errors?.aboutVideo?.message}
                    placeholder="Who is the speaker?"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <StyledCategoryTitle>Video Content</StyledCategoryTitle>
              <p className={classes.text_lable}>Key Message 1</p>
              <Controller
                control={control}
                name="bodyText1"
                // rules={{ required: "What is this video about"}}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    // label="What do you want to tell them"
                    multiline
                    rows={4}
                    // error={!!(errors?.aboutVideo)}
                    // helperText={errors?.aboutVideo?.message}
                    placeholder="What do you want to tell them?"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl error={!!errors?.videoType}>
                <p className={classes.title_input}>Upload Video From?</p>
                {/* <FormLabel id="video-type-group-label"></FormLabel> */}
                <Controller
                  control={control}
                  name="videoType"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      aria-labelledby="video-type-group-label"
                      name="videoType"
                    >
                      <FormControlLabel
                        value="url"
                        control={<Radio />}
                        label="Using URL"
                      />
                      <FormControlLabel
                        value="upload"
                        control={<Radio />}
                        label="Upload Manually"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControl variant="outlined" fullWidth>
                <p className={classes.title_input}>Video Thumbnail</p>
                {currentImage && <p>{currentImage?.name}</p>}
                {currentImage && <img src={URL.createObjectURL(currentImage)} width={64}/>}
                <Controller
                  control={control}
                  name="videoThumbnail"
                  render={({ field }) => (
                    <div
                      className={`${classes.container} ${classes.borderGray}`}
                    >
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        onChange={async (
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const imageFile =
                            (event.target.files &&
                              event.target.files.length > 0 &&
                              event.target.files[0]) ||
                            null;
                          if (imageFile) {
                            setIsUploading(true);
                            let url = await onImageUpload(imageFile, 'v2');
                            setCurrentImage(imageFile);
                            console.log('url', url);
                            field.onChange(url);
                            setIsUploading(false);
                          }
                        }}
                        ref={inputRef}
                      />
                      <UploadFileIcon />
                      <p>Click to upload or drag and drop</p>
                      <p>Max. File Size: 30MB</p>
                      <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        sx={{ textTransform: 'none' }}
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                />
                {/* <input
                    style={{ display: 'none' }}
                    id="videoThumbnail"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const imageFile =
                        (event.target.files &&
                          event.target.files.length > 0 &&
                          event.target.files[0]) ||
                        null;
                      if (imageFile) {
                        const reader = new FileReader();
                        reader.readAsDataURL(imageFile);
                        reader.onloadend = () =>
                          field.onChange(reader.result as string);
                      }
                    }}
                  />
                  <label htmlFor="videoThumbnail">
                    <Image
                      height="120"
                      width="120"
                      alt="Video thumbnail"
                      src={videoThumbnail || '/img/upload-image-icon.png'}
                      style={{ cursor: 'pointer' }}
                    />
                  </label> */}

                {/* {videoThumbnail ? (
                    <HighlightOff
                      onClick={() => field.onChange('')}
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
                  ) : null} */}
              </FormControl>
            </Grid>
            {/* <FooterList
              footerFieldsArray={footerFieldsArray}
              control={control}
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
              setValue={setValue}
            /> */}

            {watch('videoType') == 'url' || !watch('videoType') ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <p className={classes.text_lable}>Insert Video URL</p>
                <Controller
                  control={control}
                  name="videoURL"
                  rules={{ required: 'Enter Video URL' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      // label="Video URL"
                      error={!!errors?.videoURL}
                      // helperText={errors?.videoURL?.message}
                      placeholder="Video URL"
                    />
                  )}
                />
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <p className={classes.text_lable}>Key Message 2</p>

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
                    placeholder="What do you want to tell them?"
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
            <Grid item xs={12}>
              <StyledCategoryTitle>Video Content Details</StyledCategoryTitle>
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

            {/* <GenericDropdownControl 
              control={control} 
              name="toneOfVoice"
              label="What tone of voice are you looking for?"
              formState={formState}
              getFieldState={getFieldState}
              menuItems={[
                {value: '', label: 'Select'},
                {value: 'formal', label: 'Formal'},
                {value: 'friendly', label: 'Friendly'},
                {value: 'informal', label: 'Informal'},
                {value: 'professional', label: 'Professional'},
                {value: 'conversational', label: 'Conversational'},
                {value: 'humorous', label: 'Humorous'},
              ]}
            />     */}

            <GenericDropdownControl
              control={control}
              name="wordsLength"
              label="Content Length"
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

            <Grid item xs={12}>
              <StyledCategoryTitle>Regulatory And Approval</StyledCategoryTitle>
              <p className={classes.title_input}>Insert PI/API</p>

              <TextField
                fullWidth
                variant="outlined"
                // label="Insert PI/API"
                placeholder="Insert PI/API"
                value={pi}
                onChange={handlePiChange}
                inputProps={{ id: 'insert pi' }}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <p className={classes.title_input}>
                  Do You Have Veeva Approval Code
                </p>
                <Controller
                  control={control}
                  name="videoType"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      value={veevaApprovalFlag}
                      onChange={handleTypeOfVeevaFlag}
                      row
                      aria-labelledby="video-type-group-label"
                      name="videoType"
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />

                {/* <Select
                  label="Do you have the Veeva approval code?"
                  labelId="veeva-select"
                  value={veevaApprovalFlag}
                  onChange={handleTypeOfVeevaFlag}
                  inputProps={{ id: 'veeva-approval' }}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select> */}
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
                  {templateData.optimizer.formData.length > 0 ? (
                    <Button
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
                      templateData.optimizer.formData.length > 0
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
                  <Divider flexItem style={{ margin: '10px 0' }}>
                    Or
                  </Divider>
                  <Button
                    onClick={onClearBtnClick}
                    variant="outlined"
                    color="primary"
                    disabled={true}
                    sx={{
                      borderColor: 'primary.main',
                      textTransform: 'none',
                      marginTop: '8px',
                    }}
                  >
                    Clear All
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid container justifyContent={'space-between'}>
                  <Grid item>
                    <span style={{ marginRight: '8px' }}>
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
                      }}
                    >
                      Clear All
                    </Button>
                  </Grid>
                  <Grid item display={'flex'} gap={'8px'}>
                    <Button
                      onClick={() => handleBack()}
                      variant="outlined"
                      color="primary"
                      disabled={true}
                      sx={{ borderColor: 'primary.main', textTransform: 'none' }}
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
                      }}
                      disabled={isLoading}
                    >
                      Save as Draft
                    </Button>

                    <ProgressButton
                      color={
                        templateData.optimizer.formData.length > 0
                          ? 'secondary'
                          : 'primary'
                      }
                      trigger={trigger}
                      handleFormSubmit={handleFormSubmit}
                    />

                    {templateData.optimizer.formData.length > 0 ? (
                      <Grid item>
                        <Button
                          onClick={() => handleFormSubmitContinue()}
                          variant="contained"
                          color="primary"
                          sx={{
                            color: 'white',
                            borderColor: 'primary.main',
                            borderWidth: '2px',
                            textTransform: 'none',
                          }}
                        >
                          Continue
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* <Grid
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
                <span style={{ marginRight: '8px' }}>
                  <GoToHomeButton />
                </span>
                <Button
                  onClick={onClearBtnClick}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderColor: 'primary.main',
                    textTransform: 'none',
                  }}
                >
                  Clear
                </Button>
              </Grid>

              <Grid item display={'flex'} gap={'16px'} >

                <Button
                  onClick={onSaveButtonClick}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderColor: 'primary.main',
                    textTransform: 'none',
                  }}
                  disabled={isLoading}
                >
                  Save as Draft
                </Button>


                <ProgressButton
                  color={
                    templateData.optimizer.formData.length > 0
                      ? 'secondary'
                      : 'primary'
                  }
                  trigger={trigger}
                  handleFormSubmit={handleFormSubmit}
                />

                {templateData.optimizer.formData.length > 0 ? (
                  <Grid item >
                    <Button
                      onClick={() => handleNext()}
                      variant="contained"
                      color="primary"
                      sx={{
                        color: 'white',
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        textTransform: 'none',
                      }}
                    >
                      Continue
                    </Button>
                  </Grid>
                ) : null}
              </Grid>


            </Grid> */}
          </Grid>
        </Box>
      </Grid>
      <Snackbar
        open={isLoading}
        autoHideDuration={6000}
        message="Template Successfully Saved"
      />
      <ProgressBar open={isUploading} message="Loading..." handleClose={() => setIsUploading(false)} />
    </>
  );
};
export default React.memo(CopyGeneratorVideoFormFields);

type CTADropdownProps = {
  control: Control<VideoFormValuesType>;
  formState: FormState<VideoFormValuesType>;
  getFieldState: UseFormGetFieldState<VideoFormValuesType>;
  watch: UseFormWatch<VideoFormValuesType>;
};

type CTAListProps = {
  ctaFieldsArray: UseFieldArrayReturn<VideoFormValuesType, 'ctas'>;
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
    <Grid item xs={12} sm={12} md={12} lg={14} xl={14}>
      <StyledCategoryTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            // backgroundColor: "red"

          }}
        >
          Call To Action
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: 'none' }}
            onClick={addCTAHandler}
          >
            Add New
          </Button>
        </div>
      </StyledCategoryTitle>
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
  trigger: UseFormTrigger<VideoFormValuesType>;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // async function onButtonClick() {
  //   const result = await trigger();
  //   if (result) {
  //     handleFormSubmit();
  //     const timer = setInterval(async () => {
  //       setLoading(true);
  //       setProgress((prevProgress: number) => {
  //         if (prevProgress >= 100) {
  //           clearInterval(timer);
  //           // setLoading(false);
  //           // setProgress(0);
  //           return 0;
  //         }
  //         return prevProgress + 5;
  //       });
  //     }, 1000);
  //     return true;
  //   }
  //   return false;
  // }

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
      // onClick={onButtonClick}
      type="submit"
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
  footerFieldsArray: UseFieldArrayReturn<VideoFormValuesType, 'footers'>;
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
  const hanldeGetFile = async (file: File | null, index: number) => {
    if (file) {
    }
  }
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
              hanldeGetFile={hanldeGetFile}
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
