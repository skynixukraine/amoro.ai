import { useSession } from 'next-auth/react';
import classes from '@/components/Homepage.module.css';
import Link from 'next/link';
import { Box, Modal, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';
// import TermsofUseComponent from '../login/TermsofUseComponent';
import PrivacyComponent from '../login/PrivacyComponent';
import { useRouter } from 'next/router';
import useWindowSize from '@/hooks/useWindowSize';

export default function Footer() {
  const router = useRouter();
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const sizes = useWindowSize();
  const isDesktop = sizes.width && sizes.width >= 900;
  const { data: session, status } = useSession();
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1024,
    bgcolor: '#fff',
    boxShadow: 24,
    p: 4,
    borderRadius: '24px',
    height: '80vh',
    // overflowY: 'auto',
  };
  if (router.pathname.split('/')[1] === 'admin') return <></>;
  const TermsofUseModal = () => (
    <>
      <Modal
        open={openPrivacyModal}
        onClose={() => setOpenPrivacyModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PrivacyComponent setOpenPrivacyModal={setOpenPrivacyModal} />
        </Box>
      </Modal>
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.content_container}>
        <div className={classes.CTA}>
          <div className={classes.footer}>
            <div className={classes.footerRow}>
              <p style={{ fontSize: '1rem', fontWeight: 500, color: '#000' }}>
                SINGAPORE
              </p>
            </div>
            <div className={classes.footerRow}>
              <span> APAC Headquarters</span>
            </div>
            <div
              className={classes.footerRow}
              style={{ justifyContent: 'space-between' }}
            >
              <p>205 Balestier Road #02-06 The Mezzo Singapore 329682</p>
              <Link
                href="https://www.linkedin.com/company/95053578/admin/feed/posts/"
                target="_blank"
              >
                <img
                  className={classes.linkedInLogoDesktop}
                  src="/homepage/linkedin.svg"
                  alt="LinkedIn logo"
                />
              </Link>
            </div>
            <div className={classes.footerRow} style={{ alignItems: 'center' }}>
              <img src="/homepage/mailbox.svg" alt="LinkedIn logo" />
              <a href="mailto:contactreiainow@gmail.com">hello@amoro.ai</a>
            </div>
            <div style={{ width: '100%' }}>
              <img
                className={classes.linkedInLogoMobile}
                src="/homepage/linkedin.svg"
                alt="LinkedIn logo"
              />
            </div>
            <div className={classes.hr}></div>
            <div className={classes.footerCopyright}>
              <img src="/amoro-logo.png" alt="logo" />
              <p>
                <Link
                  onClick={() => setOpenPrivacyModal(true)}
                  href={isDesktop ? '#' : '/privacy-policy'}
                >
                  <span
                    style={{
                      color: '#0f6937',
                      paddingRight: '10px',
                      textDecoration: 'underline',
                    }}
                  >
                    Privacy Policy
                  </span>
                </Link>
                © 2023 amoro.ai, Inc. All rights reserved.
              </p>
            </div>
            <TermsofUseModal />
          </div>
        </div>
      </div>
    </div>
  );
}
