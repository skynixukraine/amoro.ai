import React, { useState } from 'react';
import classes from './ExportQuotation.module.css';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import StyledInput, { styledInputPropsSx } from '../StyledInput';
import Link from 'next/link';
import { PriceType } from '@/common/types';
// import axios from 'axios';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import QuotationInvoice from './QuotationInvoice';
import moment from 'moment';

const ArrowBackIcon = (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.2858 11.0542H5.85359L9.78423 6.9276C9.94795 6.76158 10.0785 6.563 10.1684 6.34344C10.2582 6.12388 10.3055 5.88773 10.3075 5.64877C10.3095 5.40982 10.2661 5.17284 10.1799 4.95167C10.0937 4.7305 9.96642 4.52957 9.80548 4.3606C9.64453 4.19163 9.45313 4.058 9.24247 3.96751C9.0318 3.87702 8.80608 3.83149 8.57847 3.83356C8.35086 3.83564 8.12592 3.88529 7.91678 3.9796C7.70765 4.07392 7.51849 4.21102 7.36037 4.38291L0.503608 11.5815C0.343972 11.7486 0.217317 11.9472 0.1309 12.1659C0.0444827 12.3845 0 12.6189 0 12.8556C0 13.0923 0.0444827 13.3267 0.1309 13.5454C0.217317 13.764 0.343972 13.9626 0.503608 14.1298L7.36037 21.3283C7.68367 21.6561 8.11667 21.8375 8.56613 21.8334C9.01558 21.8293 9.44552 21.6401 9.76335 21.3064C10.0812 20.9727 10.2615 20.5214 10.2654 20.0495C10.2693 19.5776 10.0965 19.123 9.78423 18.7836L5.85359 14.6535H22.2858C22.7404 14.6535 23.1765 14.4638 23.4979 14.1263C23.8194 13.7888 24 13.3311 24 12.8538C24 12.3765 23.8194 11.9188 23.4979 11.5813C23.1765 11.2438 22.7404 11.0542 22.2858 11.0542Z"
      fill="#111928"
    />
  </svg>
);

export default function ExportQuotation(props: { prices: Array<PriceType> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const prices = props.prices;
  let packageSelect = router.query?.package;

  let availablePrices = prices.filter((price) => price.price > 0);
  let packageNumber = prices.findIndex((e) => e.name === packageSelect);

  const [selectedPrice, setSelectedPrice] = useState(
    prices[packageNumber ?? 0]
  );
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const handleChangePrice = (e: SelectChangeEvent<string>) => {
    const newSelectedPrice = prices.filter(
      (price) => price.name === e.target.value
    )[0];

    setSelectedPrice(newSelectedPrice);
  };
  const generateQuoteNumber = (contactPerson: string, selectedPrice: any) => {
    const parts = contactPerson.split(' ');
    const firstName = parts[0];
    return `${firstName}${selectedPrice?.name}${moment().format('MM/DD/YYYY')}`;
  };
  const handleExportQuotation = async () => {
    const email = session?.user?.email;
    if (!email) return alert('You are not authenticated');
    const quoteNumber = generateQuoteNumber(contactPerson, selectedPrice);
    const userRes = await axios.get(`/api/user/get-by-email?email=${email}`);
    const quotationRes = await axios.post('/api/quotation', {
      companyAddress,
      companyName,
      contactPerson,
      companyEmail,
      quoteNumber,
      pricing_id: selectedPrice?.id,
      user_id: userRes.data.id,
    });
    console.log(quotationRes);

    router.push(`/quotation/${quotationRes.data.id}`);
  };

  return (
    <div className={classes.header_container}>
      <Link href="/pricing">
        <div className={classes.header}>
          {ArrowBackIcon}
          <h1>Export quotation</h1>
        </div>
      </Link>
      <div className={classes.content_container}>
        <QuotationInvoice
          selectedPrice={selectedPrice}
          companyAddress={companyAddress}
          companyName={companyName}
          contactPerson={contactPerson}
          companyEmail={companyEmail}
          quoteNumber={generateQuoteNumber(contactPerson, selectedPrice)}
        />

        <div className={classes.content}>
          <div className={classes.formContainer}>
            <label>Package</label>
            <Select
              value={selectedPrice?.name}
              fullWidth
              input={<StyledInput />}
              onChange={handleChangePrice}
            >
              {prices.map((price) => (
                <MenuItem value={price.name} key={price.name}>
                  {price.name}
                </MenuItem>
              ))}
            </Select>
            <div className={classes.card}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                <h2>{selectedPrice?.name}</h2>
              </div>
              <div>
                <span className={classes.priceText}>
                  ${selectedPrice?.price}
                </span>
                <span className={classes.billingText}>
                  /{selectedPrice?.billing}month
                </span>
              </div>
            </div>
            <label>Attention To</label>
            <TextField
              fullWidth
              placeholder="Enter your attention"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              InputProps={{
                sx: { ...styledInputPropsSx, marginBottom: '16px' },
              }}
            />
            <label>Company Name</label>
            <TextField
              fullWidth
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              InputProps={{
                sx: { ...styledInputPropsSx, marginBottom: '16px' },
              }}
            />
            <label>Company Address</label>
            <TextField
              fullWidth
              placeholder="Enter your company address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              InputProps={{
                sx: { ...styledInputPropsSx, marginBottom: '16px' },
              }}
            />
            <label>Email address</label>
            <TextField
              fullWidth
              placeholder="Enter contact person email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              InputProps={{
                sx: { ...styledInputPropsSx, marginBottom: '16px' },
              }}
            />

            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              fullWidth
              onClick={handleExportQuotation}
            >
              Export Quotation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
