import BlogCard from '@/components/BlogCard';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';

type Blog = { bannerImage: string; title: string; description: string };

const BlogPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const hanldeClickBlog = (slug: string) => {
    router.push(`/blog/${slug}`);
  };
  useEffect(() => {
    if (session) {
      hnaldeGetBlogs();
    }
  }, [session]);
  const hnaldeGetBlogs = async () => {
    await axios
      .get('/api/blog')
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 32px',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p
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
      </div>
      <div className="blogContainer">
        {blogs.map((blog: any) => (
          <div
            key={blog.id}
            // href={`/blog/${blog.slug}`}
            onClick={() => hanldeClickBlog(blog.slug)}
            style={{
              textDecoration: 'none',
              color: '#111928',
              marginBottom: '10px',
            }}
          >
            <div style={{ backgroundColor: 'white' }}>
              <BlogCard
                title={blog.title}
                description={blog.description}
                image={blog.bannerImage}
                createdAt={blog.createdAt}
                author={blog.author}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const dataBlog = await axios.get('/api/blog');
//   const blogs = dataBlog.data;
//   //  await Blog.findAll({ raw: true, order: [['id', 'ASC']] });

//   return {
//     props: {
//       blogs: blogs,
//     },
//   };
// };
