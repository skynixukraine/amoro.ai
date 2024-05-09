import React, { useEffect, useState } from 'react';
import classes from './AdminDashboard.module.css';
import { Button } from '@mui/material';

import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

import countriesData from '@/lib/countries';
import { convertArrayOfObjectsToCsv } from '@/utils';
import { CashIcon, ChartIcon, RocketIcon, UsersIcon } from './icons';
import moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useRouter } from 'next/router';
import DatePicker from './DatePicker';

type AdminDashboardProps = {
  numberOfUsers?: number;
  numberOfTrialUsers?: number;
  numberofPayingUsers?: number;
  totalInactiveUsers?: number;
  countries?: Array<{ country: string; count: string }>;
  brands?: Array<{ brand: string; count: string }>;
  therapy?: Array<{ therapyArea: string; count: string }>;
  revenues?: { revenue: number; revenueMonth: number; revenueWeek: number };
  users?: any;
  exports?: any;
};

export default function AdminDashboard(props: AdminDashboardProps) {
  const {
    numberOfUsers,
    numberOfTrialUsers,
    numberofPayingUsers,
    totalInactiveUsers,
    countries,
    brands,
    revenues,
    therapy,
    users,
    exports,
  } = props;
  const router = useRouter();

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const GetNumber = new Intl.NumberFormat(undefined, {
    style: 'decimal', // Use 'decimal' for general number formatting
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Set to 'false' to disable thousands separator
  });
  const [exportMonth, setexportMonth] = useState<any>(0);
  const [exportYear, setexportYear] = useState<any>(0);
  const [exportWeek, setexportWeek] = useState<any>(0);
  const [revenue, seterevenue] = useState<any>(0);
  const [revenueMonth, setrevenueMonth] = useState<any>(0);
  const [revenueWeek, setrevenueWeek] = useState<any>(0);

  useEffect(() => {
    if (exports) {
      setexportMonth(exports.exportMonth);
      setexportYear(exports.exportYear);
      setexportWeek(exports.exportWeek);
    }
  }, [exports]);
  useEffect(() => {
    if (revenues) {
      seterevenue(revenues.revenue);
      setrevenueMonth(revenues.revenueMonth);
      setrevenueWeek(revenues.revenueWeek);
    }
  }, [revenues]);

  // const { revenue, revenueMonth, revenueWeek }: any = revenues;
  // console.log('users', JSON.parse(users));
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const hanldeSelectTime = () => {
    router.push(`/admin/?start=${startDate}&end=${endDate}`);
  };
  useEffect(() => {
    if (endDate && startDate) {
      hanldeSelectTime();
    }
  }, [startDate, endDate]);

  const handleExportExcel = () => {
    const data = users?.map((user: any) => {
      let quotationPaid =
        user.Quotations && user.Quotations.length > 0
          ? user.Quotations.find((q: any) => q.paidDate)
          : {};
      let workStatementPaid =
        user.workStatements && user.workStatements.length > 0
          ? user.workStatements.find((q: any) => q.paidDate)
          : {};
      let paidMemberSince =
        quotationPaid?.paidDate || workStatementPaid?.paidDate;
      let nextBillingDate = moment(paidMemberSince)
        .add(1, 'month')
        .format('YYYY-MM-DD');

      let userType = 'Free Trial';
      if (
        user.stripeCustomerId ||
        quotationPaid?.paidDate ||
        workStatementPaid?.paidDate
      ) {
        userType = 'Paying';
      } else if (moment().diff(moment(user.createdAt), 'days') > 14) {
        userType = 'Inactive';
      }
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyName: user.companyName,
        brand: user.brand,
        therapyArea: user.therapyArea,
        jobTitle: user.jobTitle,
        jobFunction: user.jobFunction,
        country: user.country,
        veevaFlag: user.veevaFlag,
        stripeCustomerId: user.stripeCustomerId,
        isVerified: user.isVerified,
        paidMember: user.paidMember,
        signUpOn: user.createdAt,
        paidMemberSince,
        nextBillingDate,
        userType,
      };
    });

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
      router.push(`/admin?year=${event.target.value}`);
      // window.location.reload()
    };
    return (
      <FormControl variant="outlined" style={{ minWidth: 200 }}>
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
    <div className={classes.mainContainer}>
      <div className={classes.spacedItemsContainer}>
        <p className={classes.pageTitle}>Users</p>
        <div className={classes.contanerSelect}>
          {/* <YearSelect /> */}
          <DatePicker setEndDate={setEndDate} setStartDate={setStartDate} />
          <Button
            variant="outlined"
            sx={{ textTransform: 'none' }}
            onClick={handleExportExcel}
          >
            Export in Excel
          </Button>
        </div>
      </div>

      <div className={classes.cardFirstContainer}>
        <div className={classes.card}>
          {UsersIcon}
          <div className={classes.cardText}>
            <h2>Total</h2>
            <p>{numberOfUsers}</p>
          </div>
        </div>

        <div className={classes.card}>
          {RocketIcon}
          <div className={classes.cardText}>
            <h2>On trial</h2>
            <p>{numberOfTrialUsers}</p>
          </div>
        </div>
        <div className={classes.card}>
          {CashIcon}
          <div className={classes.cardText}>
            <h2>Paying users</h2>
            <p>{numberofPayingUsers}</p>
          </div>
        </div>
        <div className={classes.card}>
          {UsersIcon}
          <div className={classes.cardText}>
            <h2>Total inactive users</h2>
            <p>{totalInactiveUsers}</p>
          </div>
        </div>
      </div>
      <div className={classes.spacedItemsContainer}>
        <p className={classes.pageTitle}>Insights</p>
      </div>
      <div className={classes.cardContainer}>
        <div className={classes.countriesCard}>
          <h3>Top 5 countries</h3>
          {countries?.map((c) => {
            const countryData = countriesData.find(
              (_c) => _c.code === c.country
            );
            if (!countryData) return <></>;
            return (
              <div className={classes.country} key={c.country}>
                <img
                  src={`https://flagcdn.com/w80/${countryData.code.toLowerCase()}.png`}
                  alt={`${countryData.label} flag`}
                />
                <span>{countryData.label}</span>
                <p>{c.count} User</p>
              </div>
            );
          })}
        </div>
        <div className={classes.card} style={{ display: 'block' }}>
          <div className={classes.cardText}>
            <h2>Top 3 Therapy Area</h2>
            <div className={classes.therapyAreaContainer}>
              {therapy?.map((t) => (
                <div key={t.therapyArea} className={classes.therapyArea}>
                  <h3>{t.therapyArea}</h3>
                  <h4>{t.count}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.card} style={{ display: 'block' }}>
          <div className={classes.cardText}>
            <h2>Number of Brands</h2>
          </div>
          {brands && brands.length > 0 && (
            <ReactApexChart
              series={brands?.map((brand) => parseInt(brand.count))}
              type="donut"
              options={{
                chart: {
                  type: 'donut',
                },
                labels: brands?.map((brand) => brand.brand),
                plotOptions: {
                  pie: {
                    donut: {
                      // size: '90%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: '',
                          formatter: () => `${brands?.length} Brands`,
                        },
                      },
                    },
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                legend: {
                  position: 'bottom',
                },
              }}
            />
          )}
        </div>
      </div>
      <div className={classes.spacedItemsContainer}>
        <p className={classes.pageTitle}>Revenue</p>
      </div>
      <div className={classes.cardContainer}>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>YTD</h2>
              <p className={classes.currencyText}>{USDollar.format(revenue)}</p>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>This month</h2>
              <p className={classes.currencyText}>
                {USDollar.format(revenueMonth)}
              </p>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>Past 1 week</h2>
              <p className={classes.currencyText}>
                {USDollar.format(revenueWeek)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.spacedItemsContainer}>
        <p className={classes.pageTitle}>Template Exports</p>
      </div>
      <div className={classes.cardContainer}>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>YTD</h2>
              <p className={classes.currencyText}>
                {GetNumber.format(exportYear)}
              </p>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>This month</h2>
              <p className={classes.currencyText}>
                {GetNumber.format(exportMonth)}
              </p>
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <div>
            <div>{ChartIcon}</div>
            <div className={classes.cardText}>
              <h2>Past 1 week</h2>
              <p className={classes.currencyText}>
                {GetNumber.format(exportWeek)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
