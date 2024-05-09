import { ColorPreferenceType } from '@/common/types';
import DesignLayout from '@/components/layouts/DesignLayout';
import { usePageContext } from '@/context';
import { buildEmailTemplateMarkup } from '@/utils';
import { Box, Button, Divider, Grid, Snackbar, useMediaQuery } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import GoToHomeButton from '../HomeButton';
import getCorrectVeevaMail from '@/utils/getCorrectVeevaMail';
import useWindowSize from '@/hooks/useWindowSize';
import classes from '@/components/standard-template/CopyToLayout.module.css';
import { AdUnitsOutlined, DesktopWindowsOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useSaveContent } from '@/hooks/useSaveContent';
import SendTest from '../SendTest';

type PagePropsType = {
  handleNext: Function;
  handleBack: Function;
  pi: string;
  userId: number;
  veevaApprovalFlag: string;
  veevaApproval: string;
  setVeevaZipFile: React.Dispatch<React.SetStateAction<Blob>>;
};

const buttonItem = [
  {
    value: 'origin',
    image: '/img/theme1.png',
  },
  {
    value: 'variation1',
    image: '/img/theme2.png',
  },
  {
    value: 'variation2',
    image: '/img/theme3.png',
  },
];

export default function DesignPreViewLayout({
  handleNext,
  handleBack,
  pi,
  userId,
  veevaApprovalFlag,
  veevaApproval,
  setVeevaZipFile,
}: PagePropsType) {
  const { updatePageContext, templateData } = usePageContext();
  console.log("🚀 ~ file: Layout.tsx:50 ~ templateData:", templateData)
  const [previewMode, setPreviewMode] = useState('desktop');
  const sizes = useWindowSize();
  const colorPreferences = useMemo(() => {
    const { body, footer } = templateData?.layout || {};
    return { body, footer };
  }, [templateData.layout]);
  const { saveContent } = useSaveContent();
  const [isLoading, setIsLoading] = useState(false);

  async function onNextButonClick() {
    const {
      optimizer: { formData: emailData },
      layout: {
        banner: { imgUrl: bannerImage },
      },
    } = templateData;
    const { body: bodyColorsData, footer: footerColorsData } = colorPreferences;

    const previewEmail = buildEmailTemplateMarkup({
      emailData,
      bannerImage,
      bodyColorsData,
      footerColorsData,
      footerData: templateData.formData.footers,
      pi,
      veevaApprovalFlag,
      veevaApproval,
      theme: previewMode === 'desktop' ? templateData.layout.variation : undefined,
      unsubscribeLink: templateData.formData?.unsubscribeLink || '{{unsubscribe_product_link}}',
      privacyPolicy: templateData.formData?.privacyPolicy || '',
    });
    const [subjectContent] = emailData.filter(({ type }) => type === 'subject');
    const { value: subject } = subjectContent;

    const exportData = {
      export: {
        subject,
        htmlContent: previewEmail,
      },
    };

    updatePageContext({
      ...templateData,
      ...exportData,
    });

    const veevaZipFile = await getCorrectVeevaMail({
      emailData,
      bannerImage,
      bodyColorsData,
      footerColorsData,
      footerData: templateData.formData.footers,
      pi,
      veevaApprovalFlag,
      veevaApproval,
      variation: templateData.layout.variation,
      unsubscribeLink: templateData.formData?.unsubscribeLink || '{{unsubscribe_product_link}}',
      privacyPolicy: templateData.formData?.privacyPolicy || '',
    });
    if (veevaZipFile) setVeevaZipFile(veevaZipFile);
    handleNext();
  }
  
  const PreviousButton = () => (
    <Button
      onClick={() => handleBack()}
      sx={{ textTransform: 'none', margin: '8px' }}
      variant="outlined"
    >
      Previous
    </Button>
  );

  const SaveAsDraftButton = () => (
    <Button sx={{ textTransform: 'none', margin: '8px' }} variant="outlined" onClick={() => onSaveButtonClick()}>
      Save as Draft
    </Button>
  );

  const NextButton = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={() => onNextButonClick()}
      sx={{ color: 'white', margin: '8px', textTransform:'none' }}
    >
      Continue
    </Button>
  );

  const ClearAllButton = () => (
    <Button sx={{ textTransform: 'none' }} variant="outlined">
      Clear All
    </Button>
  );

  const updateVariationContext = useCallback(
    (variation: string|undefined) => {
      const { layout } = templateData;
      updatePageContext({
        layout: {
          ...layout,
          variation: variation,
        },
      });
    },
    [templateData, updatePageContext]
  );
   
 const onSaveButtonClick = async() => {
    const { optimizer, formData, layout, currentId } = templateData;
    setIsLoading(true) 
    const newId = await saveContent({
      userId,
      status: 'Preview',
      currentId,
      videoLayout: {
        formData,
        optimizer,
        layout,
        pi,
        veevaApprovalFlag,
      }
    }); 
    if(newId) {
      updatePageContext({
        currentId: Number(newId),
      })
    }
    setTimeout(() => {
      setIsLoading(false)
    },5000)
  }

  const themeUI = useTheme();

  const isMobile = useMediaQuery(themeUI.breakpoints.down('md'));

  const SelectVariation = () => (
    <Box
      sx={{ display: 'flex', width: '100%' }}
      flexDirection={isMobile ? 'column' : 'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      rowGap={'10px'}
    >
      {buttonItem.map((item, index) => (
        <Box key={index} width={isMobile ? '100%' : 'auto'}>
          <div
            className={`theme-select ${(templateData.layout.variation === item.value || !templateData.layout.variation && item.value === 'origin')  && 'theme-selected'}`}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              background: '#F8F8F8',
              padding: '2px 40px',
            }}
            onClick={() => updateVariationContext(item.value)}
          >
            <img height={isMobile ? 130 : 200} src={item.image} alt={`theme ${index}`} />
          </div>
        </Box>
      ))}
    </Box>
  );

  const SelectPreview = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #0F6937',
          height: '2.6em',
          width: '2.6em',
          borderRadius: '8px',
          color: previewMode === 'desktop' ? 'white' : '#0F6937',
          background: previewMode === 'desktop' ? '#0F6937' : 'white',
        }}
        onClick={() => setPreviewMode('desktop')}
      >
        <div>
          <DesktopWindowsOutlined style={{ fontSize: '1.6em' }} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #0F6937',
          height: '2.6em',
          width: '2.6em',
          borderRadius: '8px',
          color: previewMode === 'mobile' ? 'white' : '#0F6937',
          background: previewMode === 'mobile' ? '#0F6937' : 'white',
        }}
        onClick={() => {setPreviewMode('mobile'), updateVariationContext(undefined)}}
      >
        <AdUnitsOutlined style={{ fontSize: '1.6em' }} />
      </div>
    </div>
  );

  return (
    <>
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={9}
      rowSpacing={2}
      className={classes.iframeContainer}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={'center'}
        maxWidth={'min(90vw, 800px)'}
        width={'100%'}
        marginBottom={'20px'}
      >
        <div style={{ fontWeight: 700, fontSize: '20px' }}>Select Preview</div>
        <SelectPreview />
      </Box>
      
      {previewMode === 'desktop' && (
        <>
          <Box
            display="flex"
            flexDirection={'column'}
            justifyContent="space-between"
            maxWidth={'min(90vw, 800px)'}
            width={'100%'}
          >
            <div
              style={{
                background: '#E0E0E0',
                width: '100%',
                height: '1px',
                marginBottom: '30px',
              }}
            ></div>
            <div style={{ fontWeight: 700, fontSize: '20px' }}>
              Select Variation
            </div>
          </Box>
          <Box
            mt={3}
            mb={3}
            display="flex"
            justifyContent="space-between"
            maxWidth={'min(90vw, 800px)'}
            width={'100%'}
          >
            <SelectVariation />
          </Box>
        </>
      )}

      <DesignLayout
        bodyColorsData={colorPreferences.body}
        footerColorsData={colorPreferences.footer}
        emailData={templateData.optimizer.formData}
        bannerImage={templateData.layout.banner.imgUrl}
        footerData={templateData.formData.footers}
        pi={pi}
        veevaApprovalFlag={veevaApprovalFlag}
        veevaApproval={veevaApproval}
        theme={previewMode === 'desktop' ? templateData.layout.variation : undefined}
        previewMode={previewMode}
        unsubscribeLink={templateData.formData?.unsubscribeLink || '{{unsubscribe_product_link}}'}
        privacyPolicy={templateData.formData?.privacyPolicy || ''}
      />

      {sizes.width && sizes.width < 768 ? (
        <Box
          width={'100%'}
          maxWidth={'min(90vw, 800px)'}
          sx={{
            '& button': {
              width: '90%',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <NextButton />
          <SaveAsDraftButton />
          <PreviousButton />
          <Divider sx={{ margin: '8px 0 16px 0' }} flexItem>
            Or
          </Divider>
          <ClearAllButton />
        </Box>
      ) : (
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          maxWidth={'min(90vw, 800px)'}
          width={'100%'}
        >
          <Box sx={{ marginTop: '8px' }}>
            <span style={{ marginRight: '8px' }}>
              <GoToHomeButton />
            </span>
            <ClearAllButton />
            {userId === 1 && (
            <SendTest templateData={templateData} pi={pi} veevaApproval={veevaApproval} veevaApprovalFlag={veevaApproval}/>
          )}
          </Box>
          <Box>
            <PreviousButton />
            <SaveAsDraftButton />
            <NextButton />
          </Box>
        </Box>
      )}
    </Grid>
    <Snackbar
    open={isLoading}
    autoHideDuration={6000}
    message="Template Successfully Saved"
  />
  </>
  );
}
