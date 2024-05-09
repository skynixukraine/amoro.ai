import { buildSpeakerTableData } from '@/components/speaker-template/OptimizerForm';
import {
  ColorPreferenceType,
  EmailContent,
  FooterContentType,
  OptimizerFormFieldType,
  SpeakerFormValuesType,
  StandardFormValuesType,
} from './../common/types/index';
import { PutBlobResult } from '@vercel/blob';
import getCorrectVeevaMail from './getCorrectVeevaMail';
import axios from 'axios';
import { e } from '@vercel/blob/dist/put-fca5396f';

export function saveToSessionStorage(key: string, data: any) {
  window.sessionStorage.setItem(key, JSON.stringify(data));
}

export function fetchFromSessionStorage(key: string) {
  const data: any = window.sessionStorage.getItem(key);
  return JSON.parse(data);
}

export function deleteFromSessionStorage(key: string) {
  window.sessionStorage.removeItem(key);
}

export async function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result); // Get the base64 data part
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const blobToFile = async (blobUrl: string) => {
  if (!blobUrl) return;
  const response = await fetch(blobUrl);
  // Check if the response is successful
  if (!response.ok) {
    console.log(`HTTP error! Status: ${response.status}`)
    return null;
  }
  const fileBlob = await response.blob();
  return fileBlob;
}
/*
export const addPlayIconAndOverlay = async (imageFile: File, playIconURL: string = '/play.png'): Promise<File> => {
  const image = await loadImage(URL.createObjectURL(imageFile));
  const playIcon = await loadImage(playIconURL);

  const canvas = createCanvas(image.width, image.height); // Set canvas dimensions
  const context = canvas.getContext('2d');

  context.drawImage(image, 0, 0, canvas.width, canvas.height);


  // Apply a shadow to the image
  context.shadowColor = 'rgba(0, 0, 0, 0.3)';
  context.shadowBlur = 10;
  context.shadowOffsetX = 5;
  context.shadowOffsetY = 5;

  // Overlay black with 0.4 opacity
  context.fillStyle = 'rgba(0, 0, 0, 0.4)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the play icon at the center of the image
  const iconSize = 60; // Set the size of the play icon
  const iconX = (canvas.width - iconSize) / 2;
  const iconY = (canvas.height - iconSize) / 2;
  context.drawImage(playIcon, iconX, iconY, iconSize, iconSize);

  // Convert the canvas back to a File object
  // @ts-ignore
  const blob = await new Promise<Blob>((resolve) => canvas?.toBlob(resolve));
  return new File([blob], imageFile.name, { type: blob.type });
};*/

export const onImageVideoUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://amoroimage.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.arrayBuffer();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const onImageUpload = async (file?: File | string | null, version?: string) => {
  if (!file) return;
  const formData = new FormData();

  if (version === 'v2') {
    const arrayBuffer = await onImageVideoUpload(file as File);
    // Convert the ArrayBuffer to a Blob
    const blob = new Blob([arrayBuffer || '']);

    // Convert the Blob to a File
    const fileFromBuffer = new File([blob], (file as File).name, { type: 'image/png' });

    console.log(fileFromBuffer);
    formData.append('file', fileFromBuffer);
  } else {
    formData.append('file', file);

  }

  const response = await fetch(
    `/api/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );
  if (response) {
    const blogFile = (await response.json()) as PutBlobResult;
    return blogFile.url;
  }

}

export function getFileExtension(url: string) {
  const parts = url.split('.');
  if (parts.length === 0) {
    return null; // URL doesn't have an extension
  }
  const lastPart = parts[parts.length - 1];
  return lastPart.toLowerCase(); // Return the extension in lowercase
}

export function convertArrayOfObjectsToCsv(data: Array<any>) {
  const columns = Object.keys(data[0]);

  let resultString = columns.join(',') + '\n';

  for (let row of data) {
    resultString += columns.map((col) => row[col]) + '\n';
  }

  const csvContent = resultString;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const href = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = href;
  a.download = 'document.csv';

  a.click();
}

export async function getVeevaZipFile(
  pi: string,
  templateData: any,
  veevaApprovalFlag: string,
  veevaApproval: string,
  imageWidth: number,
) {
  const {
    optimizer: { formData: emailData },
    layout: {
      banner: { imgUrl: bannerImage },
    },
  } = templateData;

  const { body: bodyColorsData, footer: footerColorsData } = templateData?.layout;

  const veevaZipFile = await getCorrectVeevaMail({
    emailData,
    bannerImage,
    bodyColorsData,
    footerColorsData,
    footerData: (templateData.formData as StandardFormValuesType).footers,
    pi,
    veevaApprovalFlag,
    veevaApproval,
    imageWidth: imageWidth | 300,
    variation: templateData.layout.variation
  });
  return veevaZipFile;
}

export function convertEmailContentIntoOptimizerFields(
  email: string,
  contents: Array<EmailContent>,
  otherFields: Array<OptimizerFormFieldType> = []
) {
  let referenceText,
    optimizerFormData: Array<OptimizerFormFieldType> = [];

  const subjectLine = email.match(/Subject\s*:\s*(.*)/i);

  if (subjectLine) {
    const subject = subjectLine[1];
    const emailBody = email
      .substring((subjectLine.index ?? 0) + subjectLine[0].length)
      .replace('Subject: ', '')
      .trim();
    const paragraphs = emailBody.split(/\n\s*\n/);

    const referenceIndex = paragraphs.findIndex(
      (paragraph: string) =>
        paragraph.startsWith('References:') ||
        paragraph.startsWith('Reference:') ||
        paragraph.startsWith('reference:') ||
        paragraph.startsWith('references:') ||
        paragraph.startsWith('Sources:') ||
        paragraph.startsWith('Source:') ||
        paragraph.startsWith('sources:') ||
        paragraph.startsWith('source:')
    );

    const totalParagraphs =
      referenceIndex !== -1 ? referenceIndex : paragraphs.length;

    const paragraphsPerVar = Math.ceil(totalParagraphs / 2);
    const paragraph1 = paragraphs.slice(0, paragraphsPerVar).join('\n\n');
    // const paragraph2 = paragraphs.slice(paragraphsPerVar, paragraphsPerVar * 2).join('\n\n')
    const paragraph2 = paragraphs
      .slice(paragraphsPerVar, totalParagraphs)
      .join('\n\n');

    if (referenceIndex !== -1) {
      referenceText = paragraphs.slice(referenceIndex).join('\n\n');
    }

    optimizerFormData = [
      {
        type: 'subject',
        key: 'subject',
        label: 'Subject Line',
        value: subject,
        comments: '',
      },
      {
        type: 'paragraph',
        key: 'paragraph1',
        label: 'Paragraph 1',
        value: paragraph1,
        image:
          contents.length > 0 && contents[0].image
            ? contents[0].image
            : undefined,
        imageActionUrl: contents.length > 0 ? contents[0].imgUrl : undefined,
        imageWidth: 300,
        comments: '',
      },
      ...otherFields,
      {
        type: 'paragraph',
        key: 'paragraph2',
        label: 'Paragraph 2',
        image:
          contents.length > 1 && contents[1].image
            ? contents[1].image
            : undefined,
        imageActionUrl: contents.length > 1 ? contents[1].imgUrl : undefined,
        imageWidth: 300,
        value: paragraph2,
        comments: '',
      },
      // ...(ctaData||[]).map(({ctaType, ctaAction}, index) => ({
      //   type: 'cta',
      //   key: index,
      //   value: '',
      //   label: 'Call to action ' + (index+1),
      //   ctaType,
      //   ctaAction,
      // })),
      // {
      //   type: 'paragraph',
      //   key: 'paragraph3',
      //   label: 'Paragraph 3',
      //   value: paragraph3,
      //   comments: ''
      // },
      {
        type: 'paragraph',
        key: 'referenceText',
        label: 'References & Citations',
        value: referenceText,
        comments: '',
      },
    ];
  }
  return optimizerFormData.map((data) => {
    // Remove incomplete sentence
    if (data.value && data.type == 'paragraph') {
      const lastIndex = data.value.lastIndexOf('.');
      data.value.substring(0, lastIndex + 1);
    }
    return data;
  });
}

export function buildEmailTemplateMarkup({
  emailData,
  bannerImage,
  bodyColorsData,
  footerColorsData,
  footerData,
  pi,
  veevaApprovalFlag,
  veevaApproval,
  imageWidth,
  theme,
  previewMode,
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
  theme?: string;
  previewMode?: string;
  unsubscribeLink?: string;
  privacyPolicy?: string;
}) {
  let { preferredColor: bodyColor = '#000' } = bodyColorsData;
  let { preferredColor: footerColor = '#000' } = footerColorsData;
  const footerText = footerData[0]?.text;
  const footerImage = footerData[0]?.image;
  bodyColor = bodyColor === '' || !bodyColor ? '#000' : bodyColor;
  footerColor = footerColor === '' || !footerColor ? '#000' : footerColor;

  const convertNewlinesToHtml = (text: string) => {
    return text.replace(/\n/g, '<br/>');
  };

  const additionalFootersHTML = footerData
    .slice(1)
    ?.map(
      (footer) =>
        `<div class="footer ${
          /*footer.isReversed*/ false ? 'swap' : 'no-swap'
        }">
      <div class="footer-img-wrapper">
        ${(footer.image)
          ? `<img class="footer-img" src=${footer.image instanceof Blob ? URL.createObjectURL(
            footer.image
          ) : footer.image} />`
          : ''
        }
      </div>
      <div class="footer-text">
        ${footer.text
          ? `<p class="footertext">${convertNewlinesToHtml(footer.text)}</p>`
          : ''
        }
      </div>
    </div>`
    )
    .join('');

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

  // Banner Image markup
  let banner = bannerImage
    ? `<img src="${bannerImage}" alt="Uploaded Banner" style="margin-bottom:20px"/><br>`
    : '';
  // const ctaCount = emailData.reduce((accumulator: number, ele: OptimizerFormFieldType) => accumulator + (ele.type === 'cta' ? 1 : 0), 0);

  const createImageUI = (item: OptimizerFormFieldType) => {
    const thumbnailUrl = item.imageActionUrl?.startsWith('http')
      ? item.imageActionUrl
      : `http://${item.imageActionUrl}`;
    return thumbnailUrl
      ? `
    <a href=${thumbnailUrl} target='_blank' style="display: flex;  position:relative; justify-content: center; align-items: center; background:blue">
      <img class="thumbnail" src='${item.value}' />
    </a>`
      : `<img src='${item.value}' />`;

  }
  let layoutItem: { idx: number; UI: string }[] = [];
  let deleteIndex: number[] = [];
  emailData.forEach((item, index) => {
    if (item.type === 'paragraph' && item.value && item.value !== '') {
      if (theme == 'variation2') {
        if (
          emailData[index + 1] &&
          emailData[index + 1].type === 'cta' &&
          emailData[index + 1].label &&
          emailData[index + 1].ctaType &&
          emailData[index + 1].ctaAction &&
          item.image
        ) {
          const url = emailData[index + 1].ctaAction?.startsWith('http')
            ? emailData[index + 1].ctaAction
            : `http://${emailData[index + 1].ctaAction}`;

          let button = `<div class='container'>
            <div class="cta-wrapper">
              <a class='cta-link' href="${url}" target="_blank">${emailData[index + 1].ctaCustomLabel || emailData[index + 1].ctaType}</a>
            </div>
          </div>`;

          const file = `<a href="${item.imageActionUrl?.startsWith('http') ? item.imageActionUrl : 'http://' + item.imageActionUrl}" target="_blank">
              <img src="${item.image instanceof Blob ? URL.createObjectURL(item.image) : item.image}" alt="Uploaded File ${index}" class=${`img-uploaded`} />
            </a>`;
          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              <p>${convertNewlinesToHtml(item.value)}</p>
            </div>
            <div class="flex-column">
              <div class="${`img-container-` + index}">${file}</div>
              ${button}
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index + 1)
        } else if (
          emailData[index + 1] &&
          emailData[index + 1].type === 'image' &&
          emailData[index + 1].value &&
          emailData[index + 1].value != '' &&
          !deleteIndex.includes(index + 1) &&
          emailData[index + 2].type === 'cta' &&
          emailData[index + 2].label &&
          emailData[index + 2].ctaType &&
          emailData[index + 2].ctaAction &&
          !deleteIndex.includes(index + 2)
        ) {
          //init button action
          const url = emailData[index + 2].ctaAction?.startsWith('http')
            ? emailData[index + 2].ctaAction
            : `http://${emailData[index + 2].ctaAction}`;

          let button = `<div class='container'><div class="cta-wrapper"><a class='cta-link' href="${url}" target="_blank">${emailData[index + 2].ctaCustomLabel || emailData[index + 2].ctaType
            }</a></div></div>`;
          //init image
          let imageUI = createImageUI(emailData[index + 1]);
          //init paragraph
          let paragraphUI = `<div class="flex-container">
                <div class="flex-column">
                  <p>
                    ${convertNewlinesToHtml(item.value)}
                  </p>
                </div>
                <div class="flex-column">
                  ${imageUI}
                  ${button}
                </div>
              </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index + 1);
          deleteIndex.push(index + 2);
        } else if (
          emailData[index - 2] &&
          emailData[index - 2].type === 'image' &&
          emailData[index - 2].value &&
          emailData[index - 2].value != '' &&
          !deleteIndex.includes(index - 2) &&
          emailData[index - 1].type === 'cta' &&
          emailData[index - 1].label &&
          emailData[index - 1].ctaType &&
          emailData[index - 1].ctaAction &&
          !deleteIndex.includes(index - 1)
        ) {
          //init button action
          const url = emailData[index - 1].ctaAction?.startsWith('http')
            ? emailData[index - 1].ctaAction
            : `http://${emailData[index - 1].ctaAction}`;

          let button = `<div class='container'><div class="cta-wrapper"><a class='cta-link' href="${url}" target="_blank">${emailData[index - 1].ctaCustomLabel || emailData[index - 1].ctaType
            }</a></div></div>`;
          //init image
          let imageUI = createImageUI(emailData[index - 2]);
          //init paragraph
          let paragraphUI = `<div class="flex-container">
                <div class="flex-column">
                  ${imageUI}
                  ${button}
                </div>
                <div class="flex-column">
                  <p>
                    ${convertNewlinesToHtml(item.value)}
                  </p>
                </div>

              </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index - 1);
          deleteIndex.push(index - 2);
        } else if (
          emailData[index + 1] &&
          emailData[index + 1].type === 'imageLink' &&
          emailData[index + 1].value &&
          emailData[index + 1].value !== '' &&
          !deleteIndex.includes(index + 1) &&
          emailData[index + 2].type === 'cta' &&
          emailData[index + 2].label &&
          emailData[index + 2].ctaType &&
          emailData[index + 2].ctaAction &&
          !deleteIndex.includes(index + 2)
        ) {
          let imageUI = `<div class="img-container">
              <a href="${emailData[index + 1].attachmentLink ? emailData[index + 1].attachmentLink : '#'}" target="_blank">
                <img src='${emailData[index + 1].value}'  class=${imageWidth ? 'img-uploaded' : ''} />
              </a>
            </div>`
          const url = emailData[index + 2].ctaAction?.startsWith('http')
            ? emailData[index + 2].ctaAction
            : `http://${emailData[index + 2].ctaAction}`;

          let button = `<div class='container'><div class="cta-wrapper"><a class='cta-link' href="${url}" target="_blank">${emailData[index + 2].ctaCustomLabel || emailData[index + 2].ctaType
            }</a></div></div>`;

          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              <p>
                ${convertNewlinesToHtml(item.value)}
              </p>
            </div>
            <div class="flex-column">
              ${imageUI}
              ${button}
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index + 1);
          deleteIndex.push(index + 2);
        } else if (
          emailData[index - 2] &&
          emailData[index - 2].type === 'imageLink' &&
          emailData[index - 2].value &&
          emailData[index - 2].value !== '' &&
          !deleteIndex.includes(index - 2) &&
          emailData[index - 1].type === 'cta' &&
          emailData[index - 1].label &&
          emailData[index - 1].ctaType &&
          emailData[index - 1].ctaAction &&
          !deleteIndex.includes(index - 1)
        ) {
          let imageUI = `<div class="img-container">
              <a href="${emailData[index - 2].attachmentLink ? emailData[index - 2].attachmentLink : '#'}" target="_blank">
                <img src='${emailData[index - 2].value}'  class=${imageWidth ? 'img-uploaded' : ''} />
              </a>
            </div>`
          const url = emailData[index - 1].ctaAction?.startsWith('http')
            ? emailData[index - 1].ctaAction
            : `http://${emailData[index - 1].ctaAction}`;

          let button = `<div class='container'><div class="cta-wrapper"><a class='cta-link' href="${url}" target="_blank">${emailData[index - 1].ctaCustomLabel || emailData[index - 1].ctaType
            }</a></div></div>`;

          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              ${imageUI}
              ${button}
            </div>
            <div class="flex-column">
              <p>
                ${convertNewlinesToHtml(item.value)}
              </p>
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index - 1);
          deleteIndex.push(index - 2);
        }
      }
      if (theme === 'variation1' || theme === 'variation2') {
        if (item.image) {
          const file = `<a href="${item.imageActionUrl?.startsWith('http') ? item.imageActionUrl : 'http://' + item.imageActionUrl}" target="_blank">
              <img src="${item.image instanceof Blob ? URL.createObjectURL(item.image) : item.image}" alt="Uploaded File ${index}" class=${`img-uploaded`} />
            </a>`;
          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              <p>${convertNewlinesToHtml(item.value)}</p>
            </div>
            <div class="flex-column">
              <div class="${`img-container-` + index}">
                ${file}
              </div>
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
        } else if (
          emailData[index - 1] &&
          emailData[index - 1].type === 'image' &&
          emailData[index - 1].value &&
          emailData[index - 1].value != '' &&
          !deleteIndex.includes(index - 1)
        ) {
          let imageUI = createImageUI(emailData[index - 1]);
          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
            ${imageUI}
            </div>
            <div class="flex-column">
            <p>
              ${convertNewlinesToHtml(item.value)}
              </p>
              </div>
              </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index - 1);
        } else if (
          emailData[index + 1] &&
          emailData[index + 1].type === 'image' &&
          emailData[index + 1].value &&
          emailData[index + 1].value != '' &&
          !deleteIndex.includes(index + 1)
        ) {
          let imageUI = createImageUI(emailData[index + 1]);
          let paragraphUI = `<div class="flex-container">
                <div class="flex-column">
                  <p>
                    ${convertNewlinesToHtml(item.value)}
                  </p>
                </div>
                <div class="flex-column">
                  ${imageUI}
                </div>
              </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index + 1);
        } else if (
          emailData[index + 1] &&
          emailData[index + 1].type === 'imageLink' &&
          emailData[index + 1].value &&
          emailData[index + 1].value !== '' &&
          !deleteIndex.includes(index + 1)
        ) {
          let imageUI = `<div class="img-container">
              <a href="${emailData[index + 1].attachmentLink ? emailData[index + 1].attachmentLink : '#'}" target="_blank">
                <img src='${emailData[index + 1].value}'  class=${imageWidth ? 'img-uploaded' : ''} />
              </a>
            </div>`
          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              <p>
                ${convertNewlinesToHtml(item.value)}
              </p>
            </div>
            <div class="flex-column">
              ${imageUI}
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index + 1);
        } else if (
          emailData[index - 1] &&
          emailData[index - 1].type === 'imageLink' &&
          emailData[index - 1].value &&
          emailData[index - 1].value !== '' &&
          !deleteIndex.includes(index - 1)
        ) {
          let imageUI = `<div class="img-container">
              <a href="${emailData[index - 1].attachmentLink ? emailData[index - 1].attachmentLink : '#'}" target="_blank">
                <img src='${emailData[index - 1].value}'  class=${imageWidth ? 'img-uploaded' : ''} />
              </a>
            </div>`
          let paragraphUI = `<div class="flex-container">
            <div class="flex-column">
              ${imageUI}
            </div>
            <div class="flex-column">
              <p>
                ${convertNewlinesToHtml(item.value)}
              </p>
            </div>
          </div>`;
          layoutItem.push({ idx: index, UI: paragraphUI });
          deleteIndex.push(index - 1);
        }
      }
    }
  });

  const previewEmail = `
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Email Preview</title>
      <style>
        body {
          font-family: 'Roboto', Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          ${theme && 'padding-top: 10px;'}
          overflow: auto;
        }
        .email-container {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
          background-color: ${bodyColor};
          border-collapse: collapse;
          overflow: hidden;
          #box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          padding-bottom: 20px;
        }
        .email-content {
          padding: ${previewMode === 'mobile' ? '20px' : `30px`};
          background-color: #fff;
        }
        .flex-container{
          width: 100%;
          display:flex;
          flex-direction: row;
          justify-content: space-between
        }
        .flex-column {
          width: 50%;
        }
        .flex-column:has(div) {
          width: 45%;
          flex-direction: column;
          display:flex;
          justify-content: center;
          align-items: center
        }
        h1 {
          font-size: 24px;
          color: ${bodyColor};
          margin-top: 0;
        }
        p {
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
        img {
          width: 100%;
          max-width: 540px;
          height: auto;
        }
        .img-container{
          width: 100%;
        }
        .img-container-origin {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        .img-uploaded{
          width: 100%
        }
        .img-uploaded-origin{
          width: 300px
        }
        ${emailData
      .map(({ imageWidth: paraImgWidth }, index) => {
        return `.img-uploaded-${index} {
            max-width: ${paraImgWidth}px;
            height:auto;
            width: 100%;
          }
          `;
      })
      .join('')}
        .thumbnail {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          box-shadow: rgba(0, 0, 0, 0.5) 5px 3px 20px 0px;
        }
        .thumbnail-origin {
          max-width: 100%;
          width: 360px;
          height: 202px;
          object-fit: cover
        }
        .play-button {
          position: absolute;
          height: 35%;
          width: auto;
          filter: none;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.5) 5px 3px 20px 0px;
        }
        .shadow-wrap {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center
        }
        .shadow-origin {
          max-width: 360px;
          width: 100%;
          background: black;
          height: 100%;
          opacity: 0.4;
        }
        .shadow {
          top: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.4;
        }

        .container{
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .cta-wrapper {
          padding: 10px 20px;
          display: flex;
          border-radius: 4px;
          background-color: ${bodyColor};
        }
        .cta-link{
          text-decoration: none;
          font-size: 14px;
          color: #ffffff;

        }
        .footer {
          display: flex;
          gap: 0cm;
          align-items: center;
          white-space: pre-line;
          flex-direction: row;
          justify-content: start;
          margin-top: 10px;
          color: ${footerColor};
        }
        .footer.swap {
          flex-direction: row-reverse;
        }
        .footertext {
          font-size: 14px;
          line-height: 1.5;
          color: ${footerColor};
          margin: 0;
          padding: 0;
        }
        .footer-img {
          width: 130px;
          height: auto;
          object-fit: contain;
        }
        .footer-img-wrapper, .footer-text{
          text-align: left;
          width: 90%;
          display: flex;
        }
        .footer-text{
          margin-left: 24px;
          ${
            /*footerImgDirection === 'left'*/ false ? '' : 'margin-right: auto;'
    }
        }
        .footer-img-wrapper {
          display: flex;
          flex-basis: 70px;
          justify-content: center;
          margin-right: 48px;
        }
        .footer.swap .footer-text{
          margin-left: 0;
          margin-right: auto;
        }
        @supports (aspect-ratio: 16/9) {
          .thumbnail, .shadow-origin ,.thumbnail-origin {
            aspect-ratio: 16/9;
            height: auto;
          }
          .play-button {
            aspect-ratio: 1/1;
          }
          .footer-img-wrapper {
            margin-right: 0;
          }
        }
        .table {
          width: 100%;
          box-sizing: border-box;
        }
        .table tbody td{
          font-size: 15px;
          padding: 6px 8px;

        }
        .speaker-table tr td:nth-child(1) {
          width: 70%;
        }
        .speaker-table{
          border-bottom: 1px solid  ${colorShade(bodyColor, 100)};
          margin: 20px 0;
          border-spacing: 2px;
          #box-shadow: 0px 4px 15px 0px #ccc;
        }

        .speaker-table thead td {
          padding: 8px
        }
        .speaker-table thead tr {
          color: #fff;
          background: ${bodyColor};
          font-weight: bold;
        }

        .speaker-table tbody tr:nth-of-type(odd) {
          #background: #efefef;
          /* background: ${colorShade(bodyColor, 200)}; */
        }

        .speaker-table tbody tr:nth-of-type(even) {
          background: #ffffff;
          /*  background: ${colorShade(bodyColor, 100)}; */
        }
        .small-font{
          font-size: 12.5px;
        }
        .email-layout{
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }
        .pi{
          text-align: center;
          font-size:16px;
        }
        .pi p{
          padding: 10px;
          margin:0;
          color:#000;
          text-align:justify;
          font-size:9px !important;
        }
        .compulsory{
          display:flex;
          justify-content:space-evenly;
          background-color:white;
          width: 100%;
          padding-bottom:10px;
        }
        .compulsory a{
          color:#000;
          margin: 0 16px;
          padding: 10px;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-content">
          ${banner}
          ${emailData
      .map(
        (
          {
            type,
            value,
            label,
            ctaType,
            ctaAction,
            image,
            imageWidth: paraImgWidth,
            ctaCustomLabel,
            attachmentLink,
            imageActionUrl,
          }: OptimizerFormFieldType,
          index
        ) => {
          if (
            type === 'cta' &&
            label &&
            ctaType &&
            ctaAction &&
            !deleteIndex.includes(index)
          ) {
            const url = ctaAction.startsWith('http')
              ? ctaAction
              : `http://${ctaAction}`;

            return `<div class='container'><div class="cta-wrapper"><a class='cta-link' href="${url}" target="_blank">${ctaCustomLabel || ctaType
              }</a></div></div>`;
          } else if (type === 'subject') {
            return value ? `<h1>${value}</h1>` : '';
          } else if (
            type === 'image' &&
            value &&
            value != '' &&
            !deleteIndex.includes(index)
          ) {
            const thumbnailUrl = imageActionUrl?.startsWith('http')
              ? imageActionUrl
              : `http://${imageActionUrl}`;
            return thumbnailUrl
              ? `
                <a href=${thumbnailUrl} target='_blank' style="display:flex;position:relative; justify-content: center; align-items: center;">
                  <img class="thumbnail-origin" src='${value}' />
                </a>`
              : `<img src='${value}' />`;
          } else if (
            type === 'imageLink' &&
            !deleteIndex.includes(index)
          ) {
            return value && value != ''
              ? `<div class="img-container-origin"><a href="${attachmentLink ? attachmentLink : '#'
              }" target="_blank"><img src='${value}' ${imageWidth && `style={{width :${imageWidth}px }}`}   class=${imageWidth ? 'img-uploaded-origin' : ''
              } /></a></div>`
              : '';
          } else if (type === 'table' && value?.length > 0) {
            return buildTableMarkup(value);
          } else if (type == 'paragraph') {
            const itemFound = layoutItem.find(
              (item) => item.idx === index
            );
            const file = image
              ? `<a href="${imageActionUrl?.startsWith('http')
                ? imageActionUrl
                : 'http://' + imageActionUrl
              }" target="_blank">
                        <img src="${image instanceof Blob ? URL.createObjectURL(
                image
              ) : image}" alt="Uploaded File ${index}" class=${'img-uploaded-' + index
              } />
                      </a>`
              : '';
            return value
              ? itemFound
                ? itemFound.UI
                : `<p>${convertNewlinesToHtml(value)}</p>
                      <div class="img-container-origin">${file}</div>`
              : '';
          } else {
            return '';
          }
        }
      )
      .join('')}
          <div class="footer ${
            /*footerImgDirection === 'right'*/ false ? 'swap' : 'no-swap'
    }">
            <div class="footer-img-wrapper">
              ${footerImage
      ? `<img class="footer-img" src=${footerImage instanceof Blob ? URL.createObjectURL(
        footerImage
      ) : footerImage} />`
      : ''}
            </div>
            <div class="footer-text">
              ${footerText
      ? `<p class="footertext">${convertNewlinesToHtml(
        footerText
      )}</p>`
      : ''
    }
            </div>
          </div>
          ${additionalFootersHTML}
        </div>
      </div>
      <div class="pi email-layout">
              ${pi && pi.length > 0 ? `<p>${pi}<p>` : ''}
              <div style="height:20px;background-color:white;"></div>
              <div class="compulsory">
                  ${unsubscribeLink ? `<a href="${unsubscribeLink}">Unsubscribe</a>`: ''}
                  ${privacyPolicy ? `<a href="${privacyPolicy}">Privacy Policy</a>`: ''}
              </div>
              ${veevaApprovalFlag === 'yes'
      ? `<div style="background-color:#fff;padding-bottom:10px;font-size:13px;">${veevaApproval}</div>`
      : ''
    }
            </div>
    </body>
    </html>
  `;
  return previewEmail;
}

export function buildSpeakerOptimizerFormData(
  formData: SpeakerFormValuesType,
  emailContent?: string | undefined
) {
  const { ctas, attachment, attachmentLink, speakers } = formData;
  let optimizerFormData: Array<OptimizerFormFieldType> = [];

  let attachmentThumnbnail: OptimizerFormFieldType | null = null;
  if (attachment && attachment !== '') {
    attachmentThumnbnail = {
      type: 'imageLink',
      key: 'attachment',
      value: attachment,
      label: '',
      attachmentLink,
      comments: '',
    };
  }

  let speakersData: OptimizerFormFieldType | null = null;
  if (speakers?.length > 0) {
    speakersData = {
      type: 'table',
      key: 'speakers',
      value: speakers,
      label: '',
      comments: '',
    };
  }

  const additionalFields: Array<OptimizerFormFieldType> = [
    ...(attachmentThumnbnail ? [{ ...attachmentThumnbnail }] : []),
    ...(speakersData ? [{ ...speakersData }] : []),
    ...(ctas || [])
      .map(({ ctaType, ctaAction, ctaCustomLabel }, index) => ({
        type: 'cta',
        key: index,
        value: '',
        label: 'Button Type ' + (index + 1),
        ctaType,
        ctaAction,
        ctaCustomLabel,
      }))
      .filter(
        ({ ctaType }) =>
          ctaType !== null && ctaType !== undefined && ctaType !== ''
      ),
  ];

  if (emailContent) {
    const subjectLineArr = emailContent.match(/Subject\s*:\s*(.*)/i);
    const [subjectLine] = subjectLineArr || [];

    if (subjectLine) {
      optimizerFormData = convertEmailContentIntoOptimizerFields(
        emailContent,
        [],
        additionalFields
      );
    }
  } else {
    optimizerFormData = [...additionalFields];
  }
  return { optimizerFormData, emailContent: emailContent };
}
