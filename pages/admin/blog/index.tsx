import BlogCard from '@/components/BlogCard';
import DesktopAdminLayout from '@/components/layouts/DesktopAdminLayout';
import { Button } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function BlogList() {
  // const blogs = props.blogs;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<any>();
  useEffect(() => {
    if (session) {
      hanldeGetData();
    }
  }, [session]);

  const hanldeGetData = async () => {
    await axios('/api/blog')
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <DesktopAdminLayout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          className="blog-label"
        >
          <p
            className="blog-title"
            style={{
              color: '#111928',
              fontFamily: 'Inter',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 800,
              lineHeight: 'normal',
            }}
          >
            Blog
          </p>
          <Link href="/admin/blog/new" className="blog-button-link">
            <Button
              className="blog-button"
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Add New Blog
            </Button>
          </Link>
        </div>
        <div className="blogContainer">
          {blogs?.map((blog: any) => (
            <Link
              key={blog.id}
              href={`/admin/blog/edit/${blog.id}`}
              style={{ textDecoration: 'none', color: '#111928' }}
            >
              <div>
                <BlogCard
                  title={blog.title}
                  description={blog.description}
                  image={blog.bannerImage}
                  createdAt={blog.createdAt}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
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
  const userData = await axios.get(
    `/api/user/get-by-email?email=${session.user?.email}`
  );

  const user: any = userData.data;
  if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
    return redirectObject;

  return {
    props: { user },
  };
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   // @ts-expect-error
//   const session = await getServerSession(context.req, context.res);
//   console.log(session?.user?.email);

//   const redirectObject = {
//     redirect: {
//       destination: '/admin/login',
//       permanent: false,
//     },
//   };

//   if (!session) return redirectObject;

//   // const user: any = await User.findOne({
//   //   where: { email: session.user?.email },
//   //   raw: true,
//   // });
//   const userData = await axios.get(
//     `/api/user/get-by-email?email=${session.user?.email}`
//   );

//   const user: any = userData.data;
//   if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
//     return redirectObject;
//   const dataBlogs = await axios.get('/api/blog');

//   const blogs = dataBlogs.data;
//   //  await Blog.findAll({ raw: true, order: [['id', 'ASC']] });

//   return {
//     props: {
//       blogs: JSON.parse(JSON.stringify(blogs)),
//     },
//   };
// };
