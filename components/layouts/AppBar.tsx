import { useSession } from 'next-auth/react';
import React from 'react';
import AppBarNotLoggedInComponent from './AppBarNotLoggedIn';
import AppBarLoggedInComponent from './AppBarLoggedIn';
import { useRouter } from 'next/router';

export default function AppBar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (router.pathname.split('/')[1] === 'admin') return <></>;
  if (status === 'authenticated') return <AppBarLoggedInComponent />;
  return <AppBarNotLoggedInComponent />;
}
