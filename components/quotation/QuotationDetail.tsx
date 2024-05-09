import React, { useState, useEffect } from 'react';
import classes from './ExportQuotation.module.css';
import { Button } from '@mui/material';
import Link from 'next/link';
import { QuotationType } from '@/common/types';

import DetailClasses from './QuotationDetails.module.css';
import moment from 'moment';
import { pdf } from '@react-pdf/renderer';
import { PdfDocument } from '../PDFExport';
import { getInvoiceHTMLString } from '@/utils/getInvoice';
// import axios from 'axios';
import axios from '@/common/config';

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

export default function QuotationDetail(props: { quotation: QuotationType }) {
  const quotation = props.quotation;
  const [checkStatus, setCheckStatus] = useState<boolean>(false);
  const [paidDate, setPaidDate] = useState(quotation?.paidDate);

  const hanldeChecksatus = () => {
    axios.get(`/api/quotation/${quotation.id}`).then((res: any) => {
      if (res.data) {
        setPaidDate(res.data?.paidDate);
      }
      setCheckStatus(true);
    });
  };
  const [htmlContent, setHTMLContent] = useState('');

  useEffect(() => {
    setHTMLContent(
      getInvoiceHTMLString({
        selectedPrice: quotation.Pricing,
        companyAddress: quotation.companyAddress,
        companyName: quotation.companyName,
        companyEmail: quotation.companyEmail,
        contactPerson: quotation.contactPerson,
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

  const generatePdfDocument = async () => {
    const blob = await pdf(PdfDocument(htmlContent)).toBlob();
    const fileName = `${quotation.contactPerson}${
      quotation.Pricing?.name
    }${moment(quotation.createdAt).format('DDMMYYYY')}.pdf`;
    const file = new File([blob], fileName, {
      type: 'application/octet-stream',
    });
    handleImageUpload(file, fileName);
  };

  const DownloadPdfButton = () => (
    <button
      onClick={() => generatePdfDocument()}
      className={DetailClasses.button_dowload}
    >
      Download PDF
    </button>
  );

  return (
    <div className={classes.container}>
      <Link href="/my-account">
        <div className={classes.header}>
          {ArrowBackIcon}
          <h1>Quotation Details</h1>
        </div>
      </Link>
      <div className={classes.formContainer}>
        <div className={DetailClasses.detailContainer}>
          <div className={DetailClasses.detailCard}>
            <h2>Transfer To</h2>
            <div className={DetailClasses.bankCard}>
              {checkStatus || paidDate ? (
                <label
                  className={
                    paidDate
                      ? DetailClasses.successText
                      : DetailClasses.errorText
                  }
                >
                  {paidDate ? '' : 'Not '}Paid
                </label>
              ) : (
                <label className={DetailClasses.WaitingText}>Waiting</label>
              )}
              <p>
                Please proceed with the payment in the quotation. Upon
                successful receipt of payment, your account will be fully
                activated
              </p>
              <h5 className={DetailClasses.bankAccountParagraph}>
                {quotation.quoteNumber}
              </h5>
              <button
                className={DetailClasses.button_dowload}
                onClick={() => generatePdfDocument()}
              >
                Download PDF
              </button>
            </div>
            <div className={DetailClasses.table}>
              <div>
                <p>Package</p>
                <p>{quotation?.Pricing?.name}</p>
              </div>
              <hr />
              <div>
                <p>Total Due</p>
                <p>${quotation?.Pricing?.price}</p>
              </div>
              <hr />
              <div>
                <p>Company Name</p>
                <p>{quotation.companyName}</p>
              </div>
              <hr />
              <div>
                <p>Company Address</p>
                <p>{quotation.companyAddress}</p>
              </div>
              <hr />
              <div>
                <p>Contact Person</p>
                <p>{quotation.contactPerson}</p>
              </div>
            </div>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              fullWidth
              onClick={hanldeChecksatus}
            >
              Check payment status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
