import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import {
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';

import classes from '@/components/AdminPricingPage.module.css';
import StyledInput, { styledInputPropsSx } from '@/components/StyledInput';
// import axios from 'axios';
import axios from '@/common/config';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { PriceType } from '@/common/types';
import ModalConfirmUser from '@/components/ModalConfirmUser';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AdminPricing() {
  const router = useRouter();
  const { data: session } = useSession();
  const [prices, setPrices] = useState<Array<PriceType>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState<string>();
  const [openCardModal, setOpenCardModal] = useState<number>();
  const [user, setUser] = useState<any>();
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
    } else {
      // router.push('/');
    }
  }, [session]);
  useEffect(() => {
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
  // console.log(prices);

  const fetchData = async () => {
    const res = await axios.get('/api/pricing');
    const sortedPrices = [...res.data]
      .filter((item) => item.trash === false)
      .sort((a, b) => (a.index || 0) - (b.index || 0));
    setPrices(sortedPrices);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/pricing');
      console.log(res);
      const sortedPrices = [...res.data]
        .filter((item) => item.trash === false)
        .sort((a, b) => (a.index || 0) - (b.index || 0));
      setPrices(sortedPrices);
    };

    fetchData();
  }, []);

  const addNewPricing = async () => {
    await axios.post('/api/pricing/new');
    setIsOpen(true);
    setText('create');
    await fetchData();
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  const handleSave = async () => {
    const promisesArray = prices.map(async (price) => {
      await axios.put(`/api/pricing/${price.id}`, price);
    });

    try {
      await Promise.all(promisesArray);
      setIsOpen(true);
      setText('Update');
      fetchData();
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (e) {
      alert('Unknown error occured: ' + e);
    }
  };

  const hanldeDelete = async (id: number) => {
    // const price = await axios.get(`/api/pricing/${id}`);
    // if(price.data.Quotations && price.data.Quotations.length > 0){
    //   alert("You can't delete this pricing because it is used in some quotations")
    //   return
    // }
    // if(price.data.Work_Statements && price.data.Work_Statements.length > 0){
    //   alert("You can't delete this pricing because it is used in some Work Statements")
    //   return
    // }
    const responce = await axios.put(`/api/pricing/${id}`, { trash: true });
    if (responce) {
      setIsOpen(true);
      setText('Delete');
      fetchData();
      setOpenCardModal(undefined);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
  };

  const DollarIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.38345 6.98561C7.34887 6.81875 6.4399 6.36995 5.84123 5.7304C5.74515 5.62914 5.6782 5.51465 5.64445 5.39388C5.61071 5.27311 5.61087 5.14858 5.64494 5.02786C5.94044 4.24726 7.60894 3.81246 9.22303 4.09972C9.97581 4.22116 10.6582 4.51119 11.1753 4.9295C11.3111 5.04761 11.4775 5.14491 11.6649 5.21579C11.8523 5.28668 12.0569 5.32976 12.2672 5.34255C12.4774 5.35534 12.689 5.33759 12.8898 5.29033C13.0906 5.24306 13.2767 5.16721 13.4373 5.06714C13.5979 4.96706 13.7299 4.84474 13.8256 4.70721C13.9214 4.56968 13.979 4.41965 13.9953 4.26576C14.0115 4.11187 13.986 3.95714 13.9202 3.81049C13.8544 3.66384 13.7496 3.52815 13.6119 3.41123C12.6586 2.61853 11.3904 2.0639 9.98474 1.82505C9.89939 1.80944 9.81618 1.80787 9.73083 1.79538V1.1709C9.73083 0.86036 9.56224 0.562536 9.26214 0.34295C8.96204 0.123363 8.55502 0 8.13061 0C7.70621 0 7.29919 0.123363 6.99909 0.34295C6.69899 0.562536 6.53039 0.86036 6.53039 1.1709V1.81412C5.61092 1.9436 4.75646 2.25272 4.0576 2.7087C3.35873 3.16468 2.84152 3.75054 2.56078 4.40416C2.4117 4.82679 2.38096 5.26713 2.47043 5.69868C2.5599 6.13023 2.76771 6.54408 3.08138 6.91535C4.11359 8.10453 5.74707 8.94644 7.62494 9.25716C8.65995 9.42426 9.56903 9.87368 10.1672 10.5139C10.2634 10.6151 10.3305 10.7296 10.3644 10.8504C10.3983 10.9711 10.3984 11.0957 10.3645 11.2165C10.0669 11.9971 8.39732 12.4303 6.78536 12.1446C6.02492 12.0232 5.3366 11.7286 4.81922 11.3031C4.54564 11.0677 4.156 10.921 3.73521 10.895C3.31443 10.8689 2.89662 10.9656 2.57285 11.164C2.24909 11.3624 2.04562 11.6463 2.00678 11.954C1.96795 12.2617 2.09691 12.5681 2.36555 12.8066C3.32254 13.6147 4.60519 14.1799 6.02899 14.4208C6.19541 14.4505 6.36077 14.4653 6.52719 14.4872V14.8291C6.52719 15.1396 6.69579 15.4375 6.99589 15.657C7.29599 15.8766 7.70301 16 8.12741 16C8.55182 16 8.95884 15.8766 9.25894 15.657C9.55904 15.4375 9.72763 15.1396 9.72763 14.8291V14.3959C10.5977 14.2434 11.3985 13.9278 12.0511 13.4801C12.7038 13.0324 13.1858 12.468 13.4497 11.8425C13.5985 11.4198 13.6289 10.9795 13.5393 10.5479C13.4497 10.1164 13.2418 9.70259 12.9281 9.33132C11.8963 8.14074 10.2624 7.2974 8.38345 6.98561Z"
        fill="#0F6937"
      />
    </svg>
  );

  const Card: React.FC<{
    id: number;
    name: string;
    price: number;
    billing: string;
    discountedPrice: number;
    index: number;
    popular: boolean;
    stripe_link: string;
  }> = ({
    id,
    name,
    price,
    billing,
    discountedPrice,
    index,
    popular,
    stripe_link,
  }) => {
    const [nameValue, setNameValue] = useState(name);
    const [priceValue, setPriceValue] = useState(price);
    const [discountedPriceValue, setDiscountedPriceValue] = useState(
      discountedPrice ? discountedPrice : undefined
    );
    const [indexValue, setIndexValue] = useState(index ? index : undefined);
    const [stripelinkValue, setStripelinkValue] = useState(stripe_link);

    return (
      <div className={classes.card}>
        <label className={classes.cardSubtitle}>Name</label>
        <TextField
          value={nameValue}
          onChange={(e) => {
            setNameValue(e.target.value);
          }}
          onMouseOut={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.name = nameValue;
            setPrices(newPrices);
          }}
          InputProps={{ sx: styledInputPropsSx }}
        />
        <label className={classes.cardSubtitle}>
          Sale Price{' '}
          {discountedPriceValue &&
            `(Off ${
              100 - Math.round((priceValue / discountedPriceValue) * 100)
            }%)`}
        </label>
        <TextField
          fullWidth
          value={priceValue}
          placeholder="Input price"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{DollarIcon}</InputAdornment>
            ),
            sx: styledInputPropsSx,
          }}
          onChange={(e) => {
            if (e.target.value) {
              if (isNaN(+e.target.value)) return;
              setPriceValue(Number.parseInt(e.target.value));
            } else {
              setPriceValue(0);
            }
          }}
          onMouseOut={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.price = priceValue;
            setPrices(newPrices);
          }}
        />
        <label className={classes.cardSubtitle}>Original Price</label>
        <TextField
          fullWidth
          value={discountedPriceValue}
          placeholder="Input price"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{DollarIcon}</InputAdornment>
            ),
            sx: styledInputPropsSx,
          }}
          onChange={(e) => {
            if (e.target.value) {
              if (isNaN(+e.target.value)) return;
              setDiscountedPriceValue(Number.parseInt(e.target.value));
            } else {
              setDiscountedPriceValue(undefined);
            }
          }}
          onMouseOut={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.discountedPrice = discountedPriceValue || 0;
            setPrices(newPrices);
          }}
        />
        <label className={classes.cardSubtitle}>Billing</label>
        <Select
          input={<StyledInput />}
          value={billing}
          fullWidth
          onChange={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.billing = e.target.value;
            setPrices(newPrices);
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
            <MenuItem key={'select_billing' + value} value={value}>
              {`${value} month` + (value !== 1 ? 's' : '')}
            </MenuItem>
          ))}
        </Select>
        <label className={classes.cardSubtitle}>Position</label>
        <TextField
          fullWidth
          value={indexValue}
          placeholder="Input price"
          InputProps={{ sx: styledInputPropsSx }}
          onChange={(e) => {
            if (e.target.value) {
              if (isNaN(+e.target.value)) return;
              setIndexValue(Number.parseInt(e.target.value));
            } else {
              setIndexValue(undefined);
            }
          }}
          onMouseOut={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.index = indexValue || 0;
            setPrices(newPrices);
          }}
        />
        <label className={classes.cardSubtitle}>Stripe Link</label>
        <TextField
          fullWidth
          placeholder="Link payment"
          value={stripelinkValue}
          onChange={(e) => {
            setStripelinkValue(e.target.value);
          }}
          onMouseOut={(e) => {
            const newPrices = [...prices];
            const selectedPrice = newPrices.filter(
              (price) => price.id === id
            )[0];
            selectedPrice.stripe_link = stripelinkValue;
            setPrices(newPrices);
          }}
          InputProps={{
            sx: styledInputPropsSx,
          }}
        />
        <label className={classes.cardSubtitle}>Most Popular</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            checked={popular}
            onChange={(e) => {
              const newPrices = [...prices];
              const selectedPrice = newPrices.filter(
                (price) => price.id === id
              )[0];
              selectedPrice.popular = e.target.checked;
              setPrices(newPrices);
            }}
            type="checkbox"
            name=""
            id=""
          />
          <span>Yes</span>
        </div>
      </div>
    );
  };

  let rows = [
    ['All Templates', ...prices.map((price) => price.allTemplates)],
    ['Video Hosting', ...prices.map((price) => price.videoHosting)],
    ['Export to PDF', ...prices.map((price) => price.exportToPdf)],
    ['Export to HTML', ...prices.map((price) => price.exportToHtml)],
  ];

  const PricingTable: React.FC = () => {
    return (
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Comparison</TableCell>
            {prices.map((price) => (
              <TableCell key={price.id}>{price.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row[0].toString()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row[0]}
              </TableCell>
              {row.slice(1).map((value, jindex) => (
                <TableCell align="right" key={`${index} - ${jindex}`}>
                  <RadioGroup
                    row
                    value={value}
                    onChange={(e) => {
                      const newPrices = [...prices];
                      const modifiedPrice = newPrices[jindex];
                      switch (index) {
                        case 0:
                          modifiedPrice.allTemplates =
                            e.target.value === 'true';
                          break;
                        case 1:
                          modifiedPrice.videoHosting =
                            e.target.value === 'true';
                          break;
                        case 2:
                          modifiedPrice.exportToPdf = e.target.value === 'true';
                          break;
                        case 3:
                          modifiedPrice.exportToHtml =
                            e.target.value === 'true';
                          break;
                        default:
                          break;
                      }
                      setPrices(newPrices);
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const PopUp = () => {
    const [topValue, setTopValue] = useState('-100%');
    useEffect(() => {
      if (isOpen) {
        setTopValue('15%');
      } else {
        setTopValue('-100%');
      }
    }, [isOpen]);

    return (
      <div>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: topValue,
              right: '10%',
              transform: 'translate(-50%, -50%)',
              background: '#0F6937',
              padding: '0px 25px',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
              transition: 'top 0.9s',
            }}
          >
            <p>{text} Successful</p>
          </div>
        )}
      </div>
    );
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
        <PopUp />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <p className={classes.pageTitle}>Pricing</p>
          <Button
            variant="outlined"
            sx={{ textTransform: 'none' }}
            onClick={addNewPricing}
          >
            Add Package
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap',
            marginTop: '16px',
            width: '100%',
          }}
        >
          {prices.map((price) => (
            <div key={price.id} style={{ margin: '10px' }}>
              <Card
                id={price.id}
                name={price.name}
                price={price.price}
                billing={price.billing}
                discountedPrice={price.discountedPrice}
                index={price.index}
                popular={price.popular}
                stripe_link={price.stripe_link}
              />
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                }}
              >
                <button
                  onClick={() => setOpenCardModal(price.id)}
                  style={{
                    padding: '5px 7px',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    border: '#6b7280 1px solid',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
                <ModalConfirmUser
                  open={openCardModal}
                  setOpen={setOpenCardModal}
                  deleteDraft={hanldeDelete}
                  text={'Pricing'}
                />
              </div>
            </div>
          ))}
        </div>
        {prices.length > 0 && (
          <>
            <Box
              sx={{
                minWidth: '70vw',
                maxWidth: '90vw !important',
                overflowX: 'auto',
              }}
            >
              <PricingTable />
              <div className={classes.saveButtonContainer}>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </Box>
          </>
        )}
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
