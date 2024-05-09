import React from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Image from 'next/image';
import Remove from '@mui/icons-material/Remove';
import { grey, red } from '@mui/material/colors';
import SquareIconButton from './SquareIconButton';
import { styledInputPropsSx } from './StyledInput';
import StyledFileInput from './StyledFileInput';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FormState,
  UseFormGetFieldState,
  UseFormSetValue,
  UseFormWatch,
  set,
} from 'react-hook-form';
import { onImageUpload } from '@/utils';
import ProgressBar from './ProgressBar';

type PropType = {
  index: number;
  control: Control<any>;
  footerLabel: string;
  logoLabel: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  footerFieldName: string;
  logoFieldeName: string;
  onDeleteButtonClick: Function;
  hanldeGetFile?: (file: File | null, index: number) => void
};

const FooterInput: React.FC<PropType> = ({
  index,
  control,
  footerLabel,
  logoLabel,
  formState,
  getFieldState,
  hanldeGetFile,
  watch,
  setValue,
  footerFieldName,
  logoFieldeName,
  onDeleteButtonClick,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<File | null>(null);
  const logo = watch(logoFieldeName);
  const handleFileChange =
    (field: ControllerRenderProps<any>) =>
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          const imageFile =
            (event.target.files &&
              event.target.files.length > 0 &&
              event.target.files[0]) ||
            null;
          setIsUploading(true);  
          let uri = await onImageUpload(imageFile);
          field.onChange(uri);  
          //hanldeGetFile?.(imageFile, index)
          setCurrentImage(imageFile);
          setIsUploading(false);
        }
      };

  const handleDrop =
    (field: ControllerRenderProps<any>) =>
      async(event: React.DragEvent<HTMLInputElement>) => {
        setIsUploading
        const droppedFile = event.dataTransfer.files[0];
        let uri = await onImageUpload(droppedFile);
        field.onChange(uri);
        setCurrentImage(droppedFile);
        setIsUploading(false);
      };

  return (
    <>
      <Grid item xs={12} mt={2} mb={2}>
        <label style={{fontSize:'14px'}}>{footerLabel}</label>
        <Grid container xs={12}>
          <Grid item xs={index != 0 ? 11 : 12} >
            <Controller
              control={control}
              name={footerFieldName}
              render={({ field }) => (
                <TextField
                  {...field}
                  // margin="normal"
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={5}
                  InputProps={{ sx: styledInputPropsSx }}
                  placeholder="Company address, Website, AE reporting details and other mandatory content"
                />
              )}
            />
          </Grid>
          {index != 0 && (
            <Grid item xs={1} alignSelf="center" textAlign="center">
              <SquareIconButton
                type="button"
                onClick={() => onDeleteButtonClick()}
                sx={{
                  backgroundColor: grey[200],
                  color: red[400],
                  ':hover': { backgroundColor: red[300], color: 'white' },
                }}
              >
                <Tooltip title="Remove Footer">
                  <Remove fontSize="small" />
                </Tooltip>
              </SquareIconButton>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <label  style={{fontSize:'14px'}}>{logoLabel}</label>
        <FormControl variant="outlined" fullWidth>
          <Controller
            control={control}
            name={logoFieldeName}
            render={({ field }) => (
              <StyledFileInput
                handleFileChange={handleFileChange(field)}
                handleDropFileChange={handleDrop(field)}
              />
            )}
          />
        </FormControl>

        {logo && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" mt={1}>
              Selected file: {logo.name}
            </Typography>
            <IconButton
              onClick={() => setValue('footerImage', undefined)}
              color="error"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        )}
        {currentImage && <div style={{ display: 'flex', justifyContent: 'center' }}><img src={URL.createObjectURL(currentImage)} width={64}/></div>}
      </Grid>
      <ProgressBar open={isUploading}  message="Loading..." handleClose={() => setIsUploading(false)}/>
    </>
  );
};

export default FooterInput;
