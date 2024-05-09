import { CountryType, QuotationType, WorkStatementType } from '@/common/types';
import CountrySelect from '@/components/CountrySelect';
import PasswordInput from '@/components/PasswordInput';
import StyledInput, { styledInputPropsSx } from '@/components/StyledInput';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import countries from '@/lib/countries';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Alert,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classes from '@/components/login/SignupComponent.module.css';
import myAccountClasses from '@/components/MyAccount.module.css';
import axios from 'axios';
import moment from 'moment';
import ModalConfirmUser from '@/components/ModalConfirmUser';
import { getInvoiceHTMLString } from '@/utils/getInvoice';
import { pdf } from '@react-pdf/renderer';
import { PdfDocument } from '@/components/PDFExport';
import { useSession } from 'next-auth/react';

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
type CheckboxStates = {
  allTemplates: boolean;
  videoHosting: boolean;
  exportToPDF: boolean;
  exportToHTML: boolean;
};

const initialCheckboxStates: CheckboxStates = {
  allTemplates: false,
  videoHosting: false,
  exportToPDF: false,
  exportToHTML: false,
};

const UserDetailPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brand, setBrand] = useState('');
  const [therapyArea, setTherapyArea] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobFunction, setJobFunction] = useState('');
  const [country, setCountry] = useState<CountryType>(countries[0]);
  const [veevaFlag, setVeevaFlag] = useState<any>();
  const [openCardModal, setOpenCardModal] = React.useState<number>();
  const [pricing_id, setPricingId] = useState<any>();
  const [lastLogin, setLastLogin] = useState<any>('');
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>(
    initialCheckboxStates
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [sussessMessage, setSussessMessage] = useState<string>('');
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [iuser, setIuser] = useState<any>();
  const [user, setUser] = useState<any>();
  const [quotation, setQuotation] = useState<any>();
  const [pricings, setPricings] = useState<any>([]);
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
      getUser();
    }
  }, [id, session]);

  useEffect(() => {
    if (user) {
      // hanldeGetWorkStatements();
      hanldeGetquotation();
      hanldeGetpricings();
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword(user.password);
      setCompanyName(user.companyName);
      setBrand(user.brand);
      setTherapyArea(user.therapyArea);
      setJobTitle(user.jobTitle);
      setJobFunction(user.jobFunction);
      setCountry(
        countries.find((country) => country.code === user?.country) ||
          countries[0]
      );
      setPricingId(user?.pricing_id);
      setVeevaFlag(user?.veevaFlag ? 'yes' : 'no');
      // setLastLogin(user?.lastLogin);
      // setLastLogin(
      //   user?.lastLogin ? moment(user?.lastLogin).format('DD/MM/YYYY') : ''
      // );
    }
  }, [user]);

  const hanldeGetUser = async (email: any) => {
    await axios
      .get(`/api/user/get-by-email?email=${email}`)
      .then((res) => {
        setIuser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getUser = async () => {
    await axios
      .get(`/api/user/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeGetquotation = async () => {
    await axios(`/api/quotation/all`)
      .then((res) => {
        const quotationsdataFilter = res.data.filter(
          (item: any) => item.user_id == user?.id
        );
        const items = quotationsdataFilter.sort(
          (a: any, b: any) =>
            moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
        );
        const Quotation: any = items.find((e: any) => e.paidDate) || [];
        setQuotation(Quotation);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeGetpricings = async () => {
    await axios
      .get('/api/pricing')
      .then((res) => {
        setPricings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const hanldeGetWorkStatements = async () => {
  //   await axios(`/api/workStatement`)
  //     .then((res) => {
  //       const dataFilter = res.data.filter(
  //         (item: any) => item.user_id == user?.id
  //       );
  //       setWorkStatements(dataFilter);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  useEffect(() => {
    if (user?.userRights) {
      setSelectedValues(user.userRights);
      const updatedCheckboxStates: CheckboxStates = { ...checkboxStates };
      user.userRights.forEach((right: keyof CheckboxStates) => {
        if (updatedCheckboxStates.hasOwnProperty(right)) {
          updatedCheckboxStates[right] = true;
        }
      });
      setCheckboxStates(updatedCheckboxStates);
    }
  }, [user?.userRights]);
  const currentPackage = user?.pricing_id;
  const paidMember = user?.paidMember;
  const pricing = pricings.find((item: any) => item.id == pricing_id);
  let paidMemberFreePackage: any;
  if (pricing_id === null || pricing?.price === 0) {
    paidMemberFreePackage = null;
  } else {
    paidMemberFreePackage = new Date();
  }

  let nextBillingDate;
  if (paidMember) {
    nextBillingDate = moment(paidMember).add(
      parseInt(paidMember['Pricing.billing'], 10),
      'months'
    );
  }

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`/api/user/${user.id}`, {
        firstName,
        lastName,
        email,
        password,
        companyName,
        paidMember:
          currentPackage !== pricing_id ? paidMemberFreePackage : paidMember,
        userRights: selectedValues,
        brand,
        jobTitle,
        jobFunction,
        country: country?.code,
        veevaFlag: veevaFlag === 'yes',
        therapyArea,
        pricing_id,
      });
      setSussessMessage('User updated successfully');
    } catch (e) {
      alert(e);
    }
  };

  setTimeout(() => {
    setSussessMessage('');
  }, 6000);

  // let items = [...quotations, ...workStatements].sort(
  //   (a: any, b: any) =>
  //     moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
  // );

  const deleteDraft = (id: number) => {
    if (user.role === 'MainOwner') return;
    if (iuser === user.email) {
      alert('You cannot delete yourself');
      return;
    } else {
      axios
        .delete(`/api/user/${id}`)
        .then((response) => {
          setOpenCardModal(undefined);
          router.push('/admin/access');
        })
        .catch((error) => {
          console.error('Error fetching posts:', error);
          setOpenCardModal(undefined);
        });
    }
  };
  const [htmlContent, setHTMLContent] = useState('');

  useEffect(() => {
    setHTMLContent(
      getInvoiceHTMLString({
        selectedPrice: quotation?.Pricing,
        companyAddress: quotation?.companyAddress,
        companyName: quotation?.companyName,
        companyEmail: quotation?.companyEmail,
        contactPerson: quotation?.contactPerson,
      })
    );
  }, [quotation]);

  const handleImageUpload = async (file: File, fileName: string) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    /*   
   let data: any = ''
   const formData = new FormData();
   formData.append('file', file);
   const response = await fetch(
     `/api/upload`,
     {
       method: 'POST',
       body: formData,
     },
   );
   if (response) {
     if (response) {
       const blogFile = (await response.json()) as PutBlobResult;
       const href = blogFile.url;
       const a = document.createElement('a');
       a.href = href;
       a.download = blogFile.pathname;
       a.click();
     }
   }
   return data*/
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxStates((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    if (checked) {
      setSelectedValues((prevValues) => [...prevValues, name]);
    } else {
      setSelectedValues((prevValues) =>
        prevValues.filter((value) => value !== name)
      );
    }
  };

  const generatePdfDocument = async () => {
    const blob = await pdf(PdfDocument(htmlContent)).toBlob();
    const fileName = `${quotation?.contactPerson}${
      quotation?.Pricing?.name
    }${moment(quotation?.createdAt).format('DDMMYYYY')}.pdf`;
    const file = new File([blob], fileName, {
      type: 'application/octet-stream',
    });
    handleImageUpload(file, fileName);
  };
  return (
    <DesktopAdminLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '10vh',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              marginBottom: '16px',
            }}
            href="/admin/users"
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
                Users Detail
              </span>
            </>
          </Link>
          {sussessMessage && (
            <div
              style={{
                zIndex: 999,
                position: 'fixed',
                top: '80px',
                right: '20px',
              }}
            >
              {' '}
              <Alert severity="success">{sussessMessage}</Alert>
            </div>
          )}
        </div>
        <Box
          sx={{
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
              <label>First Name</label>
              <TextField
                required
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Last Name</label>
              <TextField
                required
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Email ID</label>
              <TextField
                required
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Password</label>
              <PasswordInput password={password} setPassword={setPassword} />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Company Name</label>
              <TextField
                required
                fullWidth
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Brand</label>
              <TextField
                required
                fullWidth
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Therapy Area</label>
              <TextField
                required
                fullWidth
                value={therapyArea}
                onChange={(e) => setTherapyArea(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <label>Job Title</label>
              <TextField
                required
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <label>Job Function</label>
                <Select
                  fullWidth
                  value={jobFunction}
                  onChange={(e) => setJobFunction(e.target.value)}
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
              <CountrySelect country={country} setCountry={setCountry} />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <label>LastLogin</label>
              <TextField
                required
                fullWidth
                value={lastLogin}
                // onChange={(e) => setTherapyArea(e.target.value)}
                InputProps={{ sx: styledInputPropsSx }}
              />
            </Grid> */}

            <Grid item xs={12} md={6}>
              <label>Are you using Veeva?</label>
              <FormControl fullWidth sx={{ marginTop: '10px' }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  row
                  value={veevaFlag}
                  onChange={(e) => setVeevaFlag(e.target.value)}
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
        </Box>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
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
            User Subscription
          </span>
          <Button onClick={() => generatePdfDocument()} variant="outlined">
            Download quotation and invoice
          </Button>
        </div>
        <div
          style={{
            borderRadius: '16px',
            border: '1px solid #F9FAFB',
            background: '#FFF',
            boxShadow:
              '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.10)',
            padding: '0 16px 16px 16px',
            width: '100%',
          }}
        >
          <div style={{ padding: '16px 0' }}>
            <label
              style={{
                color: '#111928',
                /* text-sm/font-medium */
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '150%',
              }}
            >
              Subscription Type
            </label>
            <Select
              fullWidth
              value={pricing_id ?? ''}
              onChange={(e) => setPricingId(e.target.value || null)}
              input={<StyledInput />}
            >
              <MenuItem value={''}>--Select Package--</MenuItem>
              {pricings.map((item: any, key: number) => (
                <MenuItem key={key} value={item.id}>
                  {item.name} Package
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={myAccountClasses.userContainer}>
            <div className={myAccountClasses.card}>
              <h3>Sign up on</h3>
              <p>{user?.createdAt.substring(0, 10)}</p>
            </div>
            <div className={myAccountClasses.card}>
              <h3>paid member since</h3>
              <p>{paidMember && moment(paidMember).format('DD/MM/YYYY')}</p>
            </div>
            <div className={myAccountClasses.card}>
              <h3>Next billing</h3>
              <p>
                {nextBillingDate &&
                  moment(nextBillingDate).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
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
            User rights
          </span>
        </div>
        <Grid className="userContainer">
          <FormControlLabel
            className="userDetail"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'modal-agree-terms' }}
                name="allTemplates"
                checked={checkboxStates.allTemplates}
                onChange={handleCheckboxChange}
              />
            }
            label="All templates"
            labelPlacement="start"
          />
          <FormControlLabel
            className="userDetail"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'modal-agree-terms' }}
                name="videoHosting"
                checked={checkboxStates.videoHosting}
                onChange={handleCheckboxChange}
              />
            }
            label="Video hosting"
            labelPlacement="start"
          />
          <FormControlLabel
            className="userDetail"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'modal-agree-terms' }}
                name="exportToPDF"
                checked={checkboxStates.exportToPDF}
                onChange={handleCheckboxChange}
              />
            }
            label="Export to PDF"
            labelPlacement="start"
          />
          <FormControlLabel
            className="userDetail"
            control={
              <Checkbox
                inputProps={{ 'aria-label': 'modal-agree-terms' }}
                name="exportToHTML"
                checked={checkboxStates.exportToHTML}
                onChange={handleCheckboxChange}
              />
            }
            label="Export to HTML"
            labelPlacement="start"
          />
        </Grid>
        <div
          className="userButton"
          style={{
            marginTop: '16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
            onClick={() => {
              setOpenCardModal(user.id);
            }}
            disabled={user?.role === 'MainOwner'}
          >
            Delete user
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={handleSaveChanges}
          >
            Save
          </Button>
        </div>
      </Box>
      <ModalConfirmUser
        open={openCardModal}
        setOpen={setOpenCardModal}
        deleteDraft={deleteDraft}
      />
    </DesktopAdminLayout>
  );
};
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

//   // const currentUser: any = await User.findOne({
//   //   where: { email: session.user?.email },
//   //   raw: true,
//   // });
//   const Data = await axios.get(
//     `/api/user/get-by-email?email=${session.user?.email}`
//   );

//   const currentUser: any = Data.data;
//   if (!['MainOwner', 'Owner', 'Admin'].includes(currentUser?.role))
//     return redirectObject;
//   const userData = await axios.get(`/api/user/${context.query.id}`);
//   const user: any = userData.data;
//   //  await User.findOne({
//   //   where: { id: context.query.id },
//   //   raw: true,
//   // });
//   const pricingsData = await axios.get('/api/pricing');
//   const pricings: any = pricingsData.data;
//   // await Pricing.findAll({
//   //   where: { trash: { [Op.ne]: true } },
//   //   order: [['index', 'ASC']],
//   // });

//   let workStatements: any = [];
//   let quotations: any = [];

//   if (user && user.id) {
//     const workStatementsdata = await axios(`/api/workStatement`);
//     const dataFilter = workStatementsdata.data.filter(
//       (item: any) => item.user_id === Number(user?.id)
//     );
//     workStatements = dataFilter;
//     // await WorkStatement.findAll({
//     //   order: [['id', 'ASC']],
//     //   include: Pricing,
//     //   where: { user_id: Number(user?.id) },
//     // });
//     const quotationsdata = await axios(`/api/quotation/all`);
//     const quotationsdataFilter = quotationsdata.data.filter(
//       (item: any) => item.user_id === Number(user?.id)
//     );

//     quotations = quotationsdataFilter;
//     // await Quotation.findAll({
//     //   order: [['id', 'ASC']],
//     //   include: Pricing,
//     //   where: { user_id: Number(user?.id) },
//     // });
//   }

//   let items = quotations.sort(
//     (a: any, b: any) =>
//       moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
//   );
//   let quotation: any = items.find((e: any) => e.paidDate) || [];

//   return {
//     props: {
//       userEmail: session.user?.email,
//       user: user,
//       workStatements: workStatements,
//       quotations: quotations,
//       quotation: quotation,
//       pricings: pricings,
//     },
//   };
// };

export default UserDetailPage;
