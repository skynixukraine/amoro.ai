import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';

const ProgressBar: React.FC<{
    message: string;
    open: boolean;
    handleClose: () => void;
    isprogress?: boolean;
}> = ({ message, open, handleClose, isprogress }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        zIndex: 99,
        backgroundColor: 'white',
        display: 'flex',
        transition: 'all ease-in-out 0.6s',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        padding: '15px 20px',
        borderRadius: '4px',
        borderLeft: '8px solid #008744 '
    };
    const styles = {
        position: 'absolute',
        width: '170px',
        height: '40px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        zIndex: 99,
        backgroundColor: 'white',
        display: 'flex',
        transition: 'all ease-in-out 0.6s',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        padding: '15px 20px',
        borderRadius: '4px',
        borderLeft: '8px solid #008744 '
    };
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0)
    }, [])
    useEffect(() => {
        function increaseProgress() {
            if (progress < 100) {
                setProgress((prevProgress) => prevProgress + 5);
            }
        }
        const timer = setTimeout(increaseProgress, 1000);
        return () => clearTimeout(timer);
    }, [progress]);
    return (<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        {isprogress && progress !== 100 ?
            <Box sx={styles}>
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: 'rgb(26, 144, 255)',
                        borderRadius: '5px',
                        color: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    {progress}%
                </div>
            </Box> :
            isprogress ?
                <Box sx={styles}>
                    <CircularProgress thickness={6} size={24} color='success' />
                    <div style={{ fontSize: 18, fontWeight: '600' }}>{message}</div>
                </Box> :
                <Box sx={style}>
                    <CircularProgress thickness={6} size={24} color='success' />
                    <div style={{ fontSize: 18, fontWeight: '600' }}>{message}</div>
                </Box>

        }
    </Modal>
    )
}

export default ProgressBar;