import {
  OptimizerFormFieldType,
  ColorPreferenceType,
  FooterContentType,
} from '@/common/types';
import JSZip from 'jszip';
import { buildSpeakerTableData } from '@/components/speaker-template/OptimizerForm';
import { blobToFile, getFileExtension } from '.';

function buildTableMarkup(tableRawData: any) {
  const { heading, rows } = buildSpeakerTableData(tableRawData);
  const markup = `<table class="table speaker-table" cellpadding="0" cellspacing="0"  align="left" >
        <thead>
          <tr>
            ${heading
    .map((headingText) => `<td>${headingText}</td>`)
    .join('\n')}
          </tr>
        </thead>
        <tbody>
          ${rows
    .map(
      (row: any) =>
        `<tr>
              ${row.map((col: any) => `<td>${col}</td>`).join('\n')}
            </tr>`
    )
    .join('\n')}
        </tbody>



      </table>`;
  return markup;
}

const RowWrapper = (child: string) => {
  return `
  <table>
    <tr>
      ${child}
    </tr>
  </table>
  `
}

const Paragraph = ({ text, isWrap }: { text: string, isWrap?: boolean }) => {
  return `
  <td valign="top" ${isWrap ? "width='50%'" : ''} style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; font-weight: normal; color: #333333; text-align: left;">
    ${text && text.replaceAll('\n', '<br/>')}
  </td>
  `
}

const Image = ({ imageData, index, isWrap }: { imageData: OptimizerFormFieldType, index: number, isWrap?: boolean }) => {
  const file = imageData.image ? imageData.image : imageData.value;
  const imageActionUrl = imageData.imageActionUrl;
  let fileExtension: string = '';
  if (file) {
    if (typeof file === 'string'){
      if (file.startsWith('http')) {
        fileExtension = getFileExtension(file) || '';
      }else {
        fileExtension = file.substring(
          'data:image/'.length,
          file.indexOf(';base64')
        );
      }
    }

    if (file instanceof File) fileExtension = file.name.split('.').pop() || '';
  }
  return `
	${`<tr>
        <td valign="center" align="center">
            <a href="${imageActionUrl || '#'}" target="_blank" >
            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td style="position: relative;">
                  <img src="images/image${index}.${fileExtension}" width="450" style="width:100%; max-width:450px; display: block; height:auto;"  alt="" border="0"/>
                </td>
               </tr>
            </table>
            </a>
        </td>
      </tr>`
  }
  `
}

const Table = (tableData: OptimizerFormFieldType) => {
  let tableMarkup: string | undefined = undefined;
  tableMarkup = buildTableMarkup(tableData.value);
  return `
      <td>
        ${tableMarkup}
      </td>
  `
}

const Button = ({ cta, selectedColor }: { cta: OptimizerFormFieldType, selectedColor: string }) => {
  const ctaText =
    cta?.ctaCustomLabel && cta?.ctaCustomLabel.length > 0
      ? cta.ctaCustomLabel
      : cta?.ctaType;
  return `
  <td align="center" bgcolor="${selectedColor}" valign="middle"
  style="background-color:${selectedColor};height:35px;width:150px;border-radius: 5px;">

	  ${cta && cta.ctaAction && cta.ctaType?.length && cta.ctaType?.length > 0
    ? `<a href="${!cta.ctaAction.startsWith('http')
      ? 'https://' + cta.ctaAction
      : cta.ctaAction
    }"  target="_blank" style="display: block;
                              font-family: 'Roboto',Arial,sans-serif; background-color: ${selectedColor};
                              color: #ffffff; text-decoration: none; padding: 8px 20px; font-size: 14px; ">
${ctaText}
</a>`
    : ''
  }
	</td>
  `
}

export default async function buildCorrectVeevaMail({
                                                      emailData,
                                                      bannerImage,
                                                      bodyColorsData,
                                                      footerColorsData,
                                                      footerData,
                                                      pi,
                                                      veevaApprovalFlag,
                                                      veevaApproval,
                                                      imageWidth,
                                                      variation,
                                                      isHtml,
                                                      unsubscribeLink,
                                                      privacyPolicy
                                                    }: {
  emailData: OptimizerFormFieldType[];
  bannerImage: string | null;
  bodyColorsData: ColorPreferenceType;
  footerColorsData: ColorPreferenceType;
  footerData: Array<FooterContentType>;
  pi: string;
  veevaApprovalFlag: string;
  veevaApproval: string;
  imageWidth?: number;
  variation?: string;
  isHtml?: boolean;
  unsubscribeLink?: string;
  privacyPolicy?: string;
}) {
  let { preferredColor: bodyColor = '#000' } = bodyColorsData;
  let { preferredColor: footerColor = '#000' } = footerColorsData;

  bodyColor = bodyColor === '' || !bodyColor ? '#000' : bodyColor;
  footerColor = footerColor === '' || !footerColor ? '#000' : footerColor;

  const convertNewlinesToHtml = (text: string) => {
    return text.replace(/\n/g, '<br/>');
  };

  const colorShade = (hexColor: string, magnitude: number) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
      return hexColor;
    }
  };

  const additionalFootersHTML = footerData
    ?.map(
      (footer) =>
        `<div class="footer ${
          /*footer.isReversed*/ false ? 'swap' : 'no-swap'
        }">
          <div class="footer-img-wrapper">
            ${footer.image
          ? `<img class="footer-img" src=${footer.image instanceof Blob ? URL.createObjectURL(
            footer.image
          ) : footer.image} />`
          : ''
        }
          </div>
          <div class="footer-text">
            ${footer.text
          ? `<p class="footertext">${convertNewlinesToHtml(
            footer.text
          )}</p>`
          : ''
        }
          </div>
        </div>`
    )
    .join('');



  const zip = new JSZip();

  const subject = emailData.find((data) => data.key === 'subject')?.value;
  // const paragraph1 = emailData.find((data) => data.key === 'paragraph1')?.value;
  // const paragraph2 = emailData.find((data) => data.key === 'paragraph2')?.value;
  // const paragraph3 = emailData.find((data) => data.key === 'paragraph3')?.value;

  const referencesAndCitations = emailData.find((data) =>
    data.key.toString().startsWith('reference')
  )?.value;

  // const file1 = emailData.find(
  //   (data) => data.type === 'image' || data.type === 'imageLink'
  // )?.value;
  // const imageActionUrl = emailData.find(
  //   (data) => data.type === 'image'
  // )?.imageActionUrl;

  const mainFolder = zip.folder('email');
  const imagesZip = new JSZip();
  const imagesFolder = imagesZip.folder('images');
  if (!imagesFolder) return;

  let flushData: { idx: number , item: OptimizerFormFieldType}[] = []
  for (let idx = 0; idx < emailData.length; idx++) {
    const item = emailData[idx];

    if ((item.type === 'image' || item.type === 'imageLink') && item.value) {
      let file = item.value;
      let fileExtension: string = '';
      if (file) {
        if (typeof file === 'string') {
          if (file.startsWith('http')) {
            fileExtension = getFileExtension(String(file)) || '';
            let newBlob = await blobToFile(String(file));
            if (newBlob) {
              imagesFolder.file(`image${idx}.${fileExtension}`, newBlob);
            }
          } else {
            fileExtension = file.substring(
              'data:image/'.length,
              file.indexOf(';base64')
            );
            imagesFolder.file(
              `image${idx}.${fileExtension}`,
              file.split(',')[1],
              {
                base64: true,
              }
            );
          }
        }
      }
    }
    if (item.type === 'paragraph' && item.image) {
      let fileExtension: string = '';

      if (item.imageWidth) {
        flushData.push({ idx: idx, item: item });
      }
      if (item.image instanceof Blob || item.image instanceof File) {
        fileExtension = item.image.name.split('.').pop() || '';
        imagesFolder.file(`image${idx}.${fileExtension}`, item.image);
      } else {
        let newBlob = await blobToFile(String(item.image));
        if (newBlob) {
          fileExtension = getFileExtension(String(item.image)) || '';
          imagesFolder.file(`image${idx}.${fileExtension}`, newBlob);
        }
      }
    }
  }


  let bannerImageExtension: string = '';
  if (bannerImage) {
    let newBlob = await blobToFile(bannerImage)
    if (newBlob) {
      bannerImageExtension = getFileExtension(bannerImage) || '';
      console.log('go banner 0')
      imagesFolder.file(`banner-image.${bannerImageExtension}`, newBlob);
    }
    // bannerImageExtension = bannerImage.substring(
    //   'data:image/'.length,
    //   bannerImage.indexOf(';base64')
    // );
    // imagesFolder.file(
    //   `banner-image.${bannerImageExtension}`,
    //   bannerImage.split(',')[1],
    //   { base64: true }
    // );
  }

  let footerExtension = '';
  if (footerData[0].image) {
    if (footerData[0].image instanceof File) {
      footerExtension = footerData[0].image.name.split('.').pop() || '';
    }
    if (footerData[0].image instanceof Blob) {
      footerExtension = footerData[0].image.name.split('.').pop() || '';
      imagesFolder.file(`footer-image-0.${footerExtension}`, footerData[0].image);
    } else {
      let newBlob = await blobToFile(footerData[0].image)
      if (newBlob) {
        footerExtension = getFileExtension(footerData[0].image) || '';
        console.log('go footer 0')
        imagesFolder.file(`footer-image-0.${footerExtension}`, newBlob);
      }
    }

  }

  let selectedColor = bodyColor;

  // const speakersData = emailData.filter(
  //   (data) => data.type === 'table' && data.value?.length > 0
  // );
  // let tableMarkup: string | undefined = undefined;
  // if (speakersData.length > 0)
  //   tableMarkup = speakersData.map((data) => buildTableMarkup(data.value))[0];

  // const cta = emailData.find((data) => data.type === 'cta');

  // const ctaText =
  //   cta?.ctaCustomLabel && cta?.ctaCustomLabel.length > 0
  //     ? cta.ctaCustomLabel
  //     : cta?.ctaType;
  let deleteIdx: number[] = []
  let paragraphLayout: { ui: string, index: number }[] = []
  emailData.forEach((item, idx) => {
    if (item.type === 'paragraph' && item.value && item.value !== '' && item.key !== 'referenceText') {
      if (variation == 'variation2') {
        if (
          item.image &&
          emailData[idx + 1] &&
          emailData[idx + 1].type === 'cta' &&
          emailData[idx + 1].label &&
          emailData[idx + 1].ctaType &&
          emailData[idx + 1].ctaAction
        ) {
          let itemUI = `
          ${Paragraph({ text: item.value, isWrap: true })}
          <td valign="top" width='5%'></td>
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({ imageData: item, index: idx, isWrap: true })} })}
              <tr>
                <td height="20"></td>
              </tr>
              <tr>
                <td valign="top" align="center">
                  <table border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        ${Button({ cta: emailData[idx + 1], selectedColor: selectedColor })}
                      </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
          deleteIdx.push(idx + 1)
        } else if (
          emailData[idx + 1] &&
          (emailData[idx + 1].type === 'image' ||
            emailData[idx + 1].type === 'imageLink') &&
          emailData[idx + 1].value &&
          emailData[idx + 1].value != '' &&
          !deleteIdx.includes(idx + 1) &&
          emailData[idx + 2] &&
          emailData[idx + 2].type === 'cta' &&
          emailData[idx + 2].label &&
          emailData[idx + 2].ctaType &&
          emailData[idx + 2].ctaAction &&
          !deleteIdx.includes(idx + 2)
        ) {
          let itemUI = `
          ${Paragraph({ text: item.value, isWrap: true })}
          <td valign="top" width='5%'></td>
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({ imageData: emailData[idx + 1], index: idx + 1, isWrap: true })}
              <tr>
                <td height="20"></td>
              </tr>
              <tr>
                <td valign="top" align="center">
                  <table border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        ${Button({ cta: emailData[idx + 2], selectedColor: selectedColor })}
                      </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
          deleteIdx.push(idx + 1)
          deleteIdx.push(idx + 2)
        } else if (
          emailData[idx - 2] &&
          (emailData[idx - 2].type === 'image' ||
            emailData[idx - 2].type === 'imageLink') &&
          emailData[idx - 2].value &&
          emailData[idx - 2].value != '' &&
          !deleteIdx.includes(idx - 2) &&
          emailData[idx - 1] &&
          emailData[idx - 1].type === 'cta' &&
          emailData[idx - 1].label &&
          emailData[idx - 1].ctaType &&
          emailData[idx - 1].ctaAction &&
          !deleteIdx.includes(idx - 1)
        ) {
          let itemUI = `
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({ imageData: emailData[idx - 2], index: idx - 2, isWrap: true })} })}
              <tr>
                <td height="20"></td>
              </tr>
              <tr>
                <td valign="top" align="center">
                  <table border="0" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        ${Button({ cta: emailData[idx - 1], selectedColor: selectedColor })}
                      </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
          <td valign="top" width='5%'></td>
          ${Paragraph({ text: item.value, isWrap: true })}
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
          deleteIdx.push(idx - 1)
          deleteIdx.push(idx - 2)
        }
      }
      if (variation === 'variation1' || variation === 'variation2') {
        if (item.image) {
          let itemUI = `
          ${Paragraph({ text: item.value, isWrap: true })}
          <td valign="top" width='5%'></td>
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({ imageData: item, index: idx, isWrap: true })} })}
            </table>
          </td>
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
        } else if (
          emailData[idx + 1] &&
          (emailData[idx + 1].type === 'image' ||
            emailData[idx + 1].type === 'imageLink') &&
          emailData[idx + 1].value &&
          emailData[idx + 1].value != '' &&
          !deleteIdx.includes(idx + 1)
        ) {
          let itemUI = `
          ${Paragraph({ text: item.value, isWrap: true })}
          <td valign="top" width='5%'></td>
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({
            imageData: emailData[idx + 1],
            index: idx + 1,
            isWrap: true,
          })}
            </table>
          </td>
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
          deleteIdx.push(idx + 1);
        } else if (
          emailData[idx - 1] &&
          (emailData[idx - 1].type === 'image' ||
            emailData[idx - 1].type === 'imageLink') &&
          emailData[idx - 1].value &&
          emailData[idx - 1].value != '' &&
          !deleteIdx.includes(idx - 1)
        ) {
          let itemUI = `
          <td valign="center" align="center" width="45%"}>
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({
            imageData: emailData[idx - 1],
            index: idx - 1,
            isWrap: true
          })}
            </table>
          </td>
          <td valign="top" width='5%'></td>
          ${Paragraph({ text: item.value, isWrap: true })}
          `;
          let paragraphUI = `
          <tr>
            <td>
              ${RowWrapper(itemUI)}
            </td>
          </tr>
          `;
          paragraphLayout.push({ ui: paragraphUI, index: idx });
          deleteIdx.push(idx - 1);
        }
      }
    }
  });


  const contentData = emailData.map(
    (item, idx) => {
      if (item.type === "paragraph" && item.key !== 'referenceText' && item.value) {
        const paragraphData = paragraphLayout.find((item) => item.index === idx)
        if (paragraphData) {
          return paragraphData.ui
        }
        if (item.image) {
          return `<tr> ${Paragraph({ text: item.value })} </tr>
                  <tr>
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td valign="center" align="center">
                      <table border="0" cellspacing="0" cellpadding="0" align="center">
                        ${Image({ imageData: item, index: idx })}
                      </table>
                    </td>
                  </tr>`
        }
        return `<tr> ${Paragraph({ text: item.value })} </tr>`
      } else if ((item.type === "image" || item.type === "imageLink") && item.value && !deleteIdx.includes(idx)) {
        return `
        <tr>
          <td valign="center" align="center">
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({ imageData: item, index: idx })}
            </table>
          </td>
        </tr>
        `
      } else if (item.type === 'cta' && item.ctaAction && !deleteIdx.includes(idx)) {
        return `
        <tr>
          <td valign="top" align="center">
            <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  ${Button({ cta: item, selectedColor: selectedColor })}
                </tr>
            </table>
          </td>
        </tr>
        `;
      } else if (item.type === 'table' && item.value.length > 0) {
        return `
        <tr>
          ${Table(item)}
        </tr>
        `
      }
    }
  )
  const contentDataMobile = emailData.map(
    (item, idx) => {
      if (item.type === "paragraph" && item.key !== 'referenceText' && item.value) {
        if (item.image) {
          return `<tr> ${Paragraph({text : item.value})} </tr>
                  <tr>
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td valign="center" align="center">
                      <table border="0" cellspacing="0" cellpadding="0" align="center">
                        ${Image({imageData: item, index: idx})}
                      </table>
                    </td>
                  </tr>`
        }
        return `<tr> ${Paragraph({text : item.value})} </tr>`
      } else if ((item.type === "image" || item.type === "imageLink") && item.value){
        return `
        <tr>
          <td valign="center" align="center">
            <table border="0" cellspacing="0" cellpadding="0" align="center">
              ${Image({imageData: item, index: idx})}
            </table>
          </td>
        </tr>
        `
      } else if (item.type === 'cta' && item.ctaAction){
        return `
        <tr>
          <td valign="top" align="center">
            <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  ${Button({ cta: item, selectedColor: selectedColor })}
                </tr>
            </table>
          </td>
        </tr>
        `;
      } else if(item.type === 'table' && item.value.length > 0){
        return `
        <tr>
          ${Table(item)}
        </tr>
        `
      }
    }
  )

  const html = `
    <!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG />
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta http-equiv="x-ua-compatible" content="IE=edge">
<meta name="format-detection" content="date=no">
<meta name="format-detection" content="address=no">
<meta name="format-detection" content="telephone=no">
<meta name="x-apple-disable-message-reformatting">

<title>Email Preview</title>

<style type="text/css">

body 							{ padding: 0 !important; margin: 0 !important; display: block !important; min-width: 100% !important; width: 100% !important; -webkit-text-size-adjust: none; -ms-text-size-adjust: none; }

.ReadMsgBody 					{ width: 100%; }
.ExternalClass 					{ width: 100%; }
.ExternalClass * 				{ line-height: 100%; }
table, td 						{ mso-table-lspace: 0pt; mso-table-rspace: 0pt}
img 							{ -ms-interpolation-mode: bicubic; outline: none; display: block; border: 0;}
body, table, td 				{ -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
a[x-apple-data-detectors] 		{ color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
th 								{ font-weight: normal; }
p 								{ padding: 0 !important; margin: 0 !important; }
#outlook a 						{ padding: 0; }
a[href^=tel], a[href^=sms] 		{ color: inherit; cursor: default; text-decoration: none; }
sup 							{ font-size: 0.6em; vertical-align: 0.5em; line-height: 1em; }
.mcnPreviewText 				{ display: none !important; }
body, .bodyTable 				{
            width: 100% !important;
}
@media screen and (min-device-width: 768px) {
            body, .bodyTable {
                margin: auto;
                width: 50% !important;
            }
        }

.play-button                    {width:50px;height:auto;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
.table                          {width: 100%;box-sizing: border-box;}
.table tbody td                 {font-size: 15px;padding: 6px 8px;}
.speaker-table tr td:nth-child(1) {width: 70%;}
.speaker-table                  {border-bottom: 1px solid  ${colorShade(
    bodyColor,
    100
  )};margin: 10px 0; border-spacing: 2px;}

.speaker-table thead td         {padding: 8px}
.speaker-table thead tr         {color: #fff;background: ${bodyColor};font-weight: bold;}

.speaker-table tbody tr:nth-of-type(odd) {background: #efefef;/* background: ${colorShade(
    bodyColor,
    200
  )}; */}

.speaker-table tbody tr:nth-of-type(even) {background: #ffffff;/*  background: ${colorShade(
    bodyColor,
    100
  )}; */}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .wd-30 {
    width: 30px !important;
  }
  .wd-20 {
    width: 20px !important;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}

@media only screen and (max-device-width: 768px), only screen and (max-width: 768px) {

.mobilewrap 					{ width: 100% !important; min-width: 100% !important; height: auto !important; }
.container 						{ width: 100% !important; min-width: 100% !important; }
.stack 							{ display: block !important; width: 100% !important; text-align: center !important; padding: 0px !important; }

${flushData
    .map((item, index) => {
      return `.fluid${item.idx} {
      width: 100% !important;
      max-width: ${item.item.imageWidth}px !important;
      height: auto !important;
  }
  `;
    })
    .join('')}
.wd-30 							{ width: 30px !important; }
.wd-20 							{ width: 20px !important; }
.wd-auto 						{ width: 100% !important; }
.h-20 							{ height: 20px !important; }
.fs-14 							{ font-size: 14px !important; line-height: 18px !important;}
.m-px-20 						{ padding-left: 20px !important; padding-right: 20px !important; }
/*Editable Style*/

}

a:-webkit-any-link{
    text-decoration: none !important;
}

</style>

<!--[if gte mso 9]>
<style>
sup { font-size:100% !important;}
</style>
<![endif]-->
</head>

<body class="body" style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; -webkit-text-size-adjust:none; font-family: Helvetica, Arial, sans-serif; ">


<!--[if mso]>
<table role="presentation" align="center" style="width:700px;">
    <tr>
        <td style="padding:20px 0;">
<![endif]-->
<div class="outer" style="width:96%;max-width:700px;margin:20px auto;">
    <!--Start Super Subject Line-->
<span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">
${subject}
</span>
<!--End Super Subject Line-->

<table border="0" cellspacing="0" cellpadding="0" class="bodyTable" align="center">
<tr><td align="center" valign="top">
<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobilewrap" align="center">
<tr>
    <td height="20"></td>
</tr>
<tr><td valign="top" align="center" bgcolor="#ffffff" class="container" style="background-color: #ffffff; width:600px; min-width:600px;  margin:0;  padding:0px;">

<!--Start Content Table-->
<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">

<!--Start Subject & super Subject Line-->
<tr>
<td height="20"></td>
</tr>
<!--End Subject & super Subject Line-->

<!--Start Content-->
<tr>
  <td valign="top">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="20"></td>
        <td valign="top">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" ${!variation || variation !== 'origin' ? "class='desktop-only'" : ""}>
            ${bannerImage ?
    `<tr>
                  <td valign="top" align="center" style="position: relative;">
                    <img src="images/banner-image.${bannerImageExtension}" width="700" alt="" style="width:100%; max-width: 700px;height: auto; display: block;" border="0"/>
                  </td>
                </tr>`
    : ''
  }
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 24px; line-height: 28px; color: ${selectedColor}; text-align: left;">${subject}</td>
            </tr>
            ${contentData.join(`
              <tr>
                 <td height="20"></td>
              </tr>
              `)
  }
            <tr>
              <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 18px; font-weight: normal; color: #333333; text-align: left;${referencesAndCitations ? 'border-top: 14px solid transparent;' : ''}">
                ${referencesAndCitations ? `${referencesAndCitations.replaceAll('\n', '<br/>')}` : ''}
              </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td valign="top">
	          ${footerData[0].text.length > 0 || footerData[0].image
    ? `<table width="100%" border="0" cellspacing="0" cellpadding="0">
		                <tr>
		                  <th valign="middle" align="center" width="140" style="width: 140px;" >
                      ${footerExtension
      ? `<img src="images/footer-image-0.${footerExtension}" width="140" height="auto" alt="" style="display: block; margin: 0 auto;" border="0"/>`
      : ''
    }</th>
		                  <th width="10"></th>
		                  <th valign="middle"  style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 18px; font-weight: normal; color: ${footerColor}; text-align: left;">
                      ${footerData[0].text.replaceAll('\n', '<br/>')}
                      </th>
		                </tr>
	              </table>`
    : ''}
              </td>
            </tr>
          </table>
          ${
    variation !== 'origin' || !variation ?
      `
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-only">
            ${bannerImage ?
        `<tr>
                  <td valign="top" align="center">
                    <img src="images/banner-image.${bannerImageExtension}" alt="" width="700" style="width:100%; max-width:700px; height: auto; display: block; " border="0"/>
                  </td>
                </tr>`
        : ''
      }
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 24px; line-height: 28px; font-weight: bold; color: ${selectedColor}; text-align: left;">${subject}</td>
            </tr>
            ${contentDataMobile.join(`
              <tr>
                 <td height="20"></td>
              </tr>
              `)
      }
            <tr>
              <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 18px; font-weight: normal; color: #333333; text-align: left;${referencesAndCitations ? 'border-top: 14px solid transparent;' : ''}">
                ${referencesAndCitations ? `${referencesAndCitations.replaceAll('\n', '<br/>')}` : ''}
              </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td valign="top">
	          ${footerData[0].text.length > 0 || footerData[0].image
        ? `<table width="100%" border="0" cellspacing="0" cellpadding="0">
		                <tr>
		                  <th valign="middle" align="center" width="140" style="width: 140px;" >
                      ${footerExtension
          ? `<img src="images/footer-image-0.${footerExtension}" width="140" height="auto" alt="" style="display: block; margin: 0 auto;" border="0"/>`
          : ''
        }</th>
		                  <th width="10"></th>
		                  <th valign="middle"  style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 18px; font-weight: normal; color: ${footerColor}; text-align: left;">
                      ${footerData[0].text.replaceAll('\n', '<br/>')}
                      </th>
		                </tr>
	              </table>`
        : ''}
              </td>
            </tr>
          </table>
            `:``
  }
	      </td>
        <td height="20"></td>
      </tr>
	    <tr>
	    <td height="20"></td>
      </tr>
	  </table>
  </td>
</tr>
</table>
<!--End Content-->
<tr>
<td height="20"></td>
</tr>
<tr>
  <td height="20"></td>
</tr>
${pi.length > 0
    ? `<tr><td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 9px; line-height: 13px; font-weight: normal; text-align: left; padding: 20px 20px;" class="m-px-20">${pi}</td></tr><tr><td valign="top" align="center" style="padding: 30px 30px;" class="m-px-20">`
    : ''
  }
	<table width="100%" style="background-color: #ffffff" border="0" cellspacing="0" cellpadding="0" class="wd-auto" align="center">
		<tr><td valign="top" align="center">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" class="wd-auto" style="background-color: #ffffff">
		<tr style="background-color: ${selectedColor};"><td height="20"></td></tr>
		<tr><td height="20"></td></tr>
		<tr>
		${privacyPolicy ? `<td valign="center" height='30' style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 18px; font-weight: normal; text-align: center;"><a href="${unsubscribeLink}" target="_blank" style="text-decoration: underline;color:#000">Unsubscribe</a></td>` : ''}

		${unsubscribeLink ? `<td valign="center" height='30' style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 18px; font-weight: normal; text-align: center; padding-left: 10px"><a href="${privacyPolicy}" target="_blank" style="text-decoration: underline;color:#000">Privacy&nbsp;Policy</a></td>` : ''}
		</tr>
		</table>
		</td>
		</tr>
		<tr><td height="20"></td></tr>
		<tr align="center">
		  <td valign="top" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 18px; font-weight: normal; color: #333333; text-align: center;">${veevaApproval}</td></tr>
	</table>
	</td></tr>

<tr>
  <td height="20"></td>
</tr>
</table>
<!--End Content Table-->

</td></tr>
</table>
</div>
<!--[if mso]>
</td>
</tr>
</table>
<![endif]-->

</body>

</html>
    `;
  //console.log(html)
  const imagesContent = await imagesZip.generateAsync({ type: 'blob' });
  mainFolder?.file('images.zip', imagesContent);
  mainFolder?.file('index.html', html);
  const mainContent = await zip.generateAsync({ type: 'blob' });
  //if(isHtml) return html;
  return mainContent;
}
