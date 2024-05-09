import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  generateContent,
  generateReferencesAndCitations,
} from '@/services/openaiService';
import GoToHomeButton from '../HomeButton';
import ResizableImage from '../ResizableImage';
import StyledInput, {
  StyledCategoryTitle,
  styledInputPropsSx,
} from '../StyledInput';

import classes from './CopyOptimizerFormFields.module.css';
import useWindowSize from '@/hooks/useWindowSize';
import {
  FooterContentType,
  OptimizerFormFieldType,
  StandardFormValuesType,
} from '@/common/types';
import { usePageContext } from '@/context';

import { convertEmailContentIntoOptimizerFields } from '@/utils';
import PreviewEmailFooter from '../email-footer/PreviewEmailFooter';
import { useSaveContent } from '@/hooks/useSaveContent';
import Link from 'next/link';
import TextAreaComponent from '../TextAreaComponent';
import AlertContinue from '../AlertContinue';

const getFileNameFromLink = (url: string) => {
  const parts = url.split('/');
  const fileNameWithExtension = parts[parts.length - 1];
  const fileName = fileNameWithExtension.split('.')[0];
  const fileExten = fileNameWithExtension.split('.')[1];
  const finalFileName = fileName.split('-').slice(0, -1).join('-');
  console.log(finalFileName, fileExten);
  return `${finalFileName}.${fileExten}`
};

const PlusIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_31_2268)">
      <path
        d="M10 0.5C8.02219 0.5 6.08879 1.08649 4.4443 2.1853C2.79981 3.28412 1.51809 4.8459 0.761209 6.67316C0.00433282 8.50042 -0.1937 10.5111 0.192152 12.4509C0.578004 14.3907 1.53041 16.1725 2.92894 17.5711C4.32746 18.9696 6.10929 19.922 8.0491 20.3078C9.98891 20.6937 11.9996 20.4957 13.8268 19.7388C15.6541 18.9819 17.2159 17.7002 18.3147 16.0557C19.4135 14.4112 20 12.4778 20 10.5C19.9969 7.84877 18.9424 5.30702 17.0677 3.43232C15.193 1.55762 12.6512 0.503065 10 0.5ZM14.4653 11.5526H11.0526V14.9653C11.0526 15.2444 10.9417 15.5122 10.7443 15.7096C10.5469 15.907 10.2792 16.0179 10 16.0179C9.72083 16.0179 9.45309 15.907 9.25568 15.7096C9.05827 15.5122 8.94737 15.2444 8.94737 14.9653V11.5526H5.53474C5.25557 11.5526 4.98782 11.4417 4.79042 11.2443C4.59301 11.0469 4.48211 10.7792 4.48211 10.5C4.48211 10.2208 4.59301 9.95308 4.79042 9.75567C4.98782 9.55827 5.25557 9.44737 5.53474 9.44737H8.94737V6.03474C8.94737 5.75556 9.05827 5.48782 9.25568 5.29041C9.45309 5.09301 9.72083 4.9821 10 4.9821C10.2792 4.9821 10.5469 5.09301 10.7443 5.29041C10.9417 5.48782 11.0526 5.75556 11.0526 6.03474V9.44737H14.4653C14.7444 9.44737 15.0122 9.55827 15.2096 9.75567C15.407 9.95308 15.5179 10.2208 15.5179 10.5C15.5179 10.7792 15.407 11.0469 15.2096 11.2443C15.0122 11.4417 14.7444 11.5526 14.4653 11.5526Z"
        fill="#0F6937"
      />
    </g>
    <defs>
      <clipPath id="clip0_31_2268">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

const RemoveIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_95_1658)">
      <path
        d="M8 0.666016C6.41775 0.666016 4.87103 1.13521 3.55544 2.01426C2.23985 2.89331 1.21447 4.14274 0.608967 5.60455C0.00346627 7.06635 -0.15496 8.67489 0.153721 10.2267C0.462403 11.7786 1.22433 13.204 2.34315 14.3229C3.46197 15.4417 4.88743 16.2036 6.43928 16.5123C7.99113 16.821 9.59966 16.6625 11.0615 16.057C12.5233 15.4515 13.7727 14.4262 14.6518 13.1106C15.5308 11.795 16 10.2483 16 8.66601C15.9977 6.545 15.1541 4.51152 13.6543 3.01173C12.1545 1.51195 10.121 0.668345 8 0.666016ZM10.9656 10.5004C11.042 10.5742 11.103 10.6625 11.1449 10.7601C11.1868 10.8577 11.2089 10.9627 11.2098 11.0689C11.2107 11.1751 11.1905 11.2805 11.1503 11.3788C11.11 11.4771 11.0506 11.5664 10.9755 11.6415C10.9004 11.7166 10.8111 11.776 10.7128 11.8163C10.6144 11.8565 10.5091 11.8767 10.4029 11.8758C10.2967 11.8749 10.1917 11.8528 10.0941 11.8109C9.99648 11.769 9.9082 11.708 9.8344 11.6316L8 9.79721L6.1656 11.6316C6.01472 11.7773 5.81264 11.858 5.60288 11.8562C5.39312 11.8543 5.19247 11.7702 5.04415 11.6219C4.89582 11.4735 4.81169 11.2729 4.80986 11.0631C4.80804 10.8534 4.88868 10.6513 5.0344 10.5004L6.8688 8.66601L5.0344 6.83161C4.88868 6.68073 4.80804 6.47865 4.80986 6.26889C4.81169 6.05914 4.89582 5.85849 5.04415 5.71016C5.19247 5.56183 5.39312 5.4777 5.60288 5.47588C5.81264 5.47405 6.01472 5.55469 6.1656 5.70041L8 7.53481L9.8344 5.70041C9.98528 5.55469 10.1874 5.47405 10.3971 5.47588C10.6069 5.4777 10.8075 5.56183 10.9559 5.71016C11.1042 5.85849 11.1883 6.05914 11.1901 6.26889C11.192 6.47865 11.1113 6.68073 10.9656 6.83161L9.1312 8.66601L10.9656 10.5004Z"
        fill="#E02424"
      />
    </g>
    <defs>
      <clipPath id="clip0_95_1658">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.666016)"
        />
      </clipPath>
    </defs>
  </svg>
);

type Field =
  | 'Subject line'
  | 'Paragraph 1'
  | 'Paragraph 2'
  | 'Call to action'
  | 'Paragraph 3';
const labelToField = (label: string): Field => {
  switch (label) {
    case 'Subject line':
      return 'Subject line';
    case 'Paragraph 1':
      return 'Paragraph 1';
    case 'Paragraph 2':
      return 'Paragraph 2';
    case 'Call to action':
      return 'Call to action';
    case 'Paragraph 3':
      return 'Paragraph 3';
    default:
      throw new Error(`Invalid label: ${label}`);
  }
};

type CopyOptimizerFormFieldsProps = {
  handleNext: Function;
  handleBack: Function;
  pi: string;
  setPi: (pi: string) => void;
  userId: number;
  veevaApprovalFlag: string;
  veevaApproval: string;
  setVeevaApproval: (text: string) => void;
  imageWidth: number;
  setImageWidth: React.Dispatch<React.SetStateAction<number>>;
};

const CopyOptimizerFormFields: React.FC<CopyOptimizerFormFieldsProps> = ({
  handleNext,
  handleBack,
  pi,
  setPi,
  userId,
  veevaApprovalFlag,
  veevaApproval,
  setVeevaApproval,
  imageWidth,
  setImageWidth,
}) => {
  const size = useWindowSize();
  const updatePi = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPi(e.target.value);
  };

  const updateVeevaApprobal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVeevaApproval(e.target.value);
  };
  const { updatePageContext, templateData } = usePageContext();
  const [optimizerFormData, setOptimizerFormData] = useState([
    ...(templateData?.optimizer?.formData || []),
  ]);
  const { saveContent } = useSaveContent();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isGeneratingEmailData, setIsGeneratingEmailData] = useState(false);
  const [referencesAndCitations, setReferencesAndCitations] = useState('');
  let checkcontinue = "";
  try {
    checkcontinue = localStorage.getItem("standard") || ""
  } catch (error) { }

  const { emailContent } = templateData?.optimizer || {};
  const { footers, ctas, unsubscribeLink, privacyPolicy } =
    (templateData?.formData as StandardFormValuesType) || {};

  const updateOptimizerPageContextValues = useCallback(
    (newData: object = {}) => {
      const { optimizer } = templateData;
      updatePageContext({
        optimizer: { ...optimizer, ...newData },
      });
    },
    [updatePageContext, templateData]
  );

  const moveFieldItem = useCallback(
    (currentIndex: number, direction: number) => {
      const contentItems = [...optimizerFormData];
      if (
        currentIndex + direction < 0 ||
        currentIndex + direction >= contentItems.length
      )
        return;

      const newContentItems = [...contentItems];
      [
        newContentItems[currentIndex],
        newContentItems[currentIndex + direction],
      ] = [
          newContentItems[currentIndex + direction],
          newContentItems[currentIndex],
        ];
      updateOptimizerPageContextValues({ formData: newContentItems });
      setOptimizerFormData(newContentItems);
    },
    [updateOptimizerPageContextValues, optimizerFormData]
  );
  const updateFieldData = useCallback(
    (key: string, newData: OptimizerFormFieldType) => {
      const updatedData = optimizerFormData.map(
        (data: OptimizerFormFieldType, index) =>
          data?.key === key ? { ...newData } : data
      );
      setOptimizerFormData([...updatedData]);
      updateOptimizerPageContextValues({ formData: updatedData });
    },
    [optimizerFormData, updateOptimizerPageContextValues, templateData]
  );
  const modifyContent = useCallback(
    async (
      action: string,
      key: string,
      field: string,
      currentContent: string,
      comment: string
    ) => {
      // if(key === 'referenceText') {
      //   const claim = 'Specific claim you want references and citations for';
      //   let newData = await generateReferencesAndCitations(emailContent, claim);
      //   console.log('newData', newData);
      // }else{
      let updatedData = await generateContent(
        field,
        action,
        currentContent,
        comment
      );
      if (updatedData) {
        // Remove incomplete sentence
        const lastIndex = updatedData.lastIndexOf('.');
        updatedData.substring(0, lastIndex + 1);
        const newContent: any = optimizerFormData.map(
          (data: OptimizerFormFieldType) =>
            data?.key === key ? { ...data, value: updatedData } : data
        );
        setOptimizerFormData([...newContent]);
        updateOptimizerPageContextValues({ formData: newContent });
      }
      // }
    },
    [optimizerFormData, updateOptimizerPageContextValues]
  );
  const reGenerateEmailContent = useCallback(async () => {
    setIsGeneratingEmailData(true);
    const claim = 'Specific claim you want references and citations for';
    let newEmailContent = await generateReferencesAndCitations(
      emailContent,
      claim
    );
    setTimeout(() => setIsGeneratingEmailData(false), 100);

    const additionalFields: Array<OptimizerFormFieldType> = [
      ...(ctas || [])
        .map(({ ctaType, ctaAction, ctaCustomLabel }, index) => ({
          type: 'cta',
          key: index,
          value: '',
          label: 'Call to action ' + (index + 1),
          ctaType,
          ctaAction,
          ctaCustomLabel,
        }))
        .filter(
          ({ ctaType }) =>
            ctaType !== null && ctaType !== undefined && ctaType !== ''
        ),
    ];

    const optimizerFormData = convertEmailContentIntoOptimizerFields(
      newEmailContent,
      (templateData.formData as StandardFormValuesType).contents,
      additionalFields
    );

    if (optimizerFormData?.length > 0) {
      let data: any = {};
      optimizerFormData.forEach((content) => {
        data[content.key] = content;
      });

      const newContent = optimizerFormData.map(
        (data: OptimizerFormFieldType) => ({ ...data, value: data.value })
      );
      setOptimizerFormData([...newContent]);
      updateOptimizerPageContextValues({ formData: newContent });
    }
  }, [emailContent, updateOptimizerPageContextValues, ctas]);

  const onFooterDataUpdate = useCallback(
    (data: Array<FooterContentType>) => {
      // console.log('onFooterDataUpdate');
      const { formData } = templateData;
      updatePageContext({
        formData: { ...(formData || {}), footers: data },
      });
    },
    [updatePageContext, templateData]
  );

  const onUnsubLinkUpdate = useCallback(
    (data: string) => {
      // console.log('onFooterDataUpdate');
      const { formData } = templateData;
      updatePageContext({
        formData: { ...(formData || {}), unsubscribeLink: data },
      });
    },
    [updatePageContext, templateData]
  );
  const onPrivacyPolicyUpdate = useCallback(
    (data: string) => {
      // console.log('onFooterDataUpdate');
      const { formData } = templateData;
      updatePageContext({
        formData: { ...(formData || {}), privacyPolicy: data },
      });
    },
    [updatePageContext, templateData]
  );
  ////////////////////////////////////////////////////////////////

  const generateFileDownloadLink = (file: File, url?: string) => {
    return (
      <div style={{ display: 'flex' }}>
        <a
          href={file instanceof Blob ? URL.createObjectURL(file) : file}
          download={file.name}
          style={{ textDecoration: 'none', marginLeft: '8px' }}
        >
          <Button variant="outlined" color="primary" size="small">
            Download {file.name}
          </Button>
        </a>
        {url && (
          <a
            href={url.startsWith('http') ? url : 'http://' + url}
            style={{ textDecoration: 'none', marginLeft: '8px' }}
            target="_blank"
          >
            <Button variant="outlined" color="primary" size="small">
              Open
            </Button>
          </a>
        )}
      </div>
    );
  };

  const refreshContent = async (
    field: Field,
    setValue: (value: string) => void,
    currentContent: string,
    comment: string | undefined
  ): Promise<void> => {
    const newContent = await generateContent(
      field,
      'refresh',
      currentContent,
      comment
    );
    setValue(newContent);
  };

  const addContent = async (
    field: Field,
    setValue: (value: string) => void,
    currentContent: string,
    comment: string | undefined
  ): Promise<void> => {
    const additionalContent = await generateContent(
      field,
      'add',
      currentContent,
      comment
    );
    setValue(additionalContent);
  };
  const removeContent = async (
    field: Field,
    setValue: (value: string) => void,
    currentContent: string,
    comment: string | undefined
  ): Promise<void> => {
    const contentToRemove = await generateContent(
      field,
      'remove',
      currentContent,
      comment
    );
    setValue(contentToRemove);
  };
  const [updatedEmail, setUpdatedEmail] = React.useState(emailContent);

  React.useEffect(() => {
    setUpdatedEmail(emailContent);
  }, [emailContent]);

  const onSaveButtonClick = async () => {
    setIsLoading(true)
    let { layout, formData, optimizer } = await templateData;

    const newId = await saveContent({
      userId,
      status: 'Optimisation',
      currentId: templateData.currentId,
      standardLayout: {
        formData,
        optimizer,
        layout,
        pi,
        veevaApprovalFlag,
      }
    });

    if (newId) {
      updatePageContext({
        currentId: Number(newId)
      });
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }

  const NextButton = () => (
    <Button
      onClick={() => checkcontinue == "" ? setOpen(true) : handleNext()}
      variant="contained"
      color="primary"
      //type='submit'
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
    <Button sx={{ textTransform: 'none', m: 1 }} variant="outlined" onClick={onSaveButtonClick} disabled={isLoading} >
      {' Save as Draft'}
    </Button>
  );

  const PreviousButton = () => (
    <Button
      sx={{ textTransform: 'none', m: 1 }}
      variant="outlined"
      onClick={() => handleBack()}
    >
      Previous
    </Button>
  );

  const ClearAllButton = () => (
    <Button
      variant="outlined"
      color="primary"
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
        spacing={size.width && size.width < 768 ? 3 : 2}
        className={classes.container}
      >
        <Grid item xs={12}>
          <StyledCategoryTitle>Change Layout Position</StyledCategoryTitle>
        </Grid>

        {optimizerFormData.map((field, index) => {
          if (field['type'] === 'cta') {
            return (
              <CallToActionFields
                moveFieldItem={moveFieldItem}
                key={index}
                data={field}
                index={index}
                totalFields={optimizerFormData?.length - 1}
              />
            );
          } else if (field['type'] === 'imageLink') {
            return (
              <ResizableImage
                key={index}
                file={field.value}
                imageWidth={imageWidth}
                setImageWidth={setImageWidth}
              />
            );
          } else {
            return (
              <FormField
                moveFieldItem={moveFieldItem}
                key={index}
                data={field}
                index={index}
                totalFields={optimizerFormData?.length - 1}
                updateFieldData={updateFieldData}
                modifyContent={modifyContent}
                reGenerateEmailContent={reGenerateEmailContent}
                isGeneratingEmailData={isGeneratingEmailData}
              />
            );
          }
        })}

        <PreviewEmailFooter
          footerData={footers}
          onFooterDataUpdate={onFooterDataUpdate}
        />

        <Grid item xs={12} sx={{ mt: '16px' }} mb={2}>
          <label>PI/API</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Lorem ipsum"
            value={pi}
            onChange={updatePi}
            inputProps={{ id: 'update pi' }}
            multiline
            rows={4}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>

        <Grid item xs={12}>
          <label>Unsubscribe link/token</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Unsubscribe link/token"
            value={unsubscribeLink || '{{unsubscribe_product_link}}'}
            onChange={(e) => onUnsubLinkUpdate(e.target.value)}
            // inputProps={{ id: 'update pi' }}
            // multiline
            rows={1}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: '16px' }}>
          <label>Privacy Policy</label>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Privacy Policy"
            value={privacyPolicy}
            onChange={(e) => onPrivacyPolicyUpdate(e.target.value)}
            // inputProps={{ id: 'update pi' }}
            multiline
            rows={1}
            InputProps={{ sx: styledInputPropsSx }}
          />
        </Grid>

        {veevaApprovalFlag === 'yes' && (
          <Grid item xs={12}>
            <label>Veeva Approval Code</label>
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              variant="outlined"
              // label="Veeva Approval Code"
              placeholder="Veeva Approval Code"
              value={veevaApproval}
              onChange={updateVeevaApprobal}
              inputProps={{ id: 'veeva-approval' }}
              multiline
              rows={1}
            />
          </Grid>
        )}

        {size.width && size.width < 768 ? (
          <Grid
            item
            xs={12}
            className='eeeeeeeeeeeewwww'
            sx={{
              '& button': {
                width: '100%',
              },
              paddingTop: '32px !important'
            }}
          >
            <Grid
              container
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <NextButton />
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
                <span style={{ marginLeft: '-8px' }}>
                  <GoToHomeButton />
                </span>
                <ClearAllButton />
              </Grid>
              <Grid item>
                <PreviousButton />
                <SaveAsDraftButton />
                <NextButton />
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
      <AlertContinue open={open} handleContinue={() => handleNext()} handleStay={() => setOpen(false)} isStandard />
    </>
  );
};
export default CopyOptimizerFormFields;

type FormFieldType = {
  index: number;
  totalFields: number;
  data: OptimizerFormFieldType;
  moveFieldItem: Function;
  updateFieldData?: Function;
  modifyContent?: Function;
  reGenerateEmailContent?: Function;
  isGeneratingEmailData?: boolean;
};

function FormField({
  index,
  totalFields,
  data,
  moveFieldItem,
  updateFieldData,
  modifyContent,
  reGenerateEmailContent,
  isGeneratingEmailData,
}: FormFieldType) {
  const { label, value, comments, key, image, imageWidth } = data;

  const [showComment, setshowComment] = useState(
    (comments && comments.length > 0) || false
  );

  const setImageWidth = useCallback(
    (width: number) => {
      updateFieldData && updateFieldData(key, { ...data, imageWidth: width });
    },
    [data, key, updateFieldData]
  );


  return (
    <Grid item xs={12}>
      <Box>
        {(label === 'Paragraph 1' || label === 'Paragraph 2') ?
          <TextAreaComponent key={key} isBottom={label === 'Paragraph 2'} value={value} label={label} onChangeData={(value) => {
            updateFieldData &&
              updateFieldData(key, { ...data, value: value })
          }} />
          :
          <><div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <label style={{ fontWeight: 500 }}>{label}</label>
          </div>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
              value={value}
              onChange={(e) =>
                updateFieldData &&
                updateFieldData(key, { ...data, value: e.target.value })
              }
              InputProps={{
                sx: styledInputPropsSx,
              }}
            /></>}
        {key === 'referenceText' ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'right',
              marginTop: '10px',
            }}
          >
            <ProgressButton
              isGeneratingEmailData={isGeneratingEmailData || false}
              reGenerateEmailContent={reGenerateEmailContent}
            />
          </div>
        ) : (
          <div className={classes.buttonContainer}>
            {/* <Button
              onClick={() => setshowComment(!showComment)}
              sx={{ textTransform: 'none' }}
              startIcon={<PlusIcon />}
            >
              Add Comments
            </Button> */}
            <div />
            <div className={classes.farButtons}>
              <div>
                <MoveUpButton onClick={() => moveFieldItem(index, -1)} />
                <MoveDownButton onClick={() => moveFieldItem(index, 1)} />
              </div>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none', margin: '0.25rem 1rem' }}
                onClick={() =>
                  modifyContent &&
                  modifyContent(
                    'refresh',
                    key,
                    labelToField(label),
                    value,
                    comments
                  )
                }
              >
                Generate New
              </Button>
            </div>
          </div>
        )}
      </Box>
      {image && (
        <Grid item xs={12} sx={{ mt: '15px' }}>
          <Box
            sx={{
              // width: '100%',
              border: '1px solid #D1D5DB',
              background: '#F9FAFB',
              borderRadius: '6px',
              padding: '20px 5px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ResizableImage
              file={image}
              imageWidth={imageWidth || 300}
              setImageWidth={setImageWidth}
            />
            {typeof image === 'string' && (
              <div
                style={{
                  color: '#6B7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginTop: '20px',
                }}
              >
                {getFileNameFromLink(image)}
              </div>
            )}
          </Box>
          <Box
            sx={{
              // width: '100%',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              margin: '10px 20px',
              gap: '10px',
            }}
          >
            {typeof image === 'string' && (
              <Link href={image} target="_blank">
                <Button
                  // onClick={onButtonClick}
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                // disabled={loading}
                >
                  Download
                </Button>
              </Link>
            )}

            <Button
              // onClick={onButtonClick}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            // disabled={loading}
            >
              Open
            </Button>
          </Box>
        </Grid>
      )}
      {showComment && (
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={5}
          placeholder="Add your comment"
          value={comments}
          onChange={(e) =>
            updateFieldData &&
            updateFieldData(key, { ...data, comments: e.target.value })
          }
          sx={{ mt: 1 }}
          InputProps={{ sx: styledInputPropsSx }}
        />
      )}
    </Grid>
  );
}

const MoveUpButton = ({ onClick }: { onClick: Function }) => {
  const size = useWindowSize();
  return (
    <IconButton
      onClick={() => onClick()}
      sx={{
        border: '1px solid #F9FAFB',
        width: size.width && size.width < 768 ? '32px' : '44px',
        height: size.width && size.width < 768 ? '32px' : '44px',
        margin: '0.25rem 0.5rem',
      }}
    >
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_93_1625)">
          <path
            d="M13.6632 5.73439L8.86417 0.908933C8.75243 0.796356 8.61946 0.707355 8.47305 0.647152C8.17955 0.525168 7.84993 0.525168 7.55643 0.647152C7.41002 0.707355 7.27705 0.796356 7.16531 0.908933L2.36627 5.73439C2.25168 5.84567 2.16028 5.97878 2.0974 6.12597C2.03453 6.27315 2.00143 6.43145 2.00005 6.59163C1.99866 6.75181 2.02902 6.91066 2.08934 7.05892C2.14967 7.20717 2.23875 7.34187 2.3514 7.45514C2.46405 7.5684 2.59801 7.65798 2.74545 7.71864C2.8929 7.77929 3.05088 7.80982 3.21018 7.80843C3.36949 7.80703 3.52692 7.77376 3.6733 7.71053C3.81967 7.64731 3.95206 7.5554 4.06273 7.44018L6.81618 4.67399V16.2382C6.81618 16.5581 6.94258 16.865 7.16758 17.0912C7.39258 17.3175 7.69775 17.4446 8.01594 17.4446C8.33414 17.4446 8.6393 17.3175 8.8643 17.0912C9.0893 16.865 9.2157 16.5581 9.2157 16.2382V4.67399L11.9668 7.44018C12.193 7.65993 12.4961 7.78153 12.8107 7.77878C13.1252 7.77603 13.4262 7.64916 13.6486 7.42549C13.871 7.20182 13.9972 6.89925 14 6.58294C14.0027 6.26664 13.8818 5.96191 13.6632 5.73439Z"
            fill="#1F2A37"
          />
        </g>
        <defs>
          <clipPath id="clip0_93_1625">
            <rect
              width="16"
              height="16.8889"
              fill="white"
              transform="translate(0 0.555664)"
            />
          </clipPath>
        </defs>
      </svg>
    </IconButton>
  );
};

const MoveDownButton = ({ onClick }: { onClick: Function }) => {
  const size = useWindowSize();
  return (
    <IconButton
      onClick={() => onClick()}
      sx={{
        border: '1px solid #F9FAFB',
        width: size.width && size.width < 768 ? '32px' : '44px',
        height: size.width && size.width < 768 ? '32px' : '44px',
        margin: '0.25rem 0.5rem',
      }}
    >
      <svg
        width="12"
        height="18"
        viewBox="0 0 12 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6479 10.5592C11.4232 10.3331 11.1184 10.206 10.8006 10.206C10.4828 10.206 10.1781 10.3331 9.95333 10.5592L7.20532 13.3252V1.76193C7.20532 1.44201 7.07906 1.13519 6.85431 0.90897C6.62956 0.682752 6.32473 0.555664 6.00689 0.555664C5.68905 0.555664 5.38422 0.682752 5.15947 0.90897C4.93472 1.13519 4.80846 1.44201 4.80846 1.76193V13.3252L2.06045 10.5592C1.9499 10.444 1.81766 10.3521 1.67145 10.2889C1.52523 10.2257 1.36797 10.1924 1.20885 10.191C1.04972 10.1896 0.89191 10.2201 0.744627 10.2808C0.597344 10.3414 0.463537 10.431 0.351013 10.5442C0.238489 10.6575 0.149501 10.7922 0.0892429 10.9404C0.0289846 11.0887 -0.00133752 11.2475 4.52493e-05 11.4077C0.00142802 11.5679 0.0344883 11.7261 0.097297 11.8733C0.160106 12.0205 0.251405 12.1536 0.365868 12.2649L5.1596 17.0899C5.27121 17.2025 5.40404 17.2915 5.55029 17.3517C5.69523 17.413 5.85087 17.4446 6.00809 17.4446C6.16531 17.4446 6.32095 17.413 6.46589 17.3517C6.61214 17.2915 6.74496 17.2025 6.85658 17.0899L11.6503 12.2649C11.8747 12.0383 12.0004 11.7314 12 11.4115C11.9995 11.0917 11.8729 10.7851 11.6479 10.5592V10.5592Z"
          fill="#1F2A37"
        />
      </svg>
    </IconButton>
  );
};

export function CallToActionFields({
  index,
  totalFields,
  data,
  moveFieldItem,
}: FormFieldType) {
  const { label, ctaAction, ctaType, ctaCustomLabel, key } = data;
  const callToActionText = ctaType === 'Custom' ? ctaCustomLabel : label;
  return (
    <>
      <Grid item xs={12} key={index}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <label style={{ color: '#D1D5DB' }}>Button Type {Number(key) + 1}</label>
            <Select
              disabled={true}
              fullWidth
              input={<StyledInput />}
              value={ctaType}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#D1D5DB',
                },
              }}
            >
              <MenuItem value={ctaType || 'Select'} disabled>
                {ctaType}
              </MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <label style={{ color: '#D1D5DB' }}>Button URL Link {Number(key) + 1}</label>
            <TextField
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#D1D5DB',
                },
              }}
              fullWidth
              value={ctaAction}
              disabled={true}
              InputProps={{
                sx: styledInputPropsSx,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

const ProgressButton = ({
  isGeneratingEmailData,
  reGenerateEmailContent,
}: {
  isGeneratingEmailData: boolean;
  reGenerateEmailContent?: Function;
}) => {
  // const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const loading = isGeneratingEmailData;

  async function onButtonClick() {
    reGenerateEmailContent && reGenerateEmailContent();
    // setProgress(0);
    const timer = setInterval(async () => {
      // setLoading(true);
      setProgress((prevProgress: number) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          // setLoading(false);
          // setProgress(0);
          return 95;
        }
        return prevProgress + 5;
      });
    }, 1000);
    return true;
  }

  useEffect(() => {
    if (isGeneratingEmailData) {
      // setLoading(true);
      setProgress(0);
    } else {
      // setLoading(false);
      setProgress(0);
    }

    return () => {
      // setLoading(false);
      setProgress(0);
    };
  }, [isGeneratingEmailData]);

  return (
    <Button
      onClick={onButtonClick}
      variant="outlined"
      sx={{ textTransform: 'none', margin: '0.25rem 1rem' }}
      disabled={loading}
    >
      {!loading ? 'Generate New' : 'Generating...'}
      {loading && (
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
      )}
    </Button>
  );
};