import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Button,
  IconButton,
  TableFooter,
  TablePagination,
} from '@mui/material';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import DatePicker from '@/components/DatePicker';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import countries from '@/lib/countries';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { convertArrayOfObjectsToCsv } from '@/utils';
import { useRouter } from 'next/router';
import moment from 'moment';
import axios from '@/common/config';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

type ExportType = {
  id: number;
  date: string;
  time: string;
  name: string;
  paidMember: string;
  therapyArea: string;
  company: string;
  country: string;
  brand: string;
  therapy: string;
  exportType: string;
  exportTemplate: string;
  templates: any;
  data: string;
};

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

export default function ExportListComponent() {
  // const { exports } = props;
  const router = useRouter();
  const { start, end } = router.query;
  const { data: session } = useSession();
  const [data, setData] = useState<any>();
  const [user, setUser] = useState<any>();
  const [exports, setExports] = useState<any>();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const hanldeSelectTime = () => {
    router.push(`/admin/insights/?start=${startDate}&end=${endDate}`);
  };
  React.useEffect(() => {
    if (endDate && startDate) {
      hanldeSelectTime();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    if (data) {
      setExports(data);
    }
  }, [data]);
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
    if (start && end) {
      await axios(`/api/admin/insights?start=${start}&end=${end}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios('/api/admin/insights')
        .then((res) => {
          setData(res.data);
        })
        .then((err) => {
          console.log(err);
        });
    }
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - exports.length) : 0;

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

  const fixBreakLine = (str?: string) => {
    if (!str) return '';
    return str?.toString()?.replace(/(?:\r\n|\r|\n)/g, ' ');
  };

  const handleExportExcel = () => {
    const data = exports?.map((exportObj: any, index: any) => ({
      NO: index,
      'DATE EXPORTS': exportObj.date,
      'TIME EXPORTS': exportObj.time,
      'NAME OF USER': exportObj.name,
      'USER ID': exportObj.paidMember,
      COMPANY: exportObj.company,
      BRAND: exportObj.brand,
      COUNTRY: exportObj.country,
      'Export Type': exportObj.exportType,
      'Export Template': exportObj.exportTemplate,
      'Email Content':
        exportObj.templates?.formData?.contents &&
        exportObj.templates?.formData?.contents[0]?.message,
      'Email Content Image Url':
        exportObj.templates?.formData?.contents &&
        exportObj.templates?.formData?.contents[0]?.image,
      'Veeva approval ID': exportObj.templates?.pi,
      'Email Type': exportObj.templates?.formData?.emailType,
      'Brand Name': exportObj.templates?.formData?.brandName,
      'Tone Of Voice': exportObj.templates?.formData?.toneOfVoice,
      'Words Length': exportObj.templates?.formData?.wordsLength,
      'Tell Us More Details': exportObj.templates?.formData?.details,
      'Tell Us More Background': exportObj.templates?.formData?.background,
      'Privacy Policy': exportObj.templates?.formData?.privacyPolicy,
      'Unsubscribe Link': exportObj.templates?.formData?.unsubscribeLink,
      'CTA Label': fixBreakLine(
        exportObj.templates?.formData?.ctas[0]?.ctaType
      ),
      'CTA Link': fixBreakLine(
        exportObj.templates?.formData?.ctas[0]?.ctaAction
      ),
      'Subject Line': fixBreakLine(
        exportObj.templates?.optimizer?.formData[0]?.value
      ),
      'Paragraph 1': fixBreakLine(
        exportObj.templates?.optimizer?.formData[1]?.value
      ),
      'Paragraph 2': fixBreakLine(
        exportObj.templates?.optimizer?.formData[2]?.value
      ),
      Speaker: exportObj.templates?.formData?.speaker,
      'Body Text 1': exportObj.templates?.formData?.bodyText1,
      'Body Text 2': exportObj.templates?.formData?.bodyText2,
      'About Video': exportObj.templates?.formData?.aboutVideo,
      'Event Type': exportObj.templates?.formData?.eventType,
      'Speaker Topic':
        exportObj.templates?.formData?.speakers &&
        exportObj.templates?.formData?.speakers[0]?.topic,
      'Speaker Name':
        exportObj.templates?.formData?.speakers &&
        exportObj.templates?.formData?.speakers[0]?.speakerName,
      'Speaker Title':
        exportObj.templates?.formData?.speakers &&
        exportObj.templates?.formData?.speakers[0]?.speakerTitle,
    }));

    convertArrayOfObjectsToCsv(data);
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
            Total Exports
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <DatePicker setEndDate={setEndDate} setStartDate={setStartDate} />
            <div style={{ marginRight: 10 }}></div>
            <Button
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={handleExportExcel}
            >
              Export in Excel
            </Button>
          </div>
        </div>
        <TableContainer
          component={Paper}
          sx={{ overflowX: 'auto', maxWidth: '80vw' }}
        >
          <Table
            sx={{ minWidth: 500, maxWidth: '80vw' }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                <TableCell>NO</TableCell>
                <TableCell>DATE EXPORTS</TableCell>
                <TableCell>TIME EXPORTS</TableCell>
                <TableCell>NAME OF USER</TableCell>
                <TableCell>USER ID</TableCell>
                <TableCell>COMPANY</TableCell>
                <TableCell>BRAND</TableCell>
                <TableCell>COUNTRY</TableCell>
                <TableCell>EXPORT TYPE</TableCell>
                <TableCell>TEMPLATE TYPE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? exports?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : exports
              )?.map((insight: ExportType, index: number) => (
                <TableRow
                  key={insight.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{insight.date.padStart(10, '0')}</TableCell>
                  <TableCell>{`${insight.time
                    .split(':')[0]
                    .padStart(2, '0')}:${insight.time
                    .split(':')[1]
                    .padStart(2, '0')}`}</TableCell>
                  <TableCell>{insight.name}</TableCell>
                  <TableCell>{insight.paidMember}</TableCell>
                  <TableCell>{insight.company}</TableCell>
                  <TableCell>{insight.brand}</TableCell>
                  <TableCell>{insight.country}</TableCell>
                  <TableCell>{insight.exportType}</TableCell>
                  <TableCell>{insight.exportTemplate}</TableCell>
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
                  colSpan={7}
                  count={exports?.length}
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
  if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
    return redirectObject;

  return {
    props: { user },
  };
};
