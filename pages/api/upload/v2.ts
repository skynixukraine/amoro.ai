import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  runtime: 'edge',
};
 
export default async function upload(request: any) {
  const form = await request.formData();
  const buffet = await axios.post('https://amoroimage.onrender.com/upload', {
    body: form,
  });
  console.log(buffet);
  let file = buffet.data;
  console.log(file);
  // const file = form.get('file') as File;
  // const blob = await put(file.name, file, { access: 'public' });
 
  // return NextResponse.json(blob);
}