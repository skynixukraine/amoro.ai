import { NextApiRequest, NextApiResponse } from 'next';
import sendMail from '@/services/mail.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { to, subject, text, html, type } = req.body;
      await sendMail({
        to,
        subject,
        text,
        html,
        type: 'gmail'
      });
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
