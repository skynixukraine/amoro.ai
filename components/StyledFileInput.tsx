import React, { useRef } from 'react';
import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import classes from './StyledFileInput.module.css';

const UploadFileIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.207 5.23769L11.207 1.13529C11.1141 1.03978 11.0038 0.964005 10.8823 0.912302C10.7608 0.860598 10.6305 0.833984 10.499 0.833984C10.3675 0.833984 10.2372 0.860598 10.1157 0.912302C9.99424 0.964005 9.88389 1.03978 9.791 1.13529L5.791 5.23769C5.60349 5.43027 5.49826 5.69136 5.49844 5.96351C5.49863 6.23567 5.60423 6.49661 5.792 6.68891C5.97977 6.88122 6.23434 6.98915 6.49971 6.98896C6.76507 6.98877 7.01949 6.88047 7.207 6.68789L9.5 4.33619V13.142C9.5 13.414 9.60536 13.6749 9.79289 13.8672C9.98043 14.0595 10.2348 14.1676 10.5 14.1676C10.7652 14.1676 11.0196 14.0595 11.2071 13.8672C11.3946 13.6749 11.5 13.414 11.5 13.142V4.33619L13.793 6.68789C13.9816 6.87471 14.2342 6.97808 14.4964 6.97575C14.7586 6.97341 15.0094 6.86555 15.1948 6.6754C15.3802 6.48524 15.4854 6.22801 15.4877 5.9591C15.49 5.69019 15.3892 5.43112 15.207 5.23769Z"
      fill="#9CA3AF"
    />
    <path
      d="M18.5 12.6292H13.5V13.142C13.5 13.958 13.1839 14.7406 12.6213 15.3176C12.0587 15.8946 11.2956 16.2188 10.5 16.2188C9.70435 16.2188 8.94129 15.8946 8.37868 15.3176C7.81607 14.7406 7.5 13.958 7.5 13.142V12.6292H2.5C1.96957 12.6292 1.46086 12.8453 1.08579 13.23C0.710714 13.6146 0.5 14.1364 0.5 14.6804V18.7828C0.5 19.3268 0.710714 19.8485 1.08579 20.2332C1.46086 20.6179 1.96957 20.834 2.5 20.834H18.5C19.0304 20.834 19.5391 20.6179 19.9142 20.2332C20.2893 19.8485 20.5 19.3268 20.5 18.7828V14.6804C20.5 14.1364 20.2893 13.6146 19.9142 13.23C19.5391 12.8453 19.0304 12.6292 18.5 12.6292ZM16 18.7828C15.7033 18.7828 15.4133 18.6926 15.1666 18.5235C14.92 18.3545 14.7277 18.1142 14.6142 17.8331C14.5007 17.552 14.4709 17.2427 14.5288 16.9443C14.5867 16.6458 14.7296 16.3717 14.9393 16.1566C15.1491 15.9414 15.4164 15.7949 15.7074 15.7355C15.9983 15.6762 16.2999 15.7067 16.574 15.8231C16.8481 15.9395 17.0824 16.1367 17.2472 16.3897C17.412 16.6427 17.5 16.9401 17.5 17.2444C17.5 17.6524 17.342 18.0437 17.0607 18.3322C16.7794 18.6207 16.3978 18.7828 16 18.7828Z"
      fill="#9CA3AF"
    />
  </svg>
);

const StyledFileInput: React.FC<{
  handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
  handleDropFileChange?: React.DragEventHandler<HTMLInputElement>;
}> = ({ handleFileChange, handleDropFileChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragging(false);
    if (handleDropFileChange) {
      handleDropFileChange(event);
    }
  };

  return (
    <div
      className={`${classes.container} ${dragging ? classes.borderGreen : classes.borderGray
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <UploadFileIcon />
      <p>Click to upload or drag and drop</p>
      <p>Max. File Size: 30MB</p>
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        sx={{ textTransform: 'none' }}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Browse Files
      </Button>
    </div>
  );
};

export default StyledFileInput;
