import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import classes from '@/components/AdminDashboard.module.css';
import { Button } from '@mui/material';
import AdminLayout from '@/components/layouts/DesktopAdminLayout';
import { QuotationType } from '@/common/types';
import countries from '@/lib/countries';
import { convertArrayOfObjectsToCsv } from '@/utils';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useRouter } from 'next/router';
import DatePicker from '@/components/DatePicker';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';

const ChartIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_55_59179)">
      <path
        d="M1.17647 12.2222C0.525882 12.2222 0 12.72 0 13.3333V18.8889C0 19.5022 0.525882 20 1.17647 20C1.82706 20 2.35294 19.5022 2.35294 18.8889V13.3333C2.35294 12.72 1.82706 12.2222 1.17647 12.2222Z"
        fill="#9CA3AF"
      />
      <path
        d="M7.05882 7.77772C6.40824 7.77772 5.88235 8.2755 5.88235 8.88883V18.8889C5.88235 19.5022 6.40824 20 7.05882 20C7.70941 20 8.23529 19.5022 8.23529 18.8889V8.88883C8.23529 8.2755 7.70941 7.77772 7.05882 7.77772Z"
        fill="#9CA3AF"
      />
      <path
        d="M12.9412 12.2222C12.2906 12.2222 11.7647 12.72 11.7647 13.3333V18.8889C11.7647 19.5022 12.2906 20 12.9412 20C13.5918 20 14.1176 19.5022 14.1176 18.8889V13.3333C14.1176 12.72 13.5918 12.2222 12.9412 12.2222Z"
        fill="#9CA3AF"
      />
      <path
        d="M18.8235 7.77772C18.1729 7.77772 17.6471 8.2755 17.6471 8.88883V18.8889C17.6471 19.5022 18.1729 20 18.8235 20C19.4741 20 20 19.5022 20 18.8889V8.88883C20 8.2755 19.4741 7.77772 18.8235 7.77772Z"
        fill="#9CA3AF"
      />
      <path
        d="M1.17529 8.88883C1.51294 8.88883 1.84706 8.75217 2.08118 8.48883L7.05882 2.84658L12.0365 8.48883C12.4847 8.9955 13.3965 8.9955 13.8447 8.48883L19.7271 1.82213C20.1435 1.35102 20.0753 0.649902 19.5765 0.257678C19.0753 -0.135657 18.3353 -0.0712126 17.9188 0.399901L12.9412 6.04215L7.96353 0.399901C7.51529 -0.106768 6.60353 -0.106768 6.15529 0.399901L0.272941 7.0666C-0.143529 7.53771 -0.0752943 8.23883 0.423529 8.63105C0.643529 8.80439 0.909412 8.88883 1.17529 8.88883Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_55_59179">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function RevenueAdminPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [check, setCheck] = useState(true);
  const router = useRouter();
  const { start, end } = router.query;
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [revenues, setRevenue] = useState<any>();
  const [user, setUser] = useState<any>();

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
  const hanldeGetData = async () => {
    if (start && end) {
      await axios(`/api/admin/revenues?start=${start}&end=${end}`)
        .then((res) => {
          setRevenue(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios('/api/admin/revenues')
        .then((res) => {
          setRevenue(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
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

  const hanldeSelectTime = () => {
    router.push(`/admin/revenues/?start=${startDate}&end=${endDate}`);
  };
  useEffect(() => {
    if (endDate && startDate) {
      hanldeSelectTime();
    }
  }, [startDate, endDate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const handleQuotationsToExcel = () => {
    const data = revenues?.quotations.map((quotation: any) => ({
      NO: quotation.id,
      'DATE EXPORTS': quotation.createdAt.substring(0, 10),
      'TIME EXPORTS': quotation.createdAt.substring(11, 19),
      'NAME OF USER': `${quotation.User.firstName} ${quotation.User.lastName}`,
      COMPANY: quotation.User.companyName,
      COUNTRY: countries.find((c) => c.code === quotation.User.country)?.label,
      'THERAPY AREA': quotation.User.therapyArea,
    }));

    convertArrayOfObjectsToCsv(data);
  };

  const handleBalancesToExcel = () => {
    const data = [
      {
        'TODAY REVENUE': revenues?.revenueDay,
        MTD: revenues?.revenueMonth,
        YTD: revenues?.revenueYear,
        'TOTAL QUOTATIONS AMOUNT': revenues?.quotationsRevenue,
        'TOTAL NUMBER OF QUOTATIONS GENERATED': revenues?.quotationsGenerated,
      },
    ];

    convertArrayOfObjectsToCsv(data);
  };
  const years = [2023, 2022, 2021, 2020, 2019];

  function YearSelect() {
    const [selectedYear, setSelectedYear] = useState('');
    const [show, setShow] = useState<boolean>(true);

    const handleChange = (event: any) => {
      setSelectedYear(event.target.value);
      setShow(false);
      // router.replace(`/admin?${event.target.value}`, undefined, { shallow: true });
      router.push(`/admin/revenues?year=${event.target.value}`);
      // window.location.reload()
    };
    return (
      <FormControl variant="outlined" className={classes.select_box}>
        {show && (
          <InputLabel id="year-select-label" shrink={false}>
            <img
              style={{ width: '15px', marginRight: '10px' }}
              src="/img/iconperiod.svg"
            ></img>{' '}
            Select period
          </InputLabel>
        )}

        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYear}
          onChange={handleChange}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  return (
    <AdminLayout>
      <div className={classes.mainContainer}>
        <div className={classes.spacedItemsContainer}>
          <p className={classes.pageTitle}>Revenue & Billing</p>

          <div className={classes.contanerSelect}>
            {/* <YearSelect /> */}
            <DatePicker setEndDate={setEndDate} setStartDate={setStartDate} />
            <Button
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={handleBalancesToExcel}
            >
              Export in Excel
            </Button>
          </div>
        </div>
        <div className={classes.cardContainer}>
          <div className={classes.card}>
            <div>
              <div>{ChartIcon}</div>
              <div className={classes.cardReven}>
                <h2>Today revenue</h2>
                <p>{USDollar.format(Math.floor(revenues?.revenueDay))}</p>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div>
              <div>{ChartIcon}</div>
              <div className={classes.cardReven}>
                <h2>MTD</h2>
                <p>{USDollar.format(Math.floor(revenues?.revenueMonth))}</p>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div>
              <div>{ChartIcon}</div>
              <div className={classes.cardReven}>
                <h2>YTD</h2>
                <p>{USDollar.format(Math.floor(revenues?.revenueYear))}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.spacedItemsContainer}>
          <p className={classes.pageTitle}>Summary of package revenue</p>
          <div className={classes.cardRevenues}>
            <div className={classes.revenues}>
              <div>
                <div className={classes.cardText}>
                  <h3 className={classes.revenTitle}>Smart</h3>
                  <div>Of paying users</div>
                  <p>{revenues?.payerSmart}</p>
                  <label style={{ marginTop: 5 }}>Revenue</label>
                  <p>{USDollar.format(Math.floor(revenues?.revenueSmart))}</p>
                </div>
              </div>
            </div>
            <div className={classes.revenues}>
              <div>
                <div className={classes.cardText}>
                  <h3 className={classes.revenTitle}>Premium</h3>
                  <div>Of paying users</div>
                  <p>{revenues?.payerPremium}</p>
                  <label style={{ marginTop: 5 }}>Revenue</label>
                  <p>{USDollar.format(Math.floor(revenues?.revenuePremium))}</p>
                </div>
              </div>
            </div>
            <div className={classes.revenues}>
              <div>
                <div className={classes.cardText}>
                  <h3 className={classes.revenTitle}>Free trial</h3>
                  <div>Of paying users</div>
                  <p>{revenues?.payerFree}</p>
                  <label style={{ marginTop: 5 }}>Revenue</label>
                  <p>-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
    return redirectObject;

  return {
    props: { user: [] },
  };
};
