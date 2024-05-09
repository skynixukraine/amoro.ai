import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import AppBarNotLoggedInComponent from '@/components/layouts/AppBarNotLoggedIn';
import '@/styles/global.css';
import { SessionProvider } from 'next-auth/react';
import AppBar from '@/components/layouts/AppBar';
import { useRouter } from 'next/router';
import Footer from '@/components/layouts/Footer';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f6937',
      light: '#e3f1e3',
    },
    secondary: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFEB3B',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          // borderRadius: 8,
        },
      },
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  return (
    <SessionProvider session={session} refetchInterval={60 * 60}>
      <ThemeProvider theme={theme}>
        {router.pathname != '/reset-password/[resetToken]' &&
          router.pathname != '/user-verify/[verificationToken]' && <AppBar />}
        <Component {...pageProps} />
        {router.pathname != '/reset-password/[resetToken]' &&
          router.pathname != '/user-verify/[verificationToken]' && <Footer />}
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
