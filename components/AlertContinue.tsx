import { Modal, Box, Button, Checkbox } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import classes from './AlertContinue.module.css';
import { useState, useEffect } from 'react';
const AlertContinue: React.FC<{
    open: boolean;
    handleStay: () => void;
    handleContinue: () => void;
    isStandard?: boolean;
    isVideo?: boolean;
    isEvent?: boolean;
}> = ({ open, handleStay, handleContinue, isStandard, isVideo, isEvent }) => {
    const [checked, setChecked] = useState(false);


    const handleCheckboxChange = (event: any) => {
        setChecked(event.target.checked);
    };
    const hanldeShowPopUp = () => {
        if (checked && isStandard) {
            localStorage.setItem('standard', 'continue')
        }
        if (checked && isVideo) {
            localStorage.setItem('video', 'continue')
        }
        if (checked && isEvent) {
            localStorage.setItem('event', 'continue')
        }
    }
    return (<Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box className={classes.alertbox}>
            <button className={classes.closebtn} onClick={() => handleStay()}><CloseOutlined /></button>
            <div className={classes.textbox}>Are you sure you want to continue? Have  you  checked  the  details  in  the
                unsubscribe,  privacy  policy  fields,  citations,
                references?
            </div>
            <div style={{ gap: '10px', textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end' }}>
                <Button type='submit' variant="contained" color="success" onClick={() => { handleContinue(); hanldeShowPopUp() }}>Yes, continue</Button>
                <Button variant="outlined" color="error" onClick={handleStay}>No, stay on page</Button>
            </div>
            <div style={{ gap: '10px', textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'end', paddingTop: '20px' }}>
                <Checkbox
                    checked={checked}
                    onChange={handleCheckboxChange}
                    color="primary"
                />
                Do not show this message again
            </div>
        </Box>

    </Modal>
    )
}

export default AlertContinue;