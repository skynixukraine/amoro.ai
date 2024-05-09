import React from 'react';
import { Control, Controller, FormState, UseFormGetFieldState, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormControl, Grid, InputLabel, TextField } from '@mui/material';
import HighlightOff from '@mui/icons-material/HighlightOff';
import { red } from '@mui/material/colors';
import Image from 'next/image';

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  required: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>
}

export default function EmailFooter({
  control,
  name,
  label,
  formState,
  getFieldState,
  required = false,
  watch,
  // setValue
}: Props) {

  const { error } = getFieldState(name, formState);
  const footerImage = watch('footerImage');

  return (
    <>
      <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} columnSpacing={2}>

        <Grid item xs={12} sm={4} md={4} lg={4} xl={4} alignSelf="center" textAlign="center">
          <InputLabel sx={{ marginBottom: 1.5 }}>Company Logo</InputLabel>
          <FormControl variant='outlined'>
            <Controller
              control={control}
              name='footerImage'
              rules={{ required }}
              render={({ field }) => (
                <>
                  <label htmlFor={`company-logo`}>
                    <Image
                      height='50'
                      width='100'
                      alt='footer-image'
                      src={footerImage || '/img/upload-icon.png'}
                      style={{ cursor: 'pointer', height: 'auto' }}
                    />
                  </label>
                  {footerImage ? <HighlightOff
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
                  {/* <input
                    style={{ display: 'none' }}
                    id={`company-logo`}
                    type='file'
                    accept='image/png,image/jpeg'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const imageFile = event.target.files && event.target.files.length > 0 && event.target.files[0] || null;
                      if(imageFile){
                        // const footerImageUrl = imageFile ? URL.createObjectURL(imageFile) : ''; 
                        // if(footerImage) {
                        //   URL.revokeObjectURL(footerImage)
                        // }
                        var reader = new FileReader();
                        reader.readAsDataURL(imageFile)
                        reader.onloadend = () => field.onChange(reader.result);
                        
                      }
                    }}
                  /> */}
                </>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
          <Controller
            control={control}
            name={name}
            rules={{ required }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label={label}
                multiline
                rows={4}
                error={!!(error)}
                // helperText={message}
                placeholder={label}
              />
            )}
          />
        </Grid>

        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={3} >
          <Box
            display='flex'
            justifyContent='flex-end'
            alignItems='center'
          >
            <FormControl variant='outlined'>
              <Controller
                control={control}
                name='footerImage'
                rules={{ required }}
                render={({field }) => (
                  <input
                    style={{ display: 'none' }}
                    id="footer-logo-input"
                    type='file'
                    accept='image/png,image/jpeg'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange((event.target.files && event.target.files.length > 0 && event.target.files[0]) || undefined);
                    }}
                  />
                )}
              />
              <label htmlFor="footer-logo-input">
                  <Button variant='outlined' component='span'>
                    Upload Company Logo
                  </Button>
                </label>
            </FormControl>
            {footerImage && footerImage !== '' ? <IconButton
              onClick={() => setValue('footerImage', undefined)}
              color='error'
            >
              <RemoveCircleOutline />
            </IconButton> : null}
          </Box>
          {footerImage  && footerImage !== '' &&  (
            <Typography variant='body2' mt={1} display="block" textAlign="right">
              <strong>Selected file: </strong>{footerImage.name}
            </Typography>
          )}
        </Grid>*/}
      </Grid>

    </>
  );
}