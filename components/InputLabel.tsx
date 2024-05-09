import React from "react";
import Typography from "@mui/material/Typography";

interface InputLabelProps {
  children: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ children }) => (
  <Typography variant="caption" color="text.secondary">
    {children}
  </Typography>
);

export default InputLabel;
