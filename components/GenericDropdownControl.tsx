// import { FormValues } from "@/pages/video-email-generator/FormFields";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { memo } from "react";
import { Controller, Control, FormState, UseFormGetFieldState } from "react-hook-form";

type PropType = {
  control: Control<any>;
  name: string;
  label: string;
  formState: FormState<any>;
  getFieldState: UseFormGetFieldState<any>;
  menuItems: Array<{value: string, label:string}>;
}

const GenericDropdownControl = memo(function GenericDropdownControl({
  control,
  name, 
  label,
  formState,
  getFieldState,
  menuItems
}: PropType ) {
  
;
  // const {error} = getFieldState(name, formState);

  // useEffect(() => {
  //   clearErrors(name)
  // }, [clearErrors, name]);

  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
        <label style={{fontSize:'14px'}}>{label}</label>
        <Controller
          control={control}
          name={name}
          render={({field }) => (
            <FormControl {...field} fullWidth  style={{margin:'10px 0'}}>
              {/* <InputLabel id={`${name}-label`}>{label}</InputLabel> */}
              <Select    
                labelId={`${name}-label`}
                id={`${name}-select`}
                // label={label}
                {...field}
              >
                {menuItems.map(({label, value}, index) =>  <MenuItem key={index} value={value}>{label}</MenuItem>)}
              </Select>
            </FormControl>
          )}
        />
      </Grid>
    </> 
  )
});
export default GenericDropdownControl;