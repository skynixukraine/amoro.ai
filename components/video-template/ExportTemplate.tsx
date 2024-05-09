import React, { useEffect, useMemo, useState } from 'react';
import { usePageContext } from '@/context';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfDocument } from '@/components/PDFExport';
import GoToHomeButton from '../HomeButton';
// import axios from 'axios';
import axios from '@/common/config';
import { StyledCategoryTitle } from '../StyledInput';
import useWindowSize from '@/hooks/useWindowSize';
import { useSaveContent } from '@/hooks/useSaveContent';
import getCorrectRegularMail from '@/utils/getCorrectRegularMail';
import { useRouter } from 'next/router';
import { replaceImgSrcWithBlobUrl } from '@/utils/image';

type Props = {
  handleNext: Function;
  handleBack: Function;
  veevaZipFile: Blob;
  userId: number;
  subscriptionType: string;
  pi: string;
  veevaApproval: string;
  veevaApprovalFlag: string;
  user: any;
};

export default function ExportTemplate({
  handleBack,
  veevaZipFile,
  userId,
  subscriptionType,
  pi,
  user,
  veevaApproval,
  veevaApprovalFlag,
}: Props) {
  const sizes = useWindowSize();
  const { updatePageContext, templateData } = usePageContext();
  const { saveContent } = useSaveContent();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const footerData = templateData.formData.footers;
  const additionalFootersHTML = footerData
    .slice(1)
    ?.map(
      (footer) =>
        `<div class="footer ${
          /*footer.isReversed*/ false ? 'swap' : 'no-swap'
        }">
      <div class="footer-img-wrapper">
        ${
          footer.image
            ? `<img class="footer-img" src=${
                footer.image instanceof Blob
                  ? URL.createObjectURL(footer.image)
                  : footer.image
              } />`
            : ''
        }
      </div>
      <div class="footer-text">
        ${
          footer.text
            ? `<p class="footertext">${footer.text.replace(/\n/g, '<br/>')}</p>`
            : ''
        }
      </div>
    </div>`
    )
    .join('');
  let {
    export: { htmlContent },
  } = templateData;
  htmlContent.replaceAll('undefined', additionalFootersHTML);

  const timeStamp = new Date().getTime();
  const pdfFileName = `video_${timeStamp}.pdf`;
  const htmlFileName = `video_${timeStamp}.zip`;
  const htmlRegularName = `video_${timeStamp}.html`;
  function checkTimeDifference(dateTimeString: string): boolean {
    const targetDate = new Date(dateTimeString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - targetDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference > 30;
  }

  // Generate the HTML content as a string
  const saveExported = (type: string, template: string) => {
    const { optimizer, formData, currentId, layout } = templateData;
    axios
      .post('/api/exports', {
        user_id: userId,
        exportType: type,
        exportTemplate: template,
        draft_id: currentId,
        data: htmlContent,
        templates: {
          formData,
          optimizer,
          layout,
          pi,
          veevaApprovalFlag,
        },
      })
      .then(() => console.log('Export saved in the database'));
  };

  const handleExportVeevaZip = () => {
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    if (!veevaZipFile) return;
    let url = window.URL.createObjectURL(veevaZipFile);
    a.href = url;
    a.download = htmlFileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    //Save to database
    saveExported('html', 'video');
  };

  const colorPreferences = useMemo(() => {
    const { body, footer } = templateData?.layout || {};
    return { body, footer };
  }, [templateData.layout]);
  const [content, setContent] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      if (htmlContent) {
        const data = await replaceImgSrcWithBlobUrl(
          htmlContent.replaceAll('undefined', additionalFootersHTML)
        );
        setContent(data);
      }
    };

    fetchData();
  }, [htmlContent]);

  const handleExportRegularHtml = async () => {
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
      isHtml: false,
      unsubscribeLink:
        templateData.formData?.unsubscribeLink ||
        '{{unsubscribe_product_link}}',
      privacyPolicy: templateData.formData?.privacyPolicy || '',
    });

    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    if (!htmlContent) return;
    let url = window.URL.createObjectURL(htmlContent);
    a.href = url;
    a.download = htmlRegularName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    //Save to database
    saveExported('html', 'video');
  };

  const onSaveButtonClick = async () => {
    const { optimizer, formData, layout, currentId } = templateData;
    setIsLoading(true);
    const newId = await saveContent({
      userId,
      status: 'Preview',
      currentId,
      standardLayout: {
        formData,
        optimizer,
        layout,
        pi,
        veevaApprovalFlag,
      },
    });
    if (newId) {
      updatePageContext({
        currentId: Number(newId),
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const PreviousButton = () => (
    <Button
      variant="outlined"
      onClick={() => handleBack()}
      sx={{ textTransform: 'none', margin: '8px' }}
    >
      Previous
    </Button>
  );

  const ClearAllButton = () => (
    <Button
      variant="outlined"
      disabled={true}
      sx={{ textTransform: 'none', margin: '8px' }}
    >
      Clear All
    </Button>
  );
  const [checkExport, setCheckExport] = useState<boolean>(true);
  const [checkExportHtml, setCheckExportHtml] = useState<boolean>(true);

  useEffect(() => {
    if (user && subscriptionType) {
      if (user.userRights.includes('exportToPDF')) {
        setCheckExport(true);
      } else if (
        checkTimeDifference(user.createdAt) ||
        subscriptionType !== 'free'
      ) {
        setCheckExport(true);
      } else {
        setCheckExport(false);
      }
    }
    if (user && subscriptionType) {
      if (user.userRights.includes('exportToHTML')) {
        setCheckExportHtml(true);
      } else if (
        checkTimeDifference(user.createdAt) ||
        subscriptionType !== 'free'
      ) {
        setCheckExportHtml(true);
      } else {
        setCheckExportHtml(false);
      }
    }
  }, [user, subscriptionType]);

  const ExportHTMLButton = () => {
    return checkExportHtml ? (
      <Button
        onClick={handleExportVeevaZip}
        variant="contained"
        sx={{
          textTransform: 'none',
          color: '#fff',
          m: 1,
          width: sizes.width && sizes.width < 768 ? '100% !important' : 'auto',
        }}
        disabled={
          !user?.pricing_id || !user?.userRights?.includes('exportToHTML')
        }
      >
        Veeva compatible HTML
      </Button>
    ) : (
      <></>
    );
  };

  const RegularHTMLButton = () => {
    return checkExportHtml ? (
      <Button
        onClick={handleExportRegularHtml}
        variant="contained"
        sx={{
          textTransform: 'none',
          color: '#fff',
          m: 1,
          width: sizes.width && sizes.width < 768 ? '100% !important' : 'auto',
        }}
        disabled={
          !user?.pricing_id || !user?.userRights?.includes('exportToHTML')
        }
      >
        Regular HTML
      </Button>
    ) : (
      <></>
    );
  };
  const DownloadPdfButton = () => {
    return checkExport && content ? (
      <PDFDownloadLink
        document={PdfDocument(content)}
        onClick={() => saveExported('pdf', 'video')}
        fileName={pdfFileName}
        style={{ margin: '8px' }}
      >
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            width:
              sizes.width && sizes.width < 768 ? '100% !important' : 'auto',
          }}
        >
          Export to PDF
        </Button>
      </PDFDownloadLink>
    ) : (
      <></>
    );
  };

  const SaveToDraftButton = () => (
    <Button
      variant="outlined"
      sx={{ textTransform: 'none', margin: '8px' }}
      onClick={() => onSaveButtonClick()}
      disabled={isLoading}
    >
      Save to Draft
    </Button>
  );

  return (
    <div style={{ width: '100%' }}>
      <StyledCategoryTitle>
        <div
          style={{
            display: sizes.width && sizes.width < 768 ? 'block' : 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              paddingLeft: sizes.width && sizes.width < 768 ? '10px' : 0,
            }}
          >
            Export
          </span>
          <div
            style={{
              display: sizes.width && sizes.width < 768 ? 'block' : 'flex',
              alignItems: 'center',
            }}
          >
            <ExportHTMLButton />
            <RegularHTMLButton />
          </div>
        </div>
      </StyledCategoryTitle>
      <Typography
        variant="h5"
        marginBottom={2}
        sx={{
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '150%',
          marginLeft: '1rem',
        }}
      >
        Email Content
      </Typography>

      <TextField
        multiline
        rows={10}
        margin="normal"
        value={htmlContent.replaceAll('undefined', additionalFootersHTML)}
        variant="outlined"
        fullWidth
        sx={{
          marginLeft: '1rem',
          backgroundColor: '#F9FAFB',
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#000000',
          },
          maxWidth: '75vw',
        }}
        disabled
      />
      {sizes.width && sizes.width < 768 ? (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          sx={{
            '& button': {
              width: '90%',
            },
            '& a': {
              width: '90%',
            },
          }}
        >
          <DownloadPdfButton />
          <SaveToDraftButton />
          <PreviousButton />
          <Divider flexItem>Or</Divider>
          <ClearAllButton />
        </Box>
      ) : (
        <div
          style={{
            marginLeft: '8px',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <GoToHomeButton />
            <ClearAllButton />
          </div>
          <div>
            <PreviousButton />
            <SaveToDraftButton />
            <DownloadPdfButton />
          </div>
        </div>
      )}
      <Snackbar
        open={isLoading}
        autoHideDuration={6000}
        message="Template Successfully Saved"
      />
    </div>
  );
}
