import React, { useEffect } from 'react';

import classes from './AppBar.module.css';

import {
  AppBar,
  Toolbar,
  Hidden,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import useWindowSize from '@/hooks/useWindowSize';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import StyledInput from '../StyledInput';
import Popup from '../PopupContact';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';

const AppBarLinks = () => {
  const router = useRouter();
  const id = router.query.userId;
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Link
        className={classes.link}
        href={`${id ? `/home?userId=${id}` : '/home'}`}
      >
        Home
      </Link>
      <Link
        className={classes.link}
        href={`${id ? `/pricing?userId=${id}` : '/pricing'}`}
      >
        Pricing
      </Link>
      <Link
        className={classes.link}
        href={`${id ? `/my-account?userId=${id}` : '/my-account'}`}
      >
        My Account
      </Link>
      <Link
        className={classes.link}
        href={`${id ? `/blog?userId=${id}` : '/blog'}`}
      >
        Blog
      </Link>
      <span className={classes.contact} onClick={handleOpen}>
        Contact Us
      </span>
      <Popup open={open} onClose={handleClose} />
      <Link
        className={classes.link}
        href="#"
        onClick={() => {
          signOut();
          // Cookies.remove('lastLogin');
          // router.push('/');
        }}
      >
        Log Out
      </Link>
    </React.Fragment>
  );
};

const BellIcon = (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_43_3619)">
      <path
        d="M16.1106 11.9197V10.0249C16.1113 8.74437 15.6236 7.50099 14.7262 6.49587C13.8288 5.49075 12.5742 4.78265 11.1653 4.48608C11.176 4.44934 11.1844 4.41208 11.1903 4.3745V1.88611C11.1903 1.60694 11.0649 1.3392 10.8416 1.1418C10.6184 0.944397 10.3156 0.833496 9.99984 0.833496C9.6841 0.833496 9.3813 0.944397 9.15804 1.1418C8.93479 1.3392 8.80936 1.60694 8.80936 1.88611V4.3745C8.81528 4.41208 8.82363 4.44934 8.83436 4.48608C7.42545 4.78265 6.17085 5.49075 5.27346 6.49587C4.37606 7.50099 3.88833 8.74437 3.88912 10.0249V11.9197C3.88912 14.4312 1.6665 15.0586 1.6665 16.3143C1.6665 16.9385 1.6665 17.5701 2.30698 17.5701H17.6927C18.3332 17.5701 18.3332 16.9385 18.3332 16.3143C18.3332 15.0586 16.1106 14.4312 16.1106 11.9197Z"
        fill="#6B7280"
      />
      <path
        d="M6.21769 18.6227C6.5335 19.2785 7.06042 19.8378 7.73289 20.2308C8.40536 20.6239 9.1937 20.8335 9.99984 20.8335C10.806 20.8335 11.5943 20.6239 12.2668 20.2308C12.9393 19.8378 13.4662 19.2785 13.782 18.6227H6.21769Z"
        fill="#6B7280"
      />
    </g>
    <defs>
      <clipPath id="clip0_43_3619">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.833496)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default function AppBarLoggedInComponent() {
  const sizes = useWindowSize();
  const router = useRouter();
  const id = router.query.userId;

  const handleNavigate = (e: SelectChangeEvent<string>) => {
    if (e.target.value === 'logout') {
      // Cookies.remove('lastLogin');
      router.push('/');
      return signOut();
    }
    router.push(e.target.value);
  };

  return (
    <div>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          px: sizes.width && sizes.width < 768 ? '16px' : '20px',
        }}
      >
        <div className={classes.container_header}>
          <Toolbar className={classes.toolbar}>
            <Link href={`${id ? `/home?userId=${id}` : '/home'}`}>
              <Image src="/amoro-logo.png" alt="logo" width={167} height={45} />
            </Link>
            <Hidden mdUp>{BellIcon}</Hidden>
            <Hidden mdDown>
              <div style={{ flexGrow: 1 }}>
                <AppBarLinks />
              </div>
              {BellIcon}
            </Hidden>
          </Toolbar>
        </div>

        {[
          `${id ? `/home?userId=${id}` : '/home'}`,
          `${id ? `/my-account?userId=${id}` : '/my-account'}`,
          `${id ? `/pricing?userId=${id}` : '/pricing'}`,
          `${id ? `/blog?userId=${id}` : '/blog'}`,
          `${id ? `/contact?userId=${id}` : '/contact'}`,
          '/export-quotation',
          '/quotation/[id]',
          '/request-work-statement',
          '/work-statement/[id]',
        ].includes(router.pathname) && (
          <Hidden mdUp>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Select
                value={
                  router.pathname === '/export-quotation' ||
                  router.pathname.includes('/quotation') ||
                  router.pathname.includes('/request-work-statement') ||
                  router.pathname.includes('/work-statement/[id]')
                    ? '/pricing'
                    : router.pathname
                }
                onChange={handleNavigate}
                variant="standard"
                input={<StyledInput />}
                fullWidth
              >
                <MenuItem value={`${id ? `/home?userId=${id}` : '/home'}`}>
                  Home
                </MenuItem>
                <MenuItem
                  value={`${id ? `/pricing?userId=${id}` : '/pricing'}`}
                >
                  Pricing
                </MenuItem>
                <MenuItem
                  value={`${id ? `/my-account?userId=${id}` : '/my-account'}`}
                >
                  My Account
                </MenuItem>
                <MenuItem value={`${id ? `/blog?userId=${id}` : '/blog'}`}>
                  Blog
                </MenuItem>
                <MenuItem
                  value={`${id ? `/contact?userId=${id}` : '/contact'}`}
                >
                  Contact Us
                </MenuItem>
                <MenuItem
                  value={`${id ? `/templates?userId=${id}` : '/templates'}`}
                >
                  Templates
                </MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
                {/* {['/pricing', '/export-quotation', '/quotation/[id]'].includes(router.pathname) ? (
                    <MenuItem value="/pricing">Pricing</MenuItem>
                  ) : (
                    <MenuItem value="/pricing">Pricing</MenuItem>
                  )} */}
              </Select>
            </div>
          </Hidden>
        )}
      </AppBar>
    </div>
  );
}
