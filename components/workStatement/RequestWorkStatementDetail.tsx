import React from 'react';
import classes from '@/components/quotation/ExportQuotation.module.css';
import {
    Button,
} from '@mui/material';
import Link from 'next/link';
import WorkStatementCheck from './WorkStatementCheck';
import { WorkStatementType, FileUpload } from '@/common/types';
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


interface TypeProp {
    hanldeSetCheck: () => void;
    workStatement: WorkStatementType;
}

const RequestWorkStatementDetail: React.FC<TypeProp> = (props) => {
    const { hanldeSetCheck, workStatement } = props;
    const hanldeGetworkStatement = (e: FileUpload[] | []) => {
    }


    return (
        <div className={classes.header_container}>
            <Link href="/pricing">
                <div className={classes.header}>
                    {ArrowBackIcon}
                    <h1>Request work statement Detail</h1>
                </div>
            </Link>

            <div className={classes.pending_container}>
                    <img src='/img/pendingwork.svg' className={classes.img_work}></img>
                <div className={classes.pending_cad}></div>
                    <img src='/img/pendingpayment.svg' className={classes.img_work}></img>
                <div className={classes.pending_cad}></div>
                    <img src='/img/payment.svg' className={classes.img_work}></img>
            </div>
            <div className={classes.processing}>
            <p className={classes.processingLeft}>We are processing your work statement request</p>
            <p className={classes.processingCenter}>Work statement sent to you at {workStatement?.companyEmail} on {moment(workStatement?.sendDate).format('DD MMM, YYYY')}</p>
            <p className={classes.processingRight}>Payment received</p>
            </div>

            <div className={classes.content_container}>
                <WorkStatementCheck hanldeGetworkStatement={hanldeGetworkStatement} isDetail workStatement={workStatement} />
                <div className={classes.content_detail}>

                    <div className={classes.formContainer}>

                        <p className={classes.title_package}>Statement</p>

                        <div className={classes.box_border}></div>
                        <div className={classes.text_container}>
                            <p className={classes.text_detail}>Package</p>
                            <p className={classes.text_detail}>Smart Package</p>

                        </div>
                        <div className={classes.box_border}></div>
                        {workStatement?.needAServices &&
                            <>
                                <div className={classes.text_container}>
                                    <p className={classes.text_detail_title}>Do you need a master services agreement</p>
                                    <p className={classes.text_detail}>Yes</p>
                                </div>
                                <div className={classes.box_border}></div>
                            </>
                        }
                        {workStatement?.needAWorkStatement &&
                            <>
                                <div className={classes.text_container}>
                                    <p className={classes.text_detail_title}>Do you need a work statement</p>
                                    <p className={classes.text_detail}>Yes</p>
                                </div>
                                <div className={classes.box_border}></div>
                            </>
                        }
                        {workStatement?.needToSign &&
                            <>
                                <div className={classes.text_container}>
                                    <p className={classes.text_detail_title}>Do you need Amoro to sign any documents?</p>
                                    <p className={classes.text_detail}>Yes</p>

                                </div>
                                <div className={classes.box_border}></div>
                            </>
                        }

                        <div className={classes.upload_container}>

                            <div style={{ display: "flex", gap: "8px" }}>
                                <p className={classes.text_upload}>File upload </p>
                                <img src='/img/iconup.svg'></img>
                            </div>

                            <div>
                                <div>
                                    {workStatement && workStatement.uploadFile?.map((file, index) => (
                                        <div key={index} className={classes.container_file}>
                                            <img src='/img/iconfile.svg'></img>
                                            <p className={classes.filename}>{file.pathname}
                                            </p>
                                            <img className={classes.progress_icon} src='/img/iconcheckprogress.svg'></img>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>


                        <label>What documents do you need from us?</label>
                        <div className={classes.inputbox}>{workStatement?.comment}</div>
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                            fullWidth
                            onClick={hanldeSetCheck}
                        >
                            Check status
                        </Button>
                    </div>
                </div>
            </div>

        </div >
    );
}
export default RequestWorkStatementDetail
