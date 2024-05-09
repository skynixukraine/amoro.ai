import React from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

interface SquareIconButtonProps extends IconButtonProps {
  children: React.ReactNode;
}

const SquareIconButton: React.FC<SquareIconButtonProps> = ({
  children,
  ...props
}) => (
  <IconButton size="small" {...props}>
    {children}
  </IconButton>
);

export default SquareIconButton;
