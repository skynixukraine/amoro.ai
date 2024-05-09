import axios from '@/common/config';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import classes from '../components/MyAccount.module.css';
import CountrySelect from '@/components/CountrySelect';
import StyledInput, { styledInputPropsSx } from '@/components/StyledInput';
import countries from '@/lib/countries';
import PasswordInput from '@/components/PasswordInput';
import useWindowSize from '@/hooks/useWindowSize';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import moment from 'moment';
import { convertArrayOfObjectsToCsv } from '@/utils';
import Subscription from '@/components/Subscription';
import PrivacyComponent from '@/components/login/PrivacyComponent';
import { useRouter } from 'next/router';
import { renderToString } from 'react-dom/server';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PrivacyPdf } from '@/components/PrivacyPdf';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
interface UserHistory {
  time: string;
  userId: number;
  name: string;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const router = useRouter();
  // const [privacyContent, setPrivacyContent] = useState<string>();

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  useEffect(() => {
    // const container = document.createElement('div');
    // ReactDOM.render(<PrivacyComponent />, container);
    // console.log(typeof container);
    const htmlString = renderToString(<PrivacyComponent />);
    // privacyContent(htmlString);
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const MyAccount = () => {
  const [page, setPage] = useState(0);
  const router = useRouter();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: session, status } = useSession();
  const { userId } = router.query;
  const [checkReder, setCheckReder] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [workStatements, setWorkStatements] = useState<any>([]);
  const [quotations, setQuotations] = useState<any>([]);
  const [exports, setExports] = useState<any>([]);
  const [histories, setHistories] = useState<UserHistory[]>([]);
  const [userCountry, setUserCountry] = useState<any>();

  useEffect(() => {
    setCheckReder(true);
  }, []);
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (userId) {
      hanldeGetUser();
    }
  }, [userId]);
  useEffect(() => {
    hanldeQuotations();
    hanldeWorkStatement();
    if (user) {
      hanldeExport();
      const Country = countries.find(
        (country) => country.code === user?.country
      );
      setUserCountry(Country);
      getHistories(user.id);
    }
  }, [user]);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - workStatements?.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const hanldeGetUser = async (email?: any) => {
    if (userId) {
      await axios
        .get(`/api/user/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .get(`/api/user/get-by-email?email=${email}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const hanldeWorkStatement = async () => {
    await axios
      .get(`/api/workStatement`)
      .then((res) => {
        const data = res.data.filter((item: any) => item.user_id === user?.id);
        setWorkStatements(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeQuotations = async () => {
    await axios
      .get(`/api/quotation`)
      .then((res) => {
        const data = res.data.filter((item: any) => item.user_id == user?.id);
        setQuotations(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeExport = async () => {
    await axios
      .get(`/api/exports`)
      .then((res) => {
        const data = res.data.filter((item: any) => item.user_id === user.id);
        const sortdata = sortByCreatedAt(data);
        setExports(sortdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function sortByCreatedAt(data: any) {
    return data.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  const getHistories = async (id: number) => {
    await axios
      .get(`/api/history/${id}`)
      .then((res) => {
        setHistories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const exportHistoryExcel = () => {
    const data = histories.map((user, index) => ({
      NO: index + 1,
      DATE: user.time.split(',')[0],
      TIME: user.time.split(',')[1],
    }));

    convertArrayOfObjectsToCsv(data);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportExcel = () => {
    const data = [user].map((user) => ({
      NO: user.id,
      NAME: `${user.firstName} ${user.lastName}`,
      COUNTRY: countries.find((c) => c.code === user.country)?.label,
      'THERAPY AREA': user.therapyArea,
      BRAND: user.brand,
      EMAIL: user.email,
      JOBTITLE: user.jobTitle,
      JOBFUNCTION: user.jobFunction,
      PASSWORD: user.password,
    }));

    convertArrayOfObjectsToCsv(data);
  };
  const [selectedType, setSelectedType] = useState('All');

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };
  const handleFilteredData = () => {
    let filteredData = items.filter((workStatement: any) => {
      const itemType = workStatement.hasOwnProperty('needAWorkStatement')
        ? 'workStatement'
        : 'quotation';
      return selectedType === 'All' || selectedType === itemType;
    });
    return filteredData;
  };

  const sizes = useWindowSize();

  let items = [...quotations, ...workStatements].sort(
    (a: any, b: any) =>
      moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
  );

  let latestPaid: any = items.find((e: any) => e.paidDate);
  let latestPaidDate = latestPaid ? latestPaid.paidDate : undefined;
  let nextBillingDate;
  if (latestPaidDate) {
    nextBillingDate = moment(latestPaidDate).add(
      parseInt(latestPaid['Pricing.billing'], 10),
      'months'
    );
  }
  const hanldeOpenDraft = (template: any, id: any) => {
    // console.log(template, id);

    if (id && template === 'standard') {
      router.push(`/copy-generator?id=${id}`);
    } else if (id && template === 'video') {
      router.push(`/video-email-generator?id=${id}`);
    } else if (id && template === 'event') {
      router.push(`/speaker-email-generator?id=${id}`);
    }
  };

  const DownloadPdfButton = () => {
    return (
      <PDFDownloadLink
        document={PrivacyPdf()}
        fileName={'Terms-Of-Use.pdf'}
        style={{ margin: '8px' }}
      >
        <Button
          style={{
            width: sizes.width && sizes.width < 768 ? '100%' : 'auto',
          }}
          variant="outlined"
        >
          Download Terms Of Use
        </Button>
      </PDFDownloadLink>
    );
  };

  return (
    <div className={classes.container}>
      <Grid
        container
        width={'100%'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <Grid item xs={12} width={'100%'}>
          <div
            style={{
              display: sizes.width && sizes.width < 768 ? 'block' : 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            {userId ? (
              <h1
                style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
              >
                {`${user?.firstName}`}&rsquo; Profile
              </h1>
            ) : (
              <h1
                style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
              >
                My Account
              </h1>
            )}
            {checkReder && <DownloadPdfButton />}
          </div>
        </Grid>
        <Grid item xs={12} className={classes.userDataSection}>
          <Grid
            container
            justifyItems={'center'}
            spacing={2}
            padding={sizes.width && sizes.width < 768 ? '16px' : '32px'}
          >
            <Grid item xs={12} md={6}>
              <label>First Name</label>
              <TextField
                disabled
                fullWidth
                value={user?.firstName}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Last Name</label>
              <TextField
                disabled
                fullWidth
                value={user?.lastName}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Email ID</label>
              <TextField
                disabled
                type="email"
                fullWidth
                value={user?.email}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Password</label>
              <PasswordInput password={user?.password || ''} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Company Name</label>
              <TextField
                disabled
                fullWidth
                value={user?.companyName}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Brand</label>
              <TextField
                disabled
                fullWidth
                value={user?.brand}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Therapy Area</label>
              <TextField
                disabled
                fullWidth
                value={user?.therapyArea}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Job Title</label>
              <TextField
                disabled
                fullWidth
                value={user?.jobTitle}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled>
                <label>Job Function</label>
                <Select
                  fullWidth
                  value={user?.jobFunction}
                  input={<StyledInput />}
                >
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Commercial Excellence">
                    Commercial Excellence
                  </MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Digital">Digital</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Innovation">Innovation</MenuItem>
                  <MenuItem value="Transformation">Transformation</MenuItem>
                  <MenuItem value="Content Team">Content Team</MenuItem>
                  <MenuItem value="Agency">Agency</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Country</label>
              <CountrySelect country={userCountry} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Are you using Veeva?</label>
              <FormControl fullWidth sx={{ marginTop: '10px' }} disabled>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  row
                  value={user?.veevaFlag ? 'yes' : 'no'}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} width={'100%'}>
          <h2 style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}>
            User ID
          </h2>
        </Grid>
        <Grid
          container
          width={'100%'}
          padding={sizes.width && sizes.width < 768 ? '16px' : '32px'}
          className={classes.user}
        >
          <Grid item xs={12} md={12} width={'100%'}>
            <label>User ID</label>
            <TextField
              disabled
              type="id"
              fullWidth
              value={
                user?.paidMember
                  ? `${user.firstName}${user?.Pricing?.name}${moment(
                      user?.paidMember
                    ).format('DDMMYYYY')}`
                  : user?.firstName +
                    '888' +
                    moment(user?.createdAt).format('DDMMYYYY') +
                    user?.country
              }
              InputProps={{ sx: styledInputPropsSx }}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} width={'100%'}>
          <Grid item xs={6}>
            <h2
              style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
            >
              History Login
            </h2>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={exportHistoryExcel}
              style={{ marginTop: 30, float: 'right' }}
            >
              <img src="homepage/download.svg"></img>
              Download
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          width={'100%'}
          padding={sizes.width && sizes.width < 768 ? '16px' : '32px'}
          className={classes.user}
        >
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ width: '30.67%' }}
                  className={classes.title_table}
                >
                  #
                </TableCell>
                <TableCell
                  style={{ width: '30.67%' }}
                  className={classes.title_table}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{ width: '30.67%' }}
                  className={classes.title_table}
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {histories
                .filter((e, i) => i < 10)
                .map((history, key) => (
                  <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className={classes.text_table}
                    >
                      {key + 1}
                    </TableCell>
                    <TableCell
                      style={{ width: '24.67%' }}
                      className={classes.text_table}
                    >
                      {history.time?.split(',')[0]}
                    </TableCell>
                    <TableCell
                      style={{ width: '24.67%' }}
                      className={classes.text_table}
                    >
                      {history.time?.split(',')[1]}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} width={'100%'}>
          <div
            style={{
              display: sizes.width && sizes.width < 768 ? 'block' : 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <h2
              style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
            >
              Subscription
            </h2>
            {/* <Button style={{ width: sizes.width && sizes.width < 768 ? '100%' : 'auto', marginBottom: 15 }} variant="outlined">Download quotation and invoice</Button> */}
          </div>
        </Grid>
        <Subscription
          user={user}
          latestPaidDate={latestPaidDate}
          nextBillingDate={nextBillingDate}
        />
        {/* <Grid className={classes.cardAccount}>

          <div className={classes.card}>
            <h3>Type Account</h3>
            <p>{user?.Pricing?.name || 'Free'}</p>
          </div>

          <div className={classes.card}>
            <h3>Sign up on</h3>
            <p>{user.createdAt.substring(0, 10)}</p>
          </div>

          <div className={classes.card}>
            <h3>Paid member since</h3>
            <p>{latestPaidDate && moment(latestPaidDate).format('DD/MM/YYYY')}</p>
          </div>

          <div className={classes.card}>
            <h3>Next billing</h3>
            <p>{nextBillingDate && moment(nextBillingDate).format('DD/MM/YYYY')}</p>
          </div>
        </Grid> */}
        <Grid item xs={12} width={'100%'}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <h2
              style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
            >
              Quotations and Work Statements
            </h2>
          </div>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ width: '16.67%' }}
                  className={classes.title_table}
                >
                  NO
                </TableCell>
                <TableCell
                  style={{ width: '16.67%' }}
                  className={classes.title_table}
                >
                  <Select value={selectedType} onChange={handleTypeChange}>
                    <MenuItem value="All">TYPE</MenuItem>
                    <MenuItem value="workStatement">Work Statement</MenuItem>
                    <MenuItem value="quotation">Quotation</MenuItem>
                  </Select>
                </TableCell>
                <TableCell
                  style={{ width: '16.67%' }}
                  className={classes.title_table}
                >
                  PACKAGE
                </TableCell>
                <TableCell
                  style={{ width: '24.67%' }}
                  className={classes.title_table}
                >
                  DATE
                </TableCell>
                <TableCell
                  style={{ width: '16.67%' }}
                  className={classes.title_table}
                >
                  STATUS
                </TableCell>
                <TableCell
                  style={{ width: '8.67%' }}
                  className={classes.title_table}
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? handleFilteredData()?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : handleFilteredData()
              )?.map((workStatement: any, index: number) => (
                <TableRow
                  key={workStatement.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.text_table}
                  >
                    {index}
                  </TableCell>
                  <TableCell className={classes.text_table}>
                    {workStatement.hasOwnProperty('needAWorkStatement')
                      ? 'Work Statement'
                      : 'Quotation'}
                  </TableCell>
                  <TableCell className={classes.text_table}>
                    {workStatement['Pricing.name']}
                  </TableCell>
                  <TableCell className={classes.text_table}>
                    <span>
                      {workStatement.createdAt &&
                        moment(workStatement.createdAt).format(
                          'DD / MM / YYYY - HH:mm'
                        )}
                    </span>
                  </TableCell>
                  <TableCell className={classes.text_table}>
                    {workStatement.paidDate ? (
                      <Button variant="contained" color="success" size="small">
                        Success
                      </Button>
                    ) : (
                      <Button variant="contained" color="error" size="small">
                        Waiting
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={
                        workStatement.hasOwnProperty('needAWorkStatement')
                          ? `/work-statement/${workStatement.id}`
                          : `/quotation/${workStatement.id}`
                      }
                    >
                      <Button
                        variant="contained"
                        className={classes.table_button}
                      >
                        Open
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter className={classes.border_row}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={workStatements?.length}
                  rowsPerPage={rowsPerPage}
                  className={classes.number_page}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <Grid item xs={12} width={'100%'}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <h2
              style={{ fontSize: sizes.width && sizes.width < 768 ? 20 : 32 }}
            >
              Template Exports
            </h2>
          </div>
        </Grid>
        {exports && exports.length > 0 && (
          <TableContainer component={Paper} sx={{ marginTop: '16px' }}>
            <Table aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Subject line of email</TableCell>
                  <TableCell>Template type</TableCell>
                  <TableCell>Veeva approval code</TableCell>
                  <TableCell>Date of export</TableCell>
                  <TableCell>PDF/HTML</TableCell>
                  <TableCell>Open email draft</TableCell>
                  <TableCell>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? exports.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : exports
                ).map((exportRow: any, idx: number) => (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{idx}</TableCell>
                    <TableCell>
                      {exportRow?.templates?.optimizer?.formData[0]?.value}
                    </TableCell>
                    <TableCell>{exportRow?.exportTemplate}</TableCell>
                    <TableCell>
                      {exportRow?.templates?.formData[0]?.veevaApprovalFlag}
                    </TableCell>
                    <TableCell>
                      {moment(exportRow.createdAt).format('DD/MM/YYYY - HH:MM')}
                    </TableCell>
                    <TableCell>{exportRow?.exportType}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          hanldeOpenDraft(
                            exportRow.exportTemplate,
                            exportRow.draft_id
                          )
                        }
                      >
                        Open
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleExportExcel}>
                        <img src="homepage/download.svg"></img>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={exports.length}
              rowsPerPage={rowsPerPage}
              page={page}
              sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                marginRight: '20px',
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableContainer>
        )}
      </Grid>
    </div>
  );
};
export default MyAccount;
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: session?.user.email || 'email',
    },
  };
};
