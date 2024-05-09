import {
  ColorPreferenceType,
  FooterContentType,
  OptimizerFormFieldType,
} from '@/common/types';
import { buildEmailTemplateMarkup } from '@/utils';

import {
  Grid,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';

type Props = {
  bannerImage: string | null;
  bodyColorsData: ColorPreferenceType;
  footerColorsData: ColorPreferenceType;
  emailData: Array<OptimizerFormFieldType>;
  footerData: Array<FooterContentType>;
  pi: string;
  veevaApprovalFlag: string;
  veevaApproval: string;
  imageWidth?: number;
  theme?: string;
  previewMode?: string;
  unsubscribeLink?: string;
  privacyPolicy?: string;
};

export default function DesignLayout({
  bannerImage,
  bodyColorsData,
  footerColorsData,
  emailData,
  footerData,
  pi,
  veevaApprovalFlag,
  veevaApproval,
  imageWidth,
  theme,
  previewMode,
  unsubscribeLink,
  privacyPolicy
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        const previewEmail = buildEmailTemplateMarkup({
          emailData,
          bannerImage,
          bodyColorsData,
          footerColorsData,
          footerData,
          pi,
          veevaApprovalFlag,
          veevaApproval,
          imageWidth,
          theme,
          previewMode,
          unsubscribeLink: unsubscribeLink || '{{unsubscribe_product_link}}',
          privacyPolicy: privacyPolicy || '',
        });
        doc.open();
        doc.write(previewEmail);
        doc.close();
      }
    }

    return () => { };
  }, [
    bannerImage,
    bodyColorsData,
    footerColorsData,
    emailData,
    footerData,
    pi,
    veevaApprovalFlag,
    veevaApproval,
    imageWidth,
    theme,
    unsubscribeLink,
    privacyPolicy
  ]);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      columnSpacing={1}
      justifyContent={'center'}
      display={'flex'}
      position={'relative'}
    >
      {previewMode === 'mobile' ? (
        <Grid
          container
          item
          width={320}
          height={'650px'}
          marginTop={'15px'}
          marginBottom={5}
        >
          <iframe
            ref={iframeRef}
            title="Email Preview"
            width="100%"
            style={{
              zIndex: 9,
              border: 'none',
              height: '100%',
              borderRadius: '40px',
              background: '#fff',
            }}
          />
        </Grid>
      ) : (
        <Grid container item xs={12}>
          <iframe
            ref={iframeRef}
            title="Email Preview"
            width="100%"
            height="100%"
          />
        </Grid>
      )}
      {previewMode && previewMode === 'mobile' && (
        <div style={{ position: 'absolute', width: '350px', height: '700px' }}>
          <img src="/img/mobile.png" width={'100%'} height={'100%'} />
        </div>
      )}
    </Grid>
  );
}
