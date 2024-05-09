/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Homepage from '@/components/Homepage';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type Blog = { bannerImage: string; title: string; description: string };
export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    hanldeGetBlogs();
  }, []);
  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, []);

  const hanldeGetBlogs = async () => {
    await axios
      .get('/api/blog', {
        headers: {
          'x-api-key': API_KEY,
        },
      })
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return <Homepage blogs={blogs} />;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
      props: {
        blogs: [],
      },
    };
  }

  return {
    props: {
      blogs: [],
    },
  };
};
