import React from 'react';

import classes from './AppBar.module.css';

import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Hidden,
  Box,
  Modal,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';
import LoginButtonGroup from '../login/LoginButtonGroup';
import useWindowSize from '@/hooks/useWindowSize';
import Popup from '../PopupContact';
import { useState } from 'react';
interface Props {
  ismobile?: boolean;
}

const AppBarLinks: React.FC<Props> = ({ ismobile }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }
  return (
    <React.Fragment>
      <Link className={classes.link} href="#NoMoreReliance">
        About us
      </Link>
      <Link className={classes.link} href="#NoDigitalSkillsNeeded">
        How it works
      </Link>
      {ismobile ?
        <Link className={classes.link} href="/contact">
          Contact Us
        </Link> :
        <span className={classes.contact} onClick={handleOpen}>
          Contact Us
        </span>
      }
      <Popup open={open} onClose={handleClose} />
    </React.Fragment>
  );
};

const BasicModal: React.FC<{ open: boolean; handleClose: () => void }> = ({
  open,
  handleClose,
}) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: '1rem',
          }}
        >
          <div className={classes.modalContainer} onClick={handleClose}>
            <AppBarLinks ismobile />
            <LoginButtonGroup />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default function AppBarNotLoggedInComponent() {
  const sizes = useWindowSize();
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          paddingTop: '24px',
          px: sizes.width && sizes.width < 768 ? '20px' : '0px',
        }}
      >
        <div className={classes.container_header_notloggedin}>
          <Toolbar className={classes.toolbar}>
            <Link href="/">
              <Image
                src="/amoro-logo.png"
                alt="logo"
                width={167}
                height={45}
              />
            </Link>
            <Hidden mdUp>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleOpenModal}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>


            <div className={classes.centeredLinks}>
              <Hidden mdDown>
                <AppBarLinks />
              </Hidden>
            </div>
            <Hidden mdDown>
              <div>
                <LoginButtonGroup />
              </div>
            </Hidden>
          </Toolbar>
        </div>
      </AppBar>
      <BasicModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
}
