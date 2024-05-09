// import { FormValues } from "@/pages/video-email-generator/FormFields";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { memo } from 'react';
import {
  Controller,
  Control,
  FormState,
  UseFormGetFieldState,
  UseFormWatch,
} from 'react-hook-form';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SquareIconButton from './SquareIconButton';
import Remove from '@mui/icons-material/Remove';
import { grey, red } from '@mui/material/colors';
import StyledInput, { styledInputPropsSx } from './StyledInput';

type PropType = {
  index: number;
  control: Control<any>;
  ctaLabel: string;
  ctaActionLabel: string;
  ctaCustomLabel: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  watch: UseFormWatch<any>;
  ctaTypeFieldName: string;
  ctaActionFieldeName: string;
  ctaCustomFieldeName: string;
  onDeleteButtonClick: Function;
};

const CallToActionDropdown = memo(function CallToActionDropdown({
  index,
  control,
  ctaLabel,
  ctaActionLabel,
  formState,
  getFieldState,
  watch,
  ctaTypeFieldName,
  ctaActionFieldeName,
  onDeleteButtonClick,
  ctaCustomFieldeName,
  ctaCustomLabel,
}: PropType) {
  let ctaTypeData = watch(ctaTypeFieldName);
  ctaTypeData = ctaTypeData && ctaTypeData != '' ? ctaTypeData : null;
  const { error: ctaActionError } = getFieldState(
    ctaActionFieldeName,
    formState
  );

  // useEffect(() => {
  //   clearErrors(name)
  // }, [clearErrors, name]);

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      columnSpacing={2}
      mt={{ xs: 4, sm: 1 }}
      mb={2}
    >
      <Grid item xs={12} mb={1}>
        <Controller
          control={control}
          name={ctaTypeFieldName}
          render={({ field }) => (
            <FormControl {...field} fullWidth margin="normal">
              <label style={{marginBottom:"0px", fontSize:'14px'}}>{ctaLabel}</label>
              <Select
                required
                labelId={`${ctaTypeFieldName}-label`}
                id={`${ctaTypeFieldName}-select`}
                {...field}
                inputProps={{ id: 'callToAction' }}
                input={<StyledInput />}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Click here">Click here</MenuItem>
                <MenuItem value="Find out more">Find out more</MenuItem>
                <MenuItem value="Download">Download</MenuItem>
                <MenuItem value="Watch Video">Watch Video</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {ctaTypeData === 'Custom' ? (
        <Grid item xs={12}>
          <Controller
            control={control}
            rules={{ required: 'Enter Custom Call To Action Label' }}
            name={ctaCustomFieldeName}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                defaultValue=""
                margin='none'
                error={!!ctaActionError}
                // helperText={ctaActionError?.message}
                placeholder={ctaCustomLabel}
                InputProps={{ sx: styledInputPropsSx }}
              />
            )}
          />
        </Grid>
      ) : null}

      <Grid item xs={12}>
        <label style={{fontSize:'14px'}}>{ctaActionLabel}</label>
        <Controller
          control={control}
          rules={{ required: false }}
          name={ctaActionFieldeName}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin='none'
              defaultValue=""
              error={!!ctaActionError}
              helperText={ctaActionError?.message}
              placeholder={ctaActionLabel}
              InputProps={{ sx: styledInputPropsSx }}
            />
          )}
        />
      </Grid>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1}>
        {index != 0 && (
          <IconButton onClick={() => onDeleteButtonClick()} color="error">
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Box>
    </Grid>
  );
});
export default CallToActionDropdown;
