import React, { useEffect, useState } from 'react';
import { styledInputPropsSx } from '@/components/StyledInput';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import { Box, Button, Grid, Link, TextField } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from '@/components/login/SignupComponent.module.css';
// import axios from 'axios';
import { QuotationType } from '@/common/types';
import moment from 'moment-timezone';

const ArrowBack = () => (
  <svg
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.7144 14.1276H7.80479L13.0456 8.62547C13.2639 8.40412 13.4381 8.13934 13.5578 7.84659C13.6776 7.55384 13.7407 7.23898 13.7433 6.92037C13.746 6.60176 13.6881 6.2858 13.5732 5.9909C13.4583 5.69601 13.2886 5.4281 13.074 5.2028C12.8594 4.97751 12.6042 4.79933 12.3233 4.67868C12.0424 4.55803 11.7414 4.49732 11.438 4.50009C11.1345 4.50286 10.8346 4.56905 10.5557 4.69481C10.2769 4.82057 10.0247 5.00337 9.81382 5.23255L0.671478 14.8306C0.458629 15.0535 0.289756 15.3183 0.174533 15.6098C0.0593103 15.9013 0 16.2139 0 16.5295C0 16.8451 0.0593103 17.1576 0.174533 17.4491C0.289756 17.7407 0.458629 18.0055 0.671478 18.2283L9.81382 27.8264C10.2449 28.2635 10.8222 28.5054 11.4215 28.4999C12.0208 28.4944 12.594 28.2421 13.0178 27.7972C13.4416 27.3523 13.6819 26.7505 13.6871 26.1213C13.6923 25.4922 13.462 24.8861 13.0456 24.4335L7.80479 18.9266H29.7144C30.3206 18.9266 30.9019 18.6738 31.3306 18.2238C31.7592 17.7738 32 17.1635 32 16.5271C32 15.8907 31.7592 15.2804 31.3306 14.8304C30.9019 14.3804 30.3206 14.1276 29.7144 14.1276Z"
      fill="#111928"
    />
  </svg>
);

export default function QuotationDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>();
  const [quotation, setQuotation] = useState<QuotationType>();
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
      hanldeGetData();
    } else {
      // router.push('/');
    }
  }, [session]);
  useEffect(() => {
    if (user) {
      if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role)) {
        router.push('/admin/login');
      }
    }
  }, [user]);
  const hanldeGetUser = async (email: any) => {
    await axios
      .get(`/api/user/get-by-email?email=${email}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeGetData = async () => {
    await axios(`/api/quotation/${id}`)
      .then((res) => {
        setQuotation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const paidDateFromProps = quotation?.paidDate
    ? moment(quotation?.paidDate)
        .tz('Asia/Singapore')
        .subtract(1, 'day')
        .toDate()
    : null;

  const [paidDate, setPaidDate] = React.useState<Date | null>(
    paidDateFromProps
  );

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/quotation/${quotation?.id}`, {
        paidDate: moment(paidDate).tz('Asia/Singapore').add(1, 'day').toDate(),
      });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <DesktopAdminLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '10vh',
        }}
      >
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              marginBottom: '16px',
            }}
            href="/admin/quotations"
          >
            <>
              <ArrowBack />
              <span
                style={{
                  marginLeft: '12px',
                  color: '#111928',
                  fontFamily: 'Inter',
                  fontSize: '32px',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: 'normal',
                }}
              >
                Quotation Detail
              </span>
            </>
          </Link>
        </div>
        <Box
          sx={{
            width: '100%',
            padding: '24px 16px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #F9FAFB',
            background: '#FFF',
            boxShadow:
              '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.10)',
          }}
        >
          <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} md={6}>
              <label>Paid Date</label>
              <TextField
                type="date"
                InputProps={{ sx: styledInputPropsSx }}
                fullWidth
                value={
                  paidDate
                    ? moment(paidDate).tz('Asia/Singapore').format('YYYY-MM-DD')
                    : ''
                }
                onChange={(e) => {
                  setPaidDate(
                    moment(e.target.value).tz('Asia/Singapore').toDate()
                  );
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                onClick={() => setPaidDate(null)}
              >
                Remove paid date
              </Button>
            </Grid>
          </Grid>
        </Box>

        <div
          style={{
            marginTop: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            sx={{ textTransform: 'none', width: '90px' }}
            onClick={handleSaveChanges}
          >
            Save
          </Button>
        </div>
      </Box>
    </DesktopAdminLayout>
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
  if (!['MainOwner', 'Owner', 'Admin'].includes(user?.role))
    return redirectObject;

  return {
    props: { user },
  };
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   // @ts-expect-error
//   const session = await getServerSession(context.req, context.res);

//   const redirectObject = {
//     redirect: {
//       destination: '/admin/login',
//       permanent: false,
//     },
//   };

//   if (!session) return redirectObject;

//   const userData = await axios.get(
//     `/api/user/get-by-email?email=${session.user?.email}`
//   );
//   const user: any = userData.data;
//   if (!['MainOwner', 'Owner', 'Admin'].includes(user?.role))
//     return redirectObject;
//   const quotationData = await axios.get(`/api/quotation/${context.query.id}`);

//   const quotation = quotationData.data;

//   return {
//     props: {
//       quotation: quotation,
//     },
//   };
// };
