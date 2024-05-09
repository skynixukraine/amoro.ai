import AdminLayout from '@/components/layouts/DesktopAdminLayout';
import { convertArrayOfObjectsToCsv } from '@/utils';
import {
  Button,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const dotsIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 13C19.1046 13 20 11.8807 20 10.5C20 9.11929 19.1046 8 18 8C16.8954 8 16 9.11929 16 10.5C16 11.8807 16.8954 13 18 13Z"
      fill="#6B7280"
    />
    <path
      d="M10 13C11.1046 13 12 11.8807 12 10.5C12 9.11929 11.1046 8 10 8C8.89543 8 8 9.11929 8 10.5C8 11.8807 8.89543 13 10 13Z"
      fill="#6B7280"
    />
    <path
      d="M2 13C3.10457 13 4 11.8807 4 10.5C4 9.11929 3.10457 8 2 8C0.895431 8 0 9.11929 0 10.5C0 11.8807 0.895431 13 2 13Z"
      fill="#6B7280"
    />
  </svg>
);

export default function AccessAdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any>();
  useEffect(() => {
    if (session) {
      hanldeGetData();
    }
  }, [session]);

  const hanldeGetData = async () => {
    await axios('/api/user/all')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleExportExcel = () => {
    const data = users?.map((user: any) => ({
      NO: user.id,
      NAME: `${user.firstName} ${user.lastName}`,
      EMAIL: user.email,
      PASSWORD: user.password,
      ROLE: user.role,
    }));

    convertArrayOfObjectsToCsv(data);
  };

  return (
    <AdminLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: '#111928',
              fontFamily: 'Inter',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: 'normal',
            }}
          >
            Admin Access
          </p>
          <div style={{ display: 'flex' }}>
            <Button
              variant="outlined"
              sx={{ textTransform: 'none', marginRight: '16px' }}
              onClick={() => router.push('/admin/access/new')}
            >
              New Access
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={handleExportExcel}
            >
              Export in Excel
            </Button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>PASSWORD</TableCell>
                <TableCell>ROLE</TableCell>
                <TableCell>CONFIGURE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {`${user.firstName} ${user.lastName}`}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>********</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Link href={`/admin/access/${user.id}`}>
                      <IconButton>{dotsIcon}</IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  const redirectObject = {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };

  if (!session) return redirectObject;
  const userData = await axios.get(
    `/api/user/get-by-email?email=${session.user?.email}`
  );

  const user: any = userData.data;

  if (!['MainOwner'].includes(user?.role) && !['Owner'].includes(user?.role))
    return redirectObject;

  return {
    props: {
      users: user,
    },
  };
};
