import type { PutBlobResult } from '@vercel/blob';
import axios from 'axios';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const imageUrlToBase64 = async(url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  }

  const handleImageUpload = async (event: any) => {
    const file = event.target?.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `/api/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;
    setBlob(newBlob);

    const base64 = await imageUrlToBase64(newBlob.url);
    console.log(base64);
  }

  console.log(blob);

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <input name="file" type="file" required onChange={handleImageUpload} />
 
    </>
  );
}