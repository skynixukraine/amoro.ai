import StyledFileInput from '@/components/StyledFileInput';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import { Box, Button, TextField } from '@mui/material';
// import axios from 'axios';
import axios from '@/common/config';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { onImageUpload } from '@/utils';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import atob from 'atob';
import ProgressBar from '@/components/ProgressBar';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const slugify = require('slugify');
import { useSession } from 'next-auth/react';

const ArrowBack = () => (
  <svg
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.7144 14.1276H7.80479L13.0456 8.62547C13.2639 8.40412 13.4381 8.13934 13.5578 7.84659C13.6776 7.55384 13.7407 7.23898 13.7433 6.92037C13.746 6.60176 13.6881 6.2858 13.5732 5.9909C13.4583 5.69601 13.2886 5.4281 13.074 5.2028C12.8594 4.97751 12.6042 4.79933 12.3233 4.67868C12.0424 4.55803 11.7414 4.49732 11.438 4.50009C11.1345 4.50286 10.8346 4.56905 10.5557 4.69481C10.2769 4.82057 10.0247 5.00337 9.81382 5.23255L0.671478 14.8306C0.458629 15.0535 0.289756 15.3183 0.174533 15.6098C0.0593103 15.9013 0 16.2139 0 16.5295C0 16.8451 0.0593103 17.1576 0.174533 17.4491C0.289756 17.7407 0.458629 18.0055 0.671478 18.2283L9.81382 27.8264C10.2449 28.2635 10.8222 28.5054 11.4215 28.4999C12.0208 28.4944 12.594 28.2421 13.0178 27.7972C13.4416 27.3523 13.6819 26.7505 13.6871 26.1213C13.6923 25.4922 13.462 24.8861 13.0456 24.4335L7.80479 18.9266H29.7144C30.3206 18.9266 30.9019 18.6738 31.3306 18.2238C31.7592 17.7738 32 17.1635 32 16.5271C32 15.8907 31.7592 15.2804 31.3306 14.8304C30.9019 14.3804 30.3206 14.1276 29.7144 14.1276Z"
      fill="#111928"
    />
  </svg>
);

const labelProps = {
  color: '#111928',
  /* text-sm/font-medium */
  fontFamily: 'Inter',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '150%' /* 21px */,
};

export default function EditBlogPost() {
  // const blog = props.blog;

  const [bannerImage, setBannerImage] = React.useState<string | null>('');
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [author, setAuthor] = React.useState('');
  const { data: session, status } = useSession();
  const [blog, setBlog] = useState<any>();
  const [imageDescription, setImageDescription] = React.useState('');

  useEffect(() => {
    if (session) {
      hanldeGetData();
    } else {
      // router.push('/');
    }
  }, [session]);
  useEffect(() => {
    if (blog) {
      setBannerImage(blog.bannerImage);
      setTitle(blog.title);
      setDescription(blog.description);
      setAuthor(blog.author);
      setImageDescription(blog.imageDescription);
    }
  }, [blog]);

  const hanldeGetData = async () => {
    await axios('/api/blog')
      .then((res) => {
        const blog = res.data.find((item: any) => item.id == id);
        setBlog(blog);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files && target.files[0];
    if (!file) return;
    // const base64 = (await fileToBase64(file)) as string;
    let uri = await onImageUpload(file);
    if (uri) {
      setBannerImage(uri);
    }
    // setBannerImage(base64);
  };

  const handleSubmit = async (updatedDescription: string, slug: string) => {
    if (!bannerImage || title.length === 0 || description.length === 0) {
      return alert('Please provide values for all of the fields');
    }

    try {
      await axios.put(`/api/blog/${blog.id}`, {
        bannerImage,
        title,
        description: updatedDescription,
        imageDescription,
        author: author,
        slug: slug,
      });
      setIsLoading(false);

      router.push('/admin/blog');
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/blog/${blog.id}`);
      router.push('/admin/blog');
    } catch (e) {
      alert(e);
    }
  };
  const handleBase64Change = async (
    base64String: string,
    srcPosition: number
  ) => {
    const mime =
      base64String.split(';')[0].match(/jpeg|png|gif/)?.[0] || 'image/png';
    const byteString = atob(base64String.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mime });
    const file = new File([blob], 'filename', { type: mime });
    let uri = await onImageUpload(file);
    if (uri) {
      const updatedDescription = replaceSrcAtPosition(
        description,
        base64String,
        uri
      );
      const parser = new DOMParser();
      const doc = parser.parseFromString(title, 'text/html');
      const textContent = doc.body.textContent || '';
      setDescription(updatedDescription);
      setIsLoading(false);
      handleSubmit(description, slugify(textContent));
    }
  };

  const replaceSrcAtPosition = (
    original: string,
    base64String: string,
    newSrc: string
  ): string => {
    const position = original.indexOf(base64String);

    if (position !== -1) {
      const updatedDescription =
        original.slice(0, position) +
        newSrc +
        original.slice(position + base64String.length);
      return updatedDescription;
    }
    return original;
  };
  const onSubmit = () => {
    setIsLoading(true);
    const parser = new DOMParser();
    const doc = parser.parseFromString(title, 'text/html');
    const textContent = doc.body.textContent || '';

    const imgElements = document.createElement('div');
    imgElements.innerHTML = description;
    const images = imgElements.querySelectorAll('img');
    if (images) {
      images.forEach((imgTag: any) => {
        const src = imgTag.getAttribute('src');
        const position = imgTag.outerHTML.indexOf(src || '');

        if (src && src.startsWith('data:image') && position !== -1) {
          handleBase64Change(src, position);
        } else {
          handleSubmit(description, slugify(textContent));
        }
      });
      handleSubmit(description, slugify(textContent));
    } else {
      handleSubmit(description, slugify(textContent));
    }
  };

  return (
    <DesktopAdminLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '10vh',
        }}
      >
        {isLoading && (
          <ProgressBar
            message="Update ..."
            open={isLoading}
            handleClose={() => {}}
          />
        )}
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px' }}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'black',
              marginBottom: '16px',
            }}
            href="/admin/blog"
          >
            <>
              <ArrowBack />
              <span
                style={{
                  marginLeft: '12px',
                  color: '#111928',
                  fontFamily: 'Inter',
                  fontSize: '32px',
                  fontStyle: 'normal',
                  fontWeight: 800,
                  lineHeight: 'normal',
                }}
              >
                Edit Blog
              </span>
            </>
          </Link>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            width: '100%',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label style={labelProps}>Add Banner Image</label>
          <StyledFileInput handleFileChange={handleUploadImage} />
          {bannerImage && (
            <div
              style={{
                margin: '16px 0',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              {
                <img
                  src={bannerImage}
                  width={500}
                  height={'auto'}
                  alt="uploaded image"
                  style={{ maxWidth: '80vw' }}
                />
              }
            </div>
          )}
          <label style={{ ...labelProps, margin: '16px 0' }}>
            Image description
          </label>
          <TextField
            type="text"
            placeholder="image description"
            fullWidth
            value={imageDescription}
            onChange={(e: any) => setImageDescription(e.target.value)}
          />
          <label style={{ ...labelProps, margin: '16px 0' }}>Blog title</label>
          <ReactQuill
            value={title}
            onChange={(value: any) => setTitle(value)}
            placeholder="Enter Title"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }],
                [{ color: [] }, { background: [] }],
                ['link'],
              ],
            }}
          />
          {/* <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minRows={6}
            multiline
            placeholder="Enter Title"
            InputProps={{ sx: styledInputPropsSx }}
          /> */}
          <label style={{ ...labelProps, margin: '16px 0' }}>
            Blog Description
          </label>
          <ReactQuill
            value={description}
            onChange={(value: any) => setDescription(value)}
            placeholder="Enter Description"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }],
                [{ color: [] }, { background: [] }],
                ['link', 'image'],
              ],
            }}
          />
          <label style={{ ...labelProps, margin: '16px 0' }}>Author</label>
          <TextField
            type="text"
            placeholder="author"
            fullWidth
            value={author}
            onChange={(e: any) => setAuthor(e.target.value)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: '16px',
          }}
        >
          <Button
            variant="outlined"
            sx={{ textTransform: 'none', width: '90px', margin: '0 10px' }}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            sx={{ textTransform: 'none', width: '90px', margin: '0 10px' }}
            onClick={onSubmit}
          >
            Publish
          </Button>
        </div>
      </Box>
    </DesktopAdminLayout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);
  const redirectObject = {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };

  if (!session) return redirectObject;

  // const user: any = await User.findOne({
  //   where: { email: session.user?.email },
  //   raw: true,
  // });
  const userData = await axios.get(
    `/api/user/get-by-email?email=${session.user?.email}`
  );
  const user: any = userData.data;
  if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
    return redirectObject;

  const blogData = await axios.get('/api/blog');

  const blog = blogData.data.find((item: any) => item.id == context.query.id);

  // await Blog.findOne({
  //   where: { id: context.query.id },
  //   raw: true,
  // });

  return {
    props: {
      blog: blog,
      user: user,
    },
  };
};
