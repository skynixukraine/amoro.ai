import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  IconButton,
  TableFooter,
  TablePagination,
  Button,
  MenuItem,
  Select,
} from '@mui/material';
import axios from '@/common/config';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Link from 'next/link';
import { WorkStatementType } from '@/common/types';
import classes from '@/components/AdminWorkStatements.module.css';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useRouter } from 'next/router';
import DatePicker from '@/components/DatePicker';
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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

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

export default function WorkStatementsList() {
  const router = useRouter();
  const { start, end } = router.query;
  let currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = new Date(`${currentYear}-01-01`);
  const endYear = new Date(`${currentYear}-12-31`);
  let filterStartDate: any;
  let filterEndDate: any;

  if (start && typeof start === 'string') {
    filterStartDate = new Date(start);
  } else {
    filterStartDate = startYear;
  }
  if (end && typeof end === 'string') {
    filterEndDate = new Date(end);
  } else {
    filterEndDate = endYear;
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { data: session, status } = useSession();
  const [user, setUser] = React.useState<any>();
  const [workStatements, setWorkStatements] = React.useState<
    WorkStatementType[]
  >([]);

  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [workStatementData, setworkStatementData] =
    React.useState(workStatements);
  const [selectedType, setSelectedType] = React.useState('All');

  const hanldeSelectTime = () => {
    router.push(`/admin/work-statements/?start=${startDate}&end=${endDate}`);
  };
  React.useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
      hanldeGetWorkStatements();
    } else {
      // router.push('/');
    }
  }, [session]);
  React.useEffect(() => {
    setworkStatementData(workStatements);
  }, [workStatements]);
  React.useEffect(() => {
    if (user) {
      if (!['MainOwner', 'Owner', 'Admin'].includes(user?.role)) {
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
  const hanldeGetWorkStatements = async () => {
    await axios
      .get('/api/workStatement/pricing-user')
      .then((res) => {
        const filterworkStatement = res.data.filter((item: any) => {
          const createdAt = new Date(item.paidDate);
          return createdAt >= filterStartDate && createdAt < filterEndDate;
        });
        setWorkStatements(filterworkStatement);
      })
      .then((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (endDate && startDate) {
      hanldeSelectTime();
    }
  }, [startDate, endDate]);
  React.useEffect(() => {
    if (selectedType === 'yes') {
      setworkStatementData(
        workStatements.filter((item) => item.paidDate !== null)
      );
    } else if (selectedType === 'no') {
      setworkStatementData(
        workStatements.filter((item) => item.paidDate === null)
      );
    }
  }, [selectedType]);
  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - workStatements.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DesktopAdminLayout>
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
            Work Statements
          </p>
          <DatePicker setEndDate={setEndDate} setStartDate={setStartDate} />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>PACKAGE</TableCell>
                <TableCell>CREATED AT</TableCell>
                <TableCell
                //  className={classes.title_table}
                >
                  <Select value={selectedType} onChange={handleTypeChange}>
                    <MenuItem value="All">PAID</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No </MenuItem>
                  </Select>
                </TableCell>
                <TableCell>FILE UPLOADS</TableCell>
                <TableCell>VIEW</TableCell>
                <TableCell>CONFIGURE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? workStatementData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : workStatementData
              ).map((workStatement: any, index: number) => (
                <TableRow
                  key={workStatement.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell>{workStatement.companyEmail}</TableCell>
                  <TableCell>{workStatement['Pricing.name']}</TableCell>
                  <TableCell>
                    {workStatement.createdAt.substring(0, 10)}
                  </TableCell>
                  <TableCell>{workStatement.paidDate ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {workStatement.uploadFile &&
                      workStatement.uploadFile.length > 0
                        ? workStatement.uploadFile.map(
                            (
                              item: {
                                contentType: string;
                                pathname: string;
                                url: string;
                              },
                              idx: number
                            ) => (
                              <div key={idx}>
                                {item?.contentType?.includes('image') ? (
                                  <Link
                                    href={item.url}
                                    className={classes.pnwrapper}
                                  >
                                    <InsertPhotoOutlinedIcon />

                                    <div className={classes.pathname}>
                                      {item.pathname}
                                    </div>
                                  </Link>
                                ) : item?.contentType?.includes('pdf') ? (
                                  <Link
                                    href={item.url}
                                    className={classes.pnwrapper}
                                  >
                                    <PictureAsPdfOutlinedIcon color="primary" />

                                    <div className={classes.pathname}>
                                      {item.pathname}
                                    </div>
                                  </Link>
                                ) : (
                                  <InsertDriveFileOutlinedIcon />
                                )}
                              </div>
                            )
                          )
                        : 'No'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`/work-statement/${workStatement.id}`}
                    >
                      <Button
                        variant="contained"
                        autoFocus
                        sx={{ textTransform: 'none', color: '#fff' }}
                      >
                        See details
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/work-statements/${workStatement.id}`}>
                      <IconButton>{dotsIcon}</IconButton>
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={workStatements.length}
                  rowsPerPage={rowsPerPage}
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
      </div>
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
