import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { styledInputPropsSx } from './StyledInput';
import StyledFileInput from './StyledFileInput';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FormState,
  UseFormGetFieldState,
  UseFormWatch,
} from 'react-hook-form';
import { onImageUpload } from '@/utils';
import useWindowSize from '@/hooks/useWindowSize';
import ProgressBar from './ProgressBar';

type PropType = {
  index: number;
  control: Control<any>;
  messageLabel: string;
  attachmentLabel: string;
  imgLinkLabel: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  watch: UseFormWatch<any>;
  messageFieldName: string;
  attachmentFieldeName: string;
  imgLinkFieldName: string;
  onDeleteButtonClick: Function;
  setImage?: ((e: File | null) => void) | undefined
  hanldeGetFile?: (e: File | null, index: number) => void
};

const MessageInput: React.FC<PropType> = ({
  index,
  setImage,
  hanldeGetFile,
  control,
  messageLabel,
  attachmentLabel,
  imgLinkLabel,
  formState,
  getFieldState,
  watch,
  messageFieldName,
  attachmentFieldeName,
  imgLinkFieldName,
  onDeleteButtonClick,
}) => {
  const attachment = watch(attachmentFieldeName);
  const sizes = useWindowSize()
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null)
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
           setIsUploading(false);
           setCurrentImage(imageFile); 
          //hanldeGetFile?.(imageFile, index)
        }
      };

  const handleDrop =
    (field: ControllerRenderProps<any>) =>
      async (event: React.DragEvent<HTMLInputElement>) => {
        setIsUploading(true)
        const droppedFile = event.dataTransfer.files[0];
        let uri = await onImageUpload(droppedFile);
        field.onChange(uri);
        setCurrentImage(droppedFile)
        setIsUploading(false)
      };

  return (
   <>
    <Grid container spacing={2} mb={sizes.width && sizes.width < 768 ? 0 : 4}>
      <Grid item xs={12}>
        <label>{messageLabel}</label>
        <Controller
          control={control}
          name={messageFieldName}
          render={({ field }) => (
            <TextField
            {...field}
            variant="outlined"
            placeholder={`What do you want to tell them`}
            fullWidth
            multiline
            rows={4}
            InputProps={{ sx: styledInputPropsSx }}
            />
            )}
            />
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mt={1}
          >
          {index != 0 && (
            <IconButton onClick={() => onDeleteButtonClick()} color="error">
              <RemoveCircleOutlineIcon />
            </IconButton>
          )}
        </Box>
        {attachment && (
          <Typography variant="body2" mt={1}>
            Selected file: {attachment.name}
          </Typography>
        )}
        {currentImage && <img src={URL.createObjectURL(currentImage)} width={64}/>}
      </Grid>
      <Grid item xs={12} sx={{ marginBottom: 2 }}>
        <label htmlFor={`attachment-${index}`}>{attachmentLabel}</label>
        <FormControl variant="outlined" fullWidth>
          <Controller
            control={control}
            name={attachmentFieldeName}
            render={({ field }) => (
              <StyledFileInput
                handleFileChange={handleFileChange(field)}
                handleDropFileChange={handleDrop(field)}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ marginBottom: 2 }}>
        <label>{imgLinkLabel}</label>
        <Controller
          control={control}
          name={imgLinkFieldName}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              placeholder="Enter URL if any"
              InputProps={{ sx: styledInputPropsSx }}
            />
          )}
        />
      </Grid>
    </Grid>
    <ProgressBar open={isUploading}  message="Loading..." handleClose={() => setIsUploading(false)}/>
   </>
  );
};

export default MessageInput;
