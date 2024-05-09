import axios from 'axios';
import { PutBlobResult } from '@vercel/blob';

export function useSaveContent() {
    const saveContent = async (data: any) => {
        const { currentId, userId, status, standardLayout, videoLayout, invitationLayout } = data;
        if (currentId) {
            axios.put(`/api/content/${currentId}`, {
                status,
                standardLayout: [standardLayout],
                videoLayout: [videoLayout],
                invitationLayout: [invitationLayout]
            });
            console.log('updating...', currentId)
            return null;
        } else {
            const response = await axios.post('/api/content', {
                isDraft: true,
                userId,
                status,
                standardLayout: [standardLayout],
                videoLayout: [videoLayout],
                invitationLayout: [invitationLayout]
            });
            console.log('creating...', response.data?.id)
            return response.data?.id;
        }
    }

      const blobToFile = async (blobUrl: string) => {
        // fetch(blobUrl)
        // .then((response) => response.blob())
        // .then((blobData) => {

        // })
        // .catch((error) => {
        //     console.error('Error fetching blob data:', error);
        // });
        const response = await fetch(blobUrl);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fileBlob = await response.blob();
        return fileBlob;
    }

    const onImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
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
 
    return {
        blobToFile,
        onImageUpload,
        saveContent
    }

}