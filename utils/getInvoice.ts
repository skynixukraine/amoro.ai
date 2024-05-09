import moment from 'moment';
interface QuotationInvoiceProps {
  selectedPrice: any;
  companyAddress: string;
  companyName: string;
  contactPerson: string;
  companyEmail: string;
}
export const getInvoiceHTMLString = ({
  selectedPrice,
  companyAddress,
  companyName,
  contactPerson,
  companyEmail,
}: QuotationInvoiceProps) => {
  const parts = contactPerson?.split(' ');
  const firstName = parts && parts.length > 0 ? parts[0] : '';
  return `
<html>
    <head>
        <meta charset="utf-8" />
        <title>Invoice</title>
        <style>
            *{
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Roboto', Arial, sans-serif;
            }
            .container{
                max-width: 600px;
                width: 100%;
                margin: 20px auto;
                overflow: hidden;
                box-shadow: 0 4px 12px 0 rgba(0,0,0,0.2);
                border-radius: 8px; 
                background: white;
                font-size: 10px;
            }
            .form_container{
                width: 100%;
                padding: 48px;
            }
            .container_quote{
                padding-bottom: 20px;
                border-bottom: 1px solid #6b7280;
                margin-bottom: 20px;
            }
            .text_quote{
                font-size: 14px;
            }
            .container_des{
                margin-bottom: 40px;
            }
            .des_box_container{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            .table_text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 10px;
            }
            .table_item{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
            }
            .first_text{
                font-weight: 400;
                margin-right: 40px;
            }
            .second_text{
                font-weight: 500;
            }

            .loog_box img {
                width: 200px;
                object-fit: cover;
            }
            .user_info{
                margin-bottom: 32px;
            }
            .text_title {    
                font-weight: 700;
                margin-bottom: 20px;
            }
            .text_user {
                color: #6B7280;
                margin-bottom: 10px;
            }
            .container_box {
                display: flex;
                flex-direction: row;
                width: 100%;
                font-weight: 500;
                padding-bottom: 20px;
                border-bottom: 1px solid #6b7280;
                margin-bottom: 20px;
            }
            .description_column {
                width: 40%;
            }
            .w-50{
                width: 50%;
            }
            .text_number{
                font-size: 12px;
            }
            .secondary_column {
                width: 20%;
                word-break: break-all;
                text-align: center;
            }
            .start {
                text-align: left;
            }
            .end {
                text-align: right;
            }
            .center {
                text-align: center;
            }
            .secondary_column.price {
                font-size: 12px;
            }
            .fill_column {
                width: 60%;
            }
            .devide {
                width: 100%;
                margin: 20px 0;
                height: 1px;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
            }
            .devide-line {
                width: 34%;
                height: 1px;
                background-color: #6b7280;
            }
            .first_row_container{
                width: 100%;
                display: flex;
                flex-direction: row;
                margin-bottom: 40px;
            }
            .secondary_row_container{
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                font-weight: 700;
            }
            .text_smart{
                font-weight: 500;
            }
            .info_container{
                margin-top: 30px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="form_container">
                <div class="container_quote">
                    <div class="text_quote">QUOTE</div>
                </div>
                <div class="container_des">
                    <div class="des_box_container">
                        <div class="loog_box">
                            <img src='/amoro-logo.png'></img>
                        </div>
                        <div class="table_text">
                            <div class="table_item">
                                <div class="first_text">QUOTE NUMBER</div>
                                <div class="second_text">${firstName}${
    selectedPrice?.name
  }${moment().format('MM/DD/YYYY')}</div>
                            </div>
                            <div class="table_item">
                                <div class="first_text">ISSUE DATE</div>
                                <div class="second_text">${moment().format(
                                  'MMM DD, YYYY'
                                )}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user_info">
                    <div class="text_title">Attention to</div>
                    <div class="text_user">${contactPerson}</div>
                    <div class="text_user">${companyName}</div>
                    <div class="text_user">${companyAddress}</div>
                    <div class="text_user">${companyEmail}</div>
                </div>
                <div class="container_box">
                        <div class="description_column">DESCRIPTION</div>
                        <div class="secondary_column">QTY</div>
                        <div class="secondary_column">UNIT PRICE</div>
                        <div class="secondary_column end">AMOUNT</div>
                </div>
                <div class="first_row_container">
                    <div class="description_column">
                        <div class="text_smart">${
                          selectedPrice?.name
                        } Package /${selectedPrice?.billing} months</div>
                    </div>
                    <div class="secondary_column">
                        <div class="text_number">1</div>
                    </div>
                    <div class="secondary_column price">
                        <div class="text_number">$${selectedPrice?.price}</div>
                    </div>
                    <div class="secondary_column end price">
                        <div class="text_number">$${selectedPrice?.price}</div>
                    </div>
                </div>
                <div class="secondary_row_container">
                    <div class="fill_column"></div>
                    <div class="secondary_column"> 
                        <div class="center">Subtotal</div>
                    </div>
                    <div class="secondary_column end">
                        <div class="text_number">$${selectedPrice?.price}</div>
                    </div>
                </div>
                <div class="devide">
                    <div class="devide-line"></div>
                </div>
                <div class="secondary_row_container">
                    <div class="fill_column"></div>
                    <div class="secondary_column"> 
                        <div class="center">Total</div>
                    </div>
                    <div class="secondary_column end">
                        <div class="text_number">$${selectedPrice?.price}</div>
                    </div>
                </div>
                <div class="info_container">
                    <div class="text_title">Payment Information</div>
                    <div class="text_user">Bank: CIMB Current Account </div>
                    <div class="text_user">Account Name: Metric Media Pte Ltd  </div>
                    <div class="text_user">Account No.: 2000936537 </div>
                    <div class="text_user">UEN: 201606983H</div>
                </div>

                <div class="info_container">
                        <div class="text_title">Address</div>
                        <div class="text_user">205 Balestier Road #02-06 Singapore 329682</div>
                </div>
            </div>
        </div>
    </body>
</html>
    `;
};
