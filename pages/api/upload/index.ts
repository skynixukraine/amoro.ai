import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export const config = {
  runtime: 'edge',
};
 
export default async function upload(request: any) {
  const form = await request.formData();
  const file = form.get('file') as File;
  const blob = await put(file.name, file, { access: 'public' });
 
  return NextResponse.json(blob);
}