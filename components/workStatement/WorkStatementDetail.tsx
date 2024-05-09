import React, { useState } from 'react';
import classes from '@/components/quotation/ExportQuotation.module.css';
import { Button } from '@mui/material';
import Link from 'next/link';
import { FileUpload, WorkStatementType } from '@/common/types';
import RequestWorkStatementDetail from './RequestWorkStatementDetail';
import Router, { useRouter } from 'next/router';

import DetailClasses from '@/components/quotation/QuotationDetails.module.css';
// import axios from 'axios';
import axios from '@/common/config';
import moment from 'moment-timezone';

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

export default function WorkStatementDetail(props: {
  workStatement: WorkStatementType | undefined;
}) {
  const workStatement = props?.workStatement;
  console.log(workStatement);

  const router = useRouter();
  const [check, setCheck] = useState<boolean>(true);
  const [pain, setPain] = useState<Boolean>(true);
  const [workStatementDetail, setWorkStatementDetail] = useState<
    WorkStatementType | undefined
  >(workStatement);
  const hanldeSetCheck = () => {
    setCheck(!check);
  };
  const hanldeCheckStatus = () => {
    axios.get(`/api/workStatement/${workStatement?.id}`).then((res: any) => {
      if (res.data) {
        setWorkStatementDetail(res.data);
      }
      setPain(false);
    });
  };

  async function downloadFilesFromUrls(fileDataArray: any) {
    const anchorElements = [];
    for (const fileData of fileDataArray) {
      const { url, fileName } = fileData;
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName || 'downloaded_file';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchorElements.push(anchor);
    }
    for (const anchor of anchorElements) {
      anchor.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      document.body.removeChild(anchor);
    }
  }

  const handleDownload = async () => {
    router.push('mailto:contactreiainow@gmail.com');
    // if (workStatement && workStatementDetail.requestFile) {
    //   const fileDataArray = workStatementDetail.requestFile.map((item) => ({
    //     url: item.url,
    //     fileName: item.pathname,
    //   }));
    //   await downloadFilesFromUrls(fileDataArray);
    // }
  };

  console.log(workStatement);

  return (
    <>
      {check && workStatement ? (
        <RequestWorkStatementDetail
          hanldeSetCheck={hanldeSetCheck}
          workStatement={workStatement}
        />
      ) : (
        <div className={classes.container}>
          <Link href="/my-account">
            <div className={classes.header}>
              {ArrowBackIcon}
              <h1>Work Statement Details</h1>
            </div>
          </Link>
          <div className={classes.pending_container}>
            <img src="/img/worked.svg" className={classes.img_work}></img>
            {workStatementDetail?.paidDate ||
            workStatementDetail?.progress === 'sent' ? (
              <div className={classes.pending_color}></div>
            ) : (
              <div className={classes.pending_cad}></div>
            )}
            {workStatementDetail?.paidDate ||
            workStatementDetail?.progress === 'sent' ? (
              <img
                src="/img/paymentseccessed.svg"
                className={classes.img_work}
              ></img>
            ) : (
              <img
                src="/img/pendingpayment.svg"
                className={classes.img_work}
              ></img>
            )}
            {!pain && workStatementDetail?.paidDate ? (
              <div className={classes.pending_color}></div>
            ) : (
              <div className={classes.pending_cad}></div>
            )}
            {!pain && workStatementDetail?.paidDate ? (
              <img
                src="/img/paymentsuccess.svg"
                className={classes.img_work}
              ></img>
            ) : (
              <img src="/img/payment.svg" className={classes.img_work}></img>
            )}
          </div>
          <div className={classes.processing}>
            <p className={classes.processingLeftColor}>
              We are processing your work statement request
            </p>
            {workStatementDetail?.progress === 'sent' ? (
              <p className={classes.processingCenterColor}>
                Work statement sent to you at{' '}
                {workStatementDetail?.companyEmail} on{' '}
                {moment(workStatementDetail?.sendDate)
                  .tz('Asia/Singapore')
                  .subtract(1, 'day')
                  .format('DD MMM, YYYY')}
              </p>
            ) : (
              <p className={classes.processingCenter}>
                Work statement sent to you at{' '}
                {workStatementDetail?.companyEmail} on{' '}
                {moment(workStatementDetail?.sendDate)
                  .tz('Asia/Singapore')
                  .subtract(1, 'day')
                  .format('DD MMM, YYYY')}
              </p>
            )}
            {!pain && workStatementDetail?.paidDate ? (
              <p className={classes.processingRightColor}>Payment received</p>
            ) : (
              <p className={classes.processingRight}>Payment received</p>
            )}
          </div>

          <div className={classes.formContainer}>
            <div className={DetailClasses.detailContainer}>
              <div className={DetailClasses.detailCard}>
                <h2>Transfer to</h2>
                <div className={DetailClasses.bankCard}>
                  {pain ? (
                    <label className={DetailClasses.WaitingText}>Waiting</label>
                  ) : (
                    <label
                      className={
                        workStatementDetail?.paidDate
                          ? DetailClasses.successText
                          : DetailClasses.errorText
                      }
                    >
                      {workStatementDetail?.paidDate ? '' : 'Not '}Success
                    </label>
                  )}
                  <p>
                    Please proceed with the payment in the quotation. Upon
                    successful receipt of payment, your account will be fully
                    activated
                  </p>
                  <p
                    className={DetailClasses.textnumberBank}
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'rgba(15, 105, 55, 1)',
                    }}
                  >
                    {workStatementDetail?.requestNumber}WS
                  </p>
                  <button
                    className={DetailClasses.button_dowload}
                    onClick={handleDownload}
                  >
                    Write to us
                  </button>
                </div>
                <div className={DetailClasses.table}>
                  <div>
                    <p>Package</p>
                    <p>{workStatementDetail?.Pricing?.name}</p>
                  </div>
                  <hr />
                  <div>
                    <p>Total Due</p>
                    <p>${workStatementDetail?.Pricing?.price}</p>
                  </div>
                </div>
                {pain ? (
                  <Button
                    variant="contained"
                    sx={{ textTransform: 'none', width: '100%' }}
                    onClick={hanldeCheckStatus}
                  >
                    Check payment status
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ textTransform: 'none', width: '100%' }}
                    onClick={() => router.push('/my-account')}
                  >
                    Back To Home
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
