import React, { useState, ChangeEvent } from 'react';
import classes from '@/components/quotation/ExportQuotation.module.css';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import StyledInput from '../StyledInput';
import Link from 'next/link';
import { PriceType, WorkStatementType, FileUpload } from '@/common/types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
// import axios from 'axios';
import axios from '@/common/config';
import WorkStatementCheck from './WorkStatementCheck';
import type { PutBlobResult } from '@vercel/blob';
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

const ExclamationMarkIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_101_18037)">
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346627 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9977 5.87898 15.1541 3.8455 13.6543 2.34572C12.1545 0.845932 10.121 0.00232928 8 0ZM8 12C7.84178 12 7.68711 11.9531 7.55555 11.8652C7.42399 11.7773 7.32145 11.6523 7.2609 11.5061C7.20035 11.36 7.18451 11.1991 7.21537 11.0439C7.24624 10.8887 7.32243 10.7462 7.43432 10.6343C7.5462 10.5224 7.68875 10.4462 7.84393 10.4154C7.99911 10.3845 8.15997 10.4003 8.30615 10.4609C8.45233 10.5214 8.57727 10.624 8.66518 10.7555C8.75308 10.8871 8.8 11.0418 8.8 11.2C8.8 11.4122 8.71572 11.6157 8.56569 11.7657C8.41566 11.9157 8.21218 12 8 12ZM8.8 8.8C8.8 9.01217 8.71572 9.21565 8.56569 9.36568C8.41566 9.51571 8.21218 9.6 8 9.6C7.78783 9.6 7.58435 9.51571 7.43432 9.36568C7.28429 9.21565 7.2 9.01217 7.2 8.8V4.8C7.2 4.58783 7.28429 4.38434 7.43432 4.23431C7.58435 4.08428 7.78783 4 8 4C8.21218 4 8.41566 4.08428 8.56569 4.23431C8.71572 4.38434 8.8 4.58783 8.8 4.8V8.8Z"
        fill="#013399"
      />
    </g>
    <defs>
      <clipPath id="clip0_101_18037">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function RequestWorkStatement(props: {
  prices: Array<PriceType>;
  workStatements: Array<WorkStatementType>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { prices, workStatements } = props;
  let packageSelect = router.query?.package;

  //let availablePrices = prices.filter((price) => price.price > 0);
  let availablePrices = prices;

  let packageNumber = prices.findIndex((e) => e.name === packageSelect);

  const [selectedPrice, setSelectedPrice] = useState(
    prices[packageNumber ?? 0]
  );
  const [comment, setComment] = useState('');
  const [agreement, setAgreement] = useState<boolean>();
  const [statement, setStatement] = useState<boolean>();
  const [documents, setDocuments] = useState<boolean>();
  const [workStatement, setWorkStatement] = useState<File[]>([]);
  const [file, setFile] = useState<File[]>();
  const [selectedFiles, setSelectedFiles] = useState<FileUpload[]>([]);
  const [requestFiles, setRequestFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestNumber, setRequestNumber] = useState('');

  const hanldeGetworkStatement = (e: FileUpload[] | []) => {
    setSelectedFiles(e);
  };
  const handleImageUpload = async (file: File) => {
    let data: any = '';
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/api/upload`, {
      method: 'POST',
      body: formData,
    });
    if (response) {
      const newfile = (await response.json()) as PutBlobResult;
      if (newfile) {
        data = newfile;
      }
    }
    return data;
  };

  const handleChangePrice = (e: SelectChangeEvent<string>) => {
    const newSelectedPrice = prices.filter(
      (price) => price.name === e.target.value
    )[0];

    setSelectedPrice(newSelectedPrice);
  };
  console.log(selectedPrice);

  const handleCreateWorkStatement = async () => {
    setLoading(true);
    const email = session?.user?.email;
    if (!email) return alert('You are not authenticated');
    const urlUpload: any = [];
    const urlRequest: any = [];
    const requestNumber = `${selectedPrice.id}${
      selectedPrice.name
    }${moment().format('MM/DD/YYYY')}`;
    for (const file of selectedFiles) {
      // const { contentType, pathname, url } = await handleImageUpload(file);
      urlRequest.push(file);
    }

    for (const file of requestFiles) {
      const { contentType, pathname, url } = await handleImageUpload(file);
      urlUpload.push({ contentType, pathname, url });
    }

    const userRes = await axios.get(`/api/user/get-by-email?email=${email}`);
    await axios
      .post('/api/workStatement', {
        companyEmail: userRes.data.email,
        requestNumber,
        pricing_id: selectedPrice.id,
        user_id: userRes.data.id,
        requestFile: urlRequest,
        uploadFile: urlUpload,
        needAServices: agreement,
        needAWorkStatement: statement,
        needToSign: documents,
        comment: comment,
      })
      .then((res) => {
        setLoading(false);
        router.push(`/work-statement/${res.data.id}`);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFile(newFiles);
    if (newFiles) {
      let currentChunk = 0;
      const updateProgress = () => {
        if (currentChunk < 10) {
          currentChunk++;
          setProgress((currentChunk * 10) / 100);
          setTimeout(updateProgress, 500);
        } else {
          setProgress(1);
          setFile(undefined);
          setRequestFiles(newFiles);
        }
      };

      setTimeout(updateProgress, 100);
    }
  };

  const handleCheck = (stateSetter: any, value: any) => {
    stateSetter(value);
  };

  return (
    <div className={classes.header_container}>
      <Link href="/pricing">
        <div className={classes.header}>
          {ArrowBackIcon}
          <h1>Request work statement</h1>
        </div>
      </Link>
      <div className={classes.alert}>
        <div>
          {ExclamationMarkIcon} <span>You Request Work Statement</span>
        </div>
        <h5>
          We will send the work statement to your company email with all your
          accounts information. We will let you know when your company already
          send the payment and your accounts will upgrade automatically
        </h5>
      </div>
      <div className={classes.content_container}>
        <WorkStatementCheck
          hanldeGetworkStatement={hanldeGetworkStatement}
          workStatements={workStatements}
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
              {availablePrices.map((price) => (
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
                  {' '}
                  /{selectedPrice?.billing}month
                </span>
              </div>
            </div>
            <div className={classes.text_check}></div>

            <label>Do you need a master services agreement</label>
            <div className={classes.checkbox_container}>
              <div
                className={classes.checkbox}
                onClick={() => handleCheck(setAgreement, true)}
                style={{
                  backgroundColor: agreement === true ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>Yes</p>
              <div
                className={classes.checkbox_no}
                onClick={() => handleCheck(setAgreement, false)}
                style={{
                  backgroundColor: agreement === false ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>No</p>
            </div>

            <label>Do you need a work statement</label>
            <div className={classes.checkbox_container}>
              <div
                className={classes.checkbox}
                onClick={() => handleCheck(setStatement, true)}
                style={{
                  backgroundColor: statement === true ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>Yes</p>
              <div
                className={classes.checkbox_no}
                onClick={() => handleCheck(setStatement, false)}
                style={{
                  backgroundColor: statement === false ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>No</p>
            </div>

            <label>Do you need amoro.ai to sign any documents?</label>
            <div className={classes.checkbox_container}>
              <div
                className={classes.checkbox}
                onClick={() => handleCheck(setDocuments, true)}
                style={{
                  backgroundColor: documents === true ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>Yes</p>
              <div
                className={classes.checkbox_no}
                onClick={() => handleCheck(setDocuments, false)}
                style={{
                  backgroundColor: documents === false ? '#0F6937' : '#F9FAFB',
                }}
              >
                <div className={classes.box}></div>
              </div>
              <p>No</p>
            </div>

            <div className={classes.upload_container}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <p className={classes.text_upload}>File upload </p>
                <img src="/img/iconup.svg"></img>
              </div>

              <div className={classes.custom_input}>
                <input
                  type="file"
                  id="fileInput"
                  className={classes.fileInput}
                  multiple
                  onChange={handleFileChange}
                  placeholder=""
                />
                <img
                  src="/img/iconupload.svg"
                  className={classes.icon_upload}
                ></img>
                <div className={classes.custom_text}></div>
                <span>Drag files here to upload</span>
                <span className={classes.textupload}>or browse for files</span>
              </div>
              <div>
                <div>
                  {/* {selectedFiles && selectedFiles.map((file, index) => (
                    <div key={index} className={classes.container_file}>
                      <img src='/img/iconfile.svg'></img>
                      <div className={classes.container_textfile}>
                        <span className={classes.filename}>{file.pathname}
                        </span>
                      </div>
                      <img className={classes.progress_icon} src='/img/iconcheckprogress.svg'></img>
                    </div>
                  ))} */}
                  {requestFiles &&
                    requestFiles.map((file, index) => (
                      <div key={index} className={classes.container_file}>
                        <img src="/img/iconfile.svg"></img>
                        <div className={classes.container_textfile}>
                          <span className={classes.filename}>{file.name}</span>
                          <span className={classes.filesize}>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                        <img
                          className={classes.progress_icon}
                          src="/img/iconcheckprogress.svg"
                        ></img>
                      </div>
                    ))}
                  {file &&
                    file.map((file, index) => (
                      <div key={index} className={classes.container_file}>
                        <img src="/img/iconfile.svg"></img>
                        <p className={classes.filename}>{file.name}</p>
                        <img
                          className={classes.progress_icon}
                          src="/img/closeprogress.svg"
                        ></img>
                      </div>
                    ))}
                  <div className={classes.progress_container}>
                    {progress !== 0 && progress < 1 && (
                      <p className={classes.progress_text}>
                        {Math.round(progress * 100)}%
                      </p>
                    )}
                  </div>

                  {file && (
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        position: 'relative',
                        borderRadius: '5px',
                        marginTop: '10px',
                        marginBottom: '20px',
                        display: progress < 1 ? 'block' : 'none',
                        backgroundColor: 'rgba(229, 231, 235, 1)',
                        backgroundImage: `linear-gradient(90deg, rgba(15, 105, 55, 1) ${
                          progress * 100
                        }%, transparent ${progress * 100}%)`,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>

            <label>What documents do you need from us?</label>
            {/* <TextField
              fullWidth
              placeholder="Enter your answer"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              InputProps={{ sx: { ...styledInputPropsSx, marginBottom: '16px' } }}
            /> */}

            <textarea
              className={classes.inputbox}
              placeholder="Enter your answer"
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            {loading ? (
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                fullWidth
              >
                Submitting
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                fullWidth
                onClick={handleCreateWorkStatement}
              >
                Submit request
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
