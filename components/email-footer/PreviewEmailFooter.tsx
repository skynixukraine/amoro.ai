import HighlightOff from '@mui/icons-material/HighlightOff';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  TextField,
} from '@mui/material';
import { red } from '@mui/material/colors';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { styledInputPropsSx } from '../StyledInput';
import { FooterContentType } from '@/common/types';

type FooterProps = {
  footerData: Array<FooterContentType>;
  onFooterDataUpdate: Function;
};

const PreviewEmailFooter = ({
  footerData,
  onFooterDataUpdate,
}: FooterProps) => {
  const updateFieldData = (index: number, key: string, value: any) => {
    let newItem = footerData[index];
    if (key == 'text') {
      newItem.text = value;
    } else {
      newItem.image = value;
    }

    let newData: any = footerData.map((f, i) => (index != i ? f : newItem));
    onFooterDataUpdate(newData);
  };

  return (
    <Grid container item xs={12}>
      <Grid container item xs={12}>
        {footerData.map((footer, index) => (
          <Grid key={index} mt={2} xs={12}>
            {footer.image && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <IconButton
                    sx={{ position: 'absolute', right: -13, top: -13 }}
                    onClick={() => updateFieldData(index, 'image', null)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Image
                    src={
                      footer.image instanceof Blob
                        ? URL.createObjectURL(footer.image)
                        : footer.image
                    }
                    alt="footer logo"
                    width={110}
                    height={110}
                    style={{ borderRadius: 55, background: 'blue' }}
                  />
                </div>
              </div>
            )}
            <label style={{fontSize:'14px'}}>Email Footer</label>
            <Grid item xs={12}>
              <TextField
                // margin="normal"
                fullWidth
                multiline
                rows={4}
                placeholder="Email footer"
                onChange={(e) => updateFieldData(index, 'text', e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
                value={footer.text}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PreviewEmailFooter;

const  RemoveIcon = ()=> {
  return (
    <svg
      baseProfile="tiny"
      viewBox="0 0 24 24"
      fill="#E02424"
      height="32px"
      width="32px"
    >
      <path d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8 8-3.582 8-8-3.581-8-8-8zm3.707 10.293a.999.999 0 11-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 01-1.414 0 .999.999 0 010-1.414L10.586 12 8.293 9.707a.999.999 0 111.414-1.414L12 10.586l2.293-2.293a.999.999 0 111.414 1.414L13.414 12l2.293 2.293z" />
    </svg>
  );
}
