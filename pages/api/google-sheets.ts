import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID || '',
  serviceAccountAuth
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST')
      return res.status(400).json('Only post method is allowed');

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const newRow = await sheet.addRow(JSON.parse(req.body));
    await newRow.save();

    res.status(200).json({ message: 'Success' });
  } catch (error: any) {
    console.log(error?.message);
    res.status(500).json(error);
  }
}
