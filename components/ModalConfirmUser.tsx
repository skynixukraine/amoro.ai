import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    maxWidth: '80vw',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
};

interface ModalTryForFreeProps {
    open: number | undefined;
    setOpen: React.Dispatch<React.SetStateAction<number | undefined>>;
    deleteDraft: (id: number) => void;
    text?: string
}

const ModalConfirmUser: React.FC<ModalTryForFreeProps> = ({
    open,
    setOpen,
    deleteDraft,
    text
}
) => {
    const handleClose = () => setOpen(undefined);

    return (
        <div>
            <Modal
                open={open !== undefined}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ textAlign: 'end', color: '#6B7280', cursor: 'pointer' }} onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </div>
                    <h3 className='confirmTitle'>Delete {text === 'Pricing' ? 'Pricing' : 'user'}?</h3>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        textAlign={'center'}
                        marginBottom={"20px"}
                        color={'#6B7280'}
                        fontSize={'16px'}
                    >
                        Are you sure you want to delete this {text === 'Pricing' ? 'Pricing' : 'user'} from Amoro.AI?
                    </Typography>
                    <div
                        style={{ paddingBottom: '30px' }}
                    >
                        <div
                            style={{
                                background: '#FFF8F1',
                                color: '#8A2C0D',
                                borderRadius: '6px',
                                padding: '12px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    gap: '4px',
                                    marginBottom: '10px',
                                }}
                            >
                                <InfoRoundedIcon fontSize="small" />
                                <div>Warning</div>
                            </div>
                            <div style={{ fontSize: '14px', lineHeight: '21px' }}>
                                By deleting this {text === 'Pricing' ? 'Pricing' : 'user'} you cannot undo this action
                            </div>
                        </div>
                    </div>
                    <div className='confirmUserButton' >
                        <Button
                            variant="outlined"
                            sx={{ textTransform: 'none', color: 'black', border: '#F9FAFB 1px solid' }}
                            fullWidth
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" sx={{ textTransform: 'none' }} fullWidth
                            onClick={() => open && deleteDraft(open)}>
                            <DeleteIcon fontSize="small" />
                            Delete
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalConfirmUser;
