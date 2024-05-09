import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Box,
  Snackbar,
} from '@mui/material';
import { useEffect } from 'react';
import { generateEmail } from '@/services/openaiService';
import MessageInput from '../MessageInput';
import FooterInput from '../FooterInput';
import GoToHomeButton from '../HomeButton';
import StyledInput, {
  StyledCategoryTitle,
  styledInputPropsSx,
} from '../StyledInput';

import classes from './CopyGeneratorFormFields.module.css';
import useWindowSize from '@/hooks/useWindowSize';
import { OptimizerFormFieldType, StandardFormValuesType } from '@/common/types';
import { usePageContext } from '@/context';
import {
  Control,
  Controller,
  FormState,
  SubmitHandler,
  UseFieldArrayReturn,
  UseFormGetFieldState,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { standardFormDefaultValues } from '@/common/constants';
import {
  convertEmailContentIntoOptimizerFields,
  deleteFromSessionStorage,
} from '@/utils';
import CallToActionDropdown from '../CallToActionDropdown';
import { useSaveContent } from '@/hooks/useSaveContent';
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
  user: any;
}

const CopyGeneratorFormFields: React.FC<CopyGeneratorFormFieldsProps> = ({
  handleNext,
  pi,
  setPi,
  userId,
  veevaApprovalFlag,
  setVeevaApprovalFlag,
  user,
}) => {
  const handlePiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPi(event.target.value);
  };

  const sizes = useWindowSize();

  const handleTypeOfVeevaFlag = (event: SelectChangeEvent) => {
    setVeevaApprovalFlag(event.target.value as string);
  };
  const { updatePageContext, templateData } = usePageContext();
  const { saveContent } = useSaveContent();
  const [isLoading, setIsLoading] = useState(false);
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
  } = useForm<StandardFormValuesType>({
    mode: 'onTouched',
    defaultValues: { ...standardFormDefaultValues },
  });
  const ctaFieldsArray: UseFieldArrayReturn<StandardFormValuesType, 'ctas'> =
    useFieldArray({
      control,
      name: 'ctas',
    });
  const contentFieldsArray: UseFieldArrayReturn<
    StandardFormValuesType,
    'contents'
  > = useFieldArray({
    control,
    name: 'contents',
  });

  const footerFieldsArray: UseFieldArrayReturn<
    StandardFormValuesType,
    'footers'
  > = useFieldArray({
    control,
    name: 'footers',
  });

  const sessionStorageKey = 'standard$generator$frm';

  const { errors } = formState;

  const updateGeneratorContextValues = useCallback(
    (newData: object = {}) => {
      const { formData = {} } = templateData;
      updatePageContext({
        formData: { ...formData, ...newData },
      });
    },
    [templateData, updatePageContext]
  );

  const updatePageContextValues = useCallback(
    (newData: object = {}) => {
      updatePageContext({
        ...templateData,
        ...newData,
      });
    },
    [templateData, updatePageContext]
  );

  const onSaveButtonClick = async () => {
    setIsLoading(true);
    const formData = getValues();
    let { layout, optimizer } = templateData;

    const newId = await saveContent({
      userId,
      status: 'Generator',
      currentId: templateData.currentId,
      standardLayout: {
        formData,
        optimizer,
        layout,
        pi,
        veevaApprovalFlag,
      },
    });

    if (newId) {
      updatePageContextValues({
        currentId: Number(newId),
        formData: formData,
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Reset page when clear button clicked
  function onClearBtnClick() {
    reset({ ...standardFormDefaultValues });
    deleteFromSessionStorage(sessionStorageKey);
    updateGeneratorContextValues({
      formData: { ...standardFormDefaultValues },
    });
  }

  // update form with the saved context values
  useEffect(() => {
    const existingFormData = templateData?.formData;
    if (existingFormData) {
      reset({ ...(existingFormData || {}) });
    }

    return () => {};
  }, [templateData, reset]);

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
      const { contents } = emailTmplData;
      const email = await generateEmail(emailTmplData);
      let optimizerFormData: Array<OptimizerFormFieldType> = [];
      if (email) {
        const subjectLineArr = email.match(/Subject\s*:\s*(.*)/i);
        const [subjectLine] = subjectLineArr || [];

        if (subjectLine) {
          const ctaData = getValues('ctas');
          const ctaFileds: Array<OptimizerFormFieldType> = [
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

          optimizerFormData = convertEmailContentIntoOptimizerFields(
            email,
            contents,
            ctaFileds
          );
        }
      }
      return { optimizerFormData, emailContent: email };
    },
    [getValues]
  );

  const generateEmailContinueWrapper = useCallback(() => {
    const ctaData = getValues('ctas');
    const contents = getValues('contents');
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

    if (contents && contents.length > 0) {
      if (contents[0] && contents[0].image) {
        const paragraph1 = removeCTAFormData.findIndex(
          (item) => item.key === 'paragraph1'
        );
        if (paragraph1 >= 0) {
          removeCTAFormData[paragraph1].image = contents[0].image;
          if (contents[0].imgUrl) {
            removeCTAFormData[paragraph1].imageActionUrl = contents[0].imgUrl;
          }
        }
      }
      if (contents[1] && contents[1].image) {
        const paragraph2 = removeCTAFormData.findIndex(
          (item) => item.key === 'paragraph2'
        );
        if (paragraph2 >= 0) {
          removeCTAFormData[paragraph2].image = contents[1].image;
          if (contents[1].imgUrl) {
            removeCTAFormData[paragraph2].imageActionUrl = contents[1].imgUrl;
          }
        }
      }
    }

    return { fData: removeCTAFormData };
  }, [getValues]);

  const onSubmit: SubmitHandler<StandardFormValuesType> = useCallback(
    async (formData: StandardFormValuesType) => {
      console.log('submit started');
      const {
        emailType,
        recipient,
        goal,
        background,
        brandName,
        contents,
        therapyArea,
        details,
        toneOfVoice,
        wordsLength,
      } = formData;
      setOpen(true);

      const emailTmplData = {
        typeOfEmail: emailType,
        recipient,
        details,
        goal,
        background,
        messages: [brandName, therapyArea, ...contents.map((c) => c.message)],
        contents,
        tone: toneOfVoice,
        length: wordsLength,
      };
      const { optimizerFormData, emailContent } = await generateEmailWrapper(
        emailTmplData
      );

      updatePageContext({
        formData,
        optimizer: { formData: optimizerFormData, emailContent },
      });

      handleNext && handleNext();
    },
    [generateEmailWrapper, handleNext, updatePageContext]
  );

  const handleFormSubmitContinue = useCallback(() => {
    const formData = getValues();
    const { fData } = generateEmailContinueWrapper();
    updatePageContext({
      formData,
      optimizer: { ...templateData.optimizer, formData: fData },
    });
    handleNext && handleNext();
  }, [handleSubmit]);

  const handleFormSubmit = useCallback(() => {
    handleSubmit(onSubmit);
  }, [handleSubmit, onSubmit]);

  const NextButton = () => (
    <Button
      onClick={() => handleFormSubmitContinue()}
      variant="contained"
      color="primary"
      sx={{
        borderColor: 'primary.main',
        textTransform: 'none',
        m: 1,
      }}
    >
      Continue
    </Button>
  );

  const SaveAsDraftButton = () => (
    <Button
      sx={{ textTransform: 'none', m: 1 }}
      variant="outlined"
      onClick={onSaveButtonClick}
      disabled={isLoading}
    >
      Save as Draft
    </Button>
  );

  const PreviousButton = () => (
    <Button
      disabled={true}
      sx={{ textTransform: 'none', m: 1 }}
      variant="outlined"
    >
      Previous
    </Button>
  );

  const ClearAllButton = () => (
    <Button
      variant="outlined"
      color="primary"
      disabled={true}
      onClick={onClearBtnClick}
      sx={{
        textTransform: 'none',
        m: 1,
      }}
    >
      Clear All
    </Button>
  );

  return (
    <>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        className={classes.container}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12}>
          <StyledCategoryTitle>Email Type and Recipient</StyledCategoryTitle>
          <FormControl fullWidth error={!!errors?.emailType}>
            <label>Type of email</label>
            <Controller
              control={control}
              name="emailType"
              rules={{ required: 'Select Email Type' }}
              render={({ field }) => (
                <Select
                  required
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  inputProps={{ id: 'typeOfEmail' }}
                  variant="standard"
                  input={<StyledInput />}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="intro">Intro</MenuItem>
                  <MenuItem value="educational">Educational</MenuItem>
                  <MenuItem value="Follow-up(Post event/meeting)">
                    Follow-up(Post event/meeting)
                  </MenuItem>
                  <MenuItem value="Follow-up(Post one to one meeting)">
                    Follow-up(Post one to one meeting)
                  </MenuItem>
                  <MenuItem value="proposal">Proposal</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="newsletter">Newsletter</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <label>Recipient Type</label>
            <Controller
              control={control}
              name="recipient"
              // rules={{ required: 'Select Recipient' }}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  inputProps={{ id: 'recipient' }}
                  input={<StyledInput />}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="prospect">Prospect</MenuItem>
                  <MenuItem value="internalStaff">Internal Staff</MenuItem>
                  <MenuItem value="hcps">HCPs</MenuItem>
                  <MenuItem value="patients">Patients</MenuItem>
                  <MenuItem value="consumers">Consumers</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="partner">Partner</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <StyledCategoryTitle>Brand and Message</StyledCategoryTitle>
          <label>Brand Name</label>
          <Controller
            control={control}
            name="brandName"
            // rules={{ required: 'What is a brand name?' }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                value={field.value || user?.brand}
                placeholder="Enter the brand name"
                fullWidth
                InputProps={{
                  sx: { ...styledInputPropsSx },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <label>Therapy Area</label>
          <Controller
            control={control}
            name="therapyArea"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                value={field.value || user?.therapyArea}
                placeholder="Enter the therapy area"
                inputProps={{ id: 'therapyArea' }}
                InputProps={{
                  sx: { ...styledInputPropsSx },
                }}
              />
            )}
          />
        </Grid>

        <ContentList
          contentFieldsArray={contentFieldsArray}
          control={control}
          formState={formState}
          getFieldState={getFieldState}
          watch={watch}
          setValue={setValue}
        />
        <Grid item xs={12}>
          <StyledCategoryTitle>Tell Us More</StyledCategoryTitle>
          <label>Relevant Details</label>
          <Controller
            control={control}
            name="details"
            // rules={{ required: 'What is a brand name?' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                placeholder="Add any relevant details"
                inputProps={{ id: 'details' }}
                multiline
                rows={4}
                InputProps={{ sx: styledInputPropsSx }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <label>Background You Can Share</label>
          <Controller
            control={control}
            name="background"
            // rules={{ required: 'What is a brand name?' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                placeholder="Add any other background you can share"
                inputProps={{ id: 'background' }}
                multiline
                rows={4}
                InputProps={{ sx: styledInputPropsSx }}
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
        <Grid item xs={12}>
          <StyledCategoryTitle>Email Goal</StyledCategoryTitle>
          <FormControl variant="outlined" fullWidth>
            <label>Goals To Accomplish</label>
            <Controller
              control={control}
              name="goal"
              // rules={{ required: 'What is a brand name?' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="goal-select"
                  onChange={(e) => field.onChange(e.target.value)}
                  inputProps={{ id: 'goal' }}
                  input={<StyledInput />}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="inform">Inform</MenuItem>
                  <MenuItem value="educate">Educate</MenuItem>
                  <MenuItem value="persuade">Persuade</MenuItem>
                  <MenuItem value="convert">Convert</MenuItem>
                  <MenuItem value="entertain">Entertain</MenuItem>
                  <MenuItem value="retain">Retain</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <label>Tone Of Voice</label>
          <FormControl variant="outlined" fullWidth>
            <Controller
              control={control}
              name="toneOfVoice"
              // rules={{ required: 'What is a brand name?' }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="tone-select"
                  onChange={(e) => field.onChange(e.target.value)}
                  inputProps={{ id: 'tone' }}
                  input={<StyledInput />}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="informal">Informal</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="conversational">Conversational</MenuItem>
                  {/* <MenuItem value="humorous">Humorous</MenuItem> */}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <StyledCategoryTitle>Content Length</StyledCategoryTitle>
          <label>Content Length</label>
          <FormControl variant="outlined" fullWidth>
            <Controller
              control={control}
              name="wordsLength"
              // rules={{ required: 'What is a brand name?' }}
              render={({ field }) => (
                <Select
                  labelId="length-select"
                  onChange={(e) => field.onChange(e.target.value)}
                  inputProps={{ id: 'length' }}
                  input={<StyledInput />}
                >
                  <MenuItem value="Select" disabled>
                    Select
                  </MenuItem>
                  <MenuItem value="Short < 50 words">
                    Short &lt; 50 words
                  </MenuItem>
                  <MenuItem value="Medium (50-120 words)">
                    Medium (50-120 words)
                  </MenuItem>
                  <MenuItem value="Long (120-200 words)">
                    Long (120-200 words)
                  </MenuItem>
                  <MenuItem value="Extra Long (>200 words)">
                    Extra Long (&gt;200 words)
                  </MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
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
          <label>Insert PI/API</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Insert PI/API"
            value={pi}
            onChange={handlePiChange}
            inputProps={{ id: 'insert pi' }}
            multiline
            rows={4}
            InputProps={{ sx: styledInputPropsSx }}
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
        {open && (
          <ProgressBar
            open={open}
            message=" Generating..."
            handleClose={() => {}}
            isprogress
          />
        )}

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
              {templateData.optimizer.formData.length > 0 && <NextButton />}
              <ProgressButton
                color={
                  templateData.optimizer.formData.length > 0
                    ? 'secondary'
                    : 'primary'
                }
                trigger={trigger}
                handleFormSubmit={handleFormSubmit}
              />
              <SaveAsDraftButton />
              <PreviousButton />
              <Divider flexItem>Or</Divider>
              <ClearAllButton />
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Grid container justifyContent={'space-between'}>
              <Grid item>
                <span style={{ marginRight: '8px' }}>
                  <GoToHomeButton />
                </span>
                <ClearAllButton />
              </Grid>
              <Grid item>
                <PreviousButton />
                <SaveAsDraftButton />
                <ProgressButton
                  color={
                    templateData.optimizer.formData.length > 0
                      ? 'secondary'
                      : 'primary'
                  }
                  trigger={trigger}
                  // handleFormSubmit={handleFormSubmit}
                  handleFormSubmit={handleFormSubmit}
                />
                {templateData.optimizer.formData.length > 0 && <NextButton />}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={isLoading}
        autoHideDuration={6000}
        message="Template Successfully Saved"
      />
    </>
  );
};
export default CopyGeneratorFormFields;

type CTADropdownProps = {
  control: Control<StandardFormValuesType>;
  formState: FormState<StandardFormValuesType>;
  getFieldState: UseFormGetFieldState<StandardFormValuesType>;
  watch: UseFormWatch<StandardFormValuesType>;
};

type CTAListProps = {
  ctaFieldsArray: UseFieldArrayReturn<StandardFormValuesType, 'ctas'>;
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
  const sizes = useWindowSize();

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <div
        style={{
          backgroundColor: '#F9FAFB',
          color: '#111928',
          padding: 15,
          paddingLeft: '1rem',
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: sizes.width && sizes.width < 768 ? '' : '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
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
      </div>
      {fields.map((field, index) => {
        return (
          <CallToActionDropdown
            key={field.id}
            index={index}
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
            onDeleteButtonClick={() => index != 0 && remove(index)}
          />
        );
      })}
    </Grid>
  );
}

type ContentListProps = {
  contentFieldsArray: UseFieldArrayReturn<StandardFormValuesType, 'contents'>;
  setValue: UseFormSetValue<any>;
} & CTADropdownProps;

function ContentList({
  contentFieldsArray,
  control,
  formState,
  getFieldState,
  watch,
  setValue,
}: ContentListProps) {
  const { fields, remove, append } = contentFieldsArray;
  const hanldeGetFile = async (file: File | null, index: number) => {};

  const addContentHandler = () => {
    append({
      message: '',
      image: null,
      imgUrl: '',
    });
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <StyledCategoryTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          Email Content
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
            <MessageInput
              hanldeGetFile={hanldeGetFile}
              key={field.id}
              index={index}
              control={control}
              messageLabel={`Key Message ${index + 1}`}
              attachmentLabel={`Accompanying Image, Graphic, etc`}
              imgLinkLabel={`Insert Image URL`}
              formState={formState}
              getFieldState={getFieldState}
              watch={watch}
              messageFieldName={`contents.${index}.message`}
              attachmentFieldeName={`contents.${index}.image`}
              imgLinkFieldName={`contents.${index}.imgUrl`}
              onDeleteButtonClick={() => index != 0 && remove(index)}
            />
          </React.Fragment>
        );
      })}
    </Grid>
  );
}

type FooterListProps = {
  footerFieldsArray: UseFieldArrayReturn<StandardFormValuesType, 'footers'>;
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
  const hanldeGetFile = async (file: File | null, index: number) => {};

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
            alignItems: 'center',
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

const ProgressButton = ({
  color,
  handleFormSubmit,
  trigger,
}: {
  color: 'primary' | 'secondary';
  handleFormSubmit: Function;
  trigger: UseFormTrigger<StandardFormValuesType>;
}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onButtonClick() {
    const result = await trigger();
    if (result) {
      handleFormSubmit();
      const timer = setInterval(async () => {
        setLoading(true);
        setProgress((prevProgress: number) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            // setLoading(false);
            // setProgress(0);
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
    // setLoading(false);
    setProgress(0);

    return () => {
      // setLoading(false);
      setProgress(0);
    };
  }, []);

  return (
    <Button
      onClick={onButtonClick}
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
      Generate Copy
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
