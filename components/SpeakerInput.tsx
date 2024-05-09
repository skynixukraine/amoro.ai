// import { FormValues } from "@/pages/video-email-generator/FormFields";
import { Grid, TextField, Tooltip, Typography } from "@mui/material";
import { memo } from "react";
import { Controller, Control, FormState, UseFormGetFieldState } from "react-hook-form";
import SquareIconButton from "./SquareIconButton";
import Remove from "@mui/icons-material/Remove";
import { grey, red } from "@mui/material/colors";

type PropType = {
  control: Control<any>;
  topicFieldLabel: string;
  topicFieldName: string;
  nameFieldLabel: string;
  nameFieldName: string;
  titleFieldLabel: string;
  titleFieldName: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  onDeleteButtonClick: Function;
  index: number;
}

const SpeakerInput = memo(function CallToActionDropdown({
  control,
  topicFieldLabel, 
  topicFieldName, 
  nameFieldLabel,
  nameFieldName,
  titleFieldLabel,
  titleFieldName,
  formState,
  getFieldState,
  onDeleteButtonClick,
  index
}: PropType ) {

  const {error: topicError} = getFieldState(topicFieldName, formState);
  const {error: nameError} = getFieldState(nameFieldName, formState);
  const {error: titleError} = getFieldState(titleFieldName, formState);

  // useEffect(() => {
  //   clearErrors(name)
  // }, [clearErrors, name]);

  return (
    <Grid  container item xs={12} sm={12} md={12} lg={12} xl={12} columnSpacing={1} mt={{xs: 4, sm: 1}}>
      {/* <Grid item xs={11} sm={12} md={12} lg={12} xl={12} sx={{marginBottom:'10px'}}>
        <Typography variant="h6">Speaker {index}</Typography>
      </Grid> */}
      <Grid  item xs={12} sm={12} md={12} lg={12} xl={12} >
        <label>{topicFieldLabel}</label>
        <Controller
          control={control}
          rules={{ required: true }}
          name={topicFieldName}
          render={({field }) => (
            <TextField
              {...field}
              margin='none'
              size="small"
              fullWidth
              defaultValue=''
              // label={topicFieldLabel}
              error={!!(topicError)}
              sx={{background: '#fff', margin:'6px 0 16px'}}
              // helperText={ctaActionError?.message}
              placeholder={topicFieldLabel}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <label>{nameFieldLabel}</label>
        <Controller
          control={control}
          rules={{ required: true }}
          name={nameFieldName}
          render={({field }) => (
            <TextField
              {...field}
              margin='none'
              fullWidth
              size="small"
              defaultValue=''
              sx={{background: '#fff', margin:'6px 0 16px'}}
              // label={nameFieldLabel}
              error={!!(nameError)}
              // helperText={ctaActionError?.message}
              placeholder={nameFieldLabel}
            />
          )}
        />
      </Grid>

      <Grid item xs={index == 1 ? 12 : 11} sm={index == 1 ? 12 : 11} md={index == 1 ? 12 : 11} lg={index == 1 ? 12 : 11} xl={index == 1 ? 12 : 11}>
        <label>{titleFieldLabel}</label>
        <Controller
          control={control}
          rules={{ required: true}}
          name={titleFieldName}
          render={({field }) => (
            <TextField
              {...field}
              margin='none'
              size="small"
              fullWidth
              sx={{background: '#fff', margin:'6px 0 16px', borderRadius:'8px'  }}
              defaultValue=''
              // label={titleFieldLabel}
              error={!!(titleError)}
              // helperText={ctaActionError?.message}
              placeholder={titleFieldLabel}
            />
          )}
        />  
      </Grid> 
      {index > 1 ? <Grid item xs={1} sm={1} md={1} lg={1} xl={1} alignSelf="center" textAlign="center">
          <SquareIconButton type="button" onClick={() => onDeleteButtonClick()} sx={{backgroundColor: grey[200], color: red[400], ':hover': {backgroundColor: red[300], color: 'white'} }}>
            <Tooltip title="Remove CTA">
                <Remove fontSize='small' />
            </Tooltip>
          </SquareIconButton>
      </Grid> : null}
    </Grid>
  )
});
export default SpeakerInput;