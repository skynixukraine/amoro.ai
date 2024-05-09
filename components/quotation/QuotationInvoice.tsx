import React, { useEffect, useState } from 'react';
import classes from '@/components/quotation/QuotationInvoice.module.css';
import moment from 'moment';
interface QuotationInvoiceProps {
    selectedPrice: any;
    companyAddress: string;
    companyName: string;
    contactPerson: string;
    companyEmail: string;
    quoteNumber:string;
  }
const QuotationInvoice: React.FC<QuotationInvoiceProps> = ({selectedPrice, companyAddress, companyName, contactPerson, companyEmail, quoteNumber
  }) => {

    
    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <div className={classes.container_quote}>
                    <p className={classes.text_quote}>QUOTE</p>
                </div>
                <div className={classes.container_des}>
                    <div className={classes.des_box_container}>
                        <div className={classes.loog_box}>
                            <img src='/amoro-logo.png'></img>
                        </div>
                        <div className={classes.table_text}>
                            <div className={classes.item_text}>
                                <span>QUOTE NUMBER</span>
                                <span className={classes.number_content}>{quoteNumber}</span>
                            </div>
                            <div className={classes.item_text}>
                                <span>ISSUE DATE</span>
                                <span className={classes.date_content}>{moment().format('MMM DD, YYYY')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className={classes.text_info}>Attention to</p>
                    <p className={classes.text_user}>{contactPerson}</p>
                    <p className={classes.text_user}>{companyName}</p>
                    <p className={classes.text_user}>{companyAddress}</p>
                    <p className={classes.text_user}>{companyEmail}</p>
                </div>
                <div className={classes.container_box}>
                    <div>
                        <p>DESCRIPTION</p>
                        <p>QTY</p>
                        <p>UNIT PRICE</p>
                        <p>AMOUNT</p>
                    </div>
                </div>

                <div className={classes.smart_container}>
                    <div className={classes.item_box}>
                        <p className={classes.text_smart}>{selectedPrice?.name} Package /{selectedPrice?.billing} months</p>
                    </div>
                    <div className={classes.item_box_container}>
                        <p className={classes.text_smart_number} >1</p>
                    </div>


                    <div className={classes.smart_box_container}>
                        <div className={classes.mart_box_container_item}>
                            <p>${selectedPrice?.price}</p>
                            <p>${selectedPrice?.price}</p>
                        </div>
                        <div className={classes.sub_container}>
                            <div className={classes.sub_box}>
                                <p>Subtotal</p>
                                <p>${selectedPrice?.price}</p>
                            </div>
                            <div className={classes.sub_content}>
                                <p>Total</p>
                                <p>${selectedPrice?.price}</p>
                            </div>

                        </div>
                    </div>


                </div>
                <div className={classes.info_container}>
                    <p className={classes.text_info}>Payment Information</p>
                    <p className={classes.text_info_item}>Bank: CIMB Current Account </p>
                    <p className={classes.text_info_item}>Account Name: Metric Media Pte Ltd </p>
                    <p className={classes.text_info_item}>Account No.: 2000936537 </p>
                    <p className={classes.text_info_item}>UEN: 201606983H</p>
                </div>

                <div className={classes.info_container}>
                    <div className={classes.info_address}>
                        <p className={classes.text_info}>Address</p>
                        <p className={classes.text_info_item}>205 Balestier Road #02-06 Singapore 329682</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default QuotationInvoice;
