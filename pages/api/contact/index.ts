import { NextApiRequest, NextApiResponse } from 'next';
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(400).json({ message: 'Wrong HTTP verb' });
  try {
    const { email, firstName, lastName, userGroup } = req.body;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        lastName: lastName,
        userGroup: userGroup,
      }),
    };
    const response = await fetch(
      'https://app.loops.so/api/v1/contacts/create',
      options
    );
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
