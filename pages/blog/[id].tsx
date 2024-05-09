import BlogCard from '@/components/BlogCard';
import Head from 'next/head';
import useWindowSize from '@/hooks/useWindowSize';
import { Box } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { InlineShareButtons } from 'sharethis-reactjs';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type Blog = {
  id?: number;
  bannerImage: string;
  title: string;
  description: string;
  imageDescription?: string;
  author?: string;
  updatedAt: string;
};
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ArrowBack = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8572 6.81378H3.90239L6.52282 4.06273C6.63197 3.95206 6.71903 3.81967 6.77892 3.6733C6.83881 3.52692 6.87034 3.36949 6.87166 3.21019C6.87298 3.05088 6.84406 2.8929 6.7866 2.74545C6.72914 2.59801 6.64428 2.46405 6.53698 2.3514C6.42968 2.23875 6.30209 2.14967 6.16164 2.08934C6.0212 2.02902 5.87072 1.99866 5.71898 2.00005C5.56724 2.00143 5.41728 2.03453 5.27786 2.0974C5.13843 2.16028 5.01233 2.25168 4.90691 2.36627L0.335739 7.16531C0.229314 7.27676 0.144878 7.40916 0.0872666 7.55491C0.0296551 7.70067 0 7.85693 0 8.01474C0 8.17255 0.0296551 8.32881 0.0872666 8.47457C0.144878 8.62033 0.229314 8.75273 0.335739 8.86417L4.90691 13.6632C5.12244 13.8818 5.41111 14.0027 5.71075 14C6.01039 13.9972 6.29701 13.871 6.5089 13.6486C6.72078 13.4262 6.84097 13.1252 6.84357 12.8107C6.84617 12.4961 6.73099 12.193 6.52282 11.9668L3.90239 9.2133H14.8572C15.1603 9.2133 15.451 9.0869 15.6653 8.8619C15.8796 8.6369 16 8.33174 16 8.01354C16 7.69535 15.8796 7.39018 15.6653 7.16518C15.451 6.94019 15.1603 6.81378 14.8572 6.81378Z"
      fill="#111928"
    />
  </svg>
);

const BlogDetailPage = () => {
  const sizes = useWindowSize();
  const router = useRouter();
  const slug = router.query.id;
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog>();

  const [relateBlog, setRelateBlog] = useState<Blog[]>([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (slug && typeof slug === 'string') {
      getBlog(slug);
    }
  }, [slug]);
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
  const getBlog = async (slug: string) => {
    await axios
      .get(`/api/blog/${slug}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function convertDateFormat(inputDate: string | undefined): any {
    if (inputDate) {
      const inputDateObj: any = new Date(inputDate);
      const day = inputDateObj.getDate();
      const month = inputDateObj
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = inputDateObj.getFullYear();
      const hours = inputDateObj.getHours();
      const minutes = inputDateObj.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      const timezone = 'SGT';
      const resultString = `${day} ${month} ${year}, ${adjustedHours}:${minutes} ${ampm} ${timezone}`;
      return resultString;
    }
  }

  const textProps = {
    marginLeft: '12px',
    color: '#212529',
    fontSize: sizes.width && sizes.width < 768 ? '20px' : '32px',
    fontStyle: 'normal',
    lineHeight: 'normal',
  };
  useEffect(() => {
    if (blogs) {
      const datas = getRandomBlogs(blogs);
      setRelateBlog(datas);
    }
  }, [blogs]);
  function getRandomBlogs(blogs: Blog[]): Blog[] {
    const filteredBlogs = blogs.filter((item) => item.id !== blog?.id);
    const shuffledBlogs = filteredBlogs.sort(() => Math.random() - 0.5);
    return shuffledBlogs.slice(0, 3);
  }
  const hanldeClickBlog = (slug: string) => {
    router.push(`/blog/${slug}`);
  };
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/blog');
  };
  const extractTwoSentences = (description: string) => {
    const doc = convertHtmlToString(description);
    const sentences = doc.split(/[.!?;]/);
    const firstTwoSentences = sentences.slice(0, 1).join('.');
    return firstTwoSentences;
  };
  function convertHtmlToString(htmlString: string): string {
    const withoutHtmlTags = htmlString.replace(/<[^>]*>/g, '');
    const decodedString = withoutHtmlTags.replace(/&nbsp;/g, ' ');
    return decodedString.trim();
  }

  return (
    <>
      <Head>
        {/* <meta property="title" content={convertHtmlToString(blog.title)} /> */}
        <title>{convertHtmlToString(blog?.title || '')} </title>
        <meta
          property="og:title"
          content={convertHtmlToString(blog?.title || '')}
        />
        <meta
          property="og:description"
          content={extractTwoSentences(blog?.description || '')}
        />
        <meta property="og:image" content={blog?.bannerImage} />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          py: '24px',
          // backgroundColor: '#F9FAFB',
        }}
      >
        <div
          style={{
            display: 'flex',
            // flexWrap: 'wrap',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '90%',
              textAlign: 'left',
              marginBottom: '16px',
              maxWidth: '1280px',
            }}
          >
            <Link
              style={{
                textDecoration: 'none',
                color: 'black',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
              href="/blog"
              onClick={handleLinkClick}
            >
              <>
                <ArrowBack />
                <span className="customFont" style={textProps}>
                  Blog Details
                </span>
              </>
            </Link>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              width: sizes.width && sizes.width < 768 ? '100%' : '90%',
              borderRadius: '8px',
              maxWidth: '1280px',
            }}
          >
            <div
              style={{
                margin: sizes.width && sizes.width < 768 ? '10px' : '24px',
                textAlign: 'center',
              }}
            >
              <span
                className="customFont"
                style={{
                  fontSize: sizes.width && sizes.width < 768 ? '35px' : '42px',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  color: '#212529',
                  marginLeft: 0,
                  marginBottom: '16px',
                  objectFit: 'cover',
                }}
                dangerouslySetInnerHTML={{ __html: blog?.title || '' }}
              />
            </div>
            <div
              style={{
                margin: '24px 24px 0 24px',
                textAlign: 'center',
                paddingTop: sizes.width && sizes.width < 768 ? '5px' : '20px',
              }}
            >
              <img
                src={blog?.bannerImage}
                // height={sizes.width && sizes.width < 768 ? 'auto' : '256px'}
                alt="blog-banner-image"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ width: '100%', paddingLeft: '40px' }}>
                <span
                  style={{
                    color: '#767676',
                    fontSize: '14px',
                    paddingTop: '2px',
                    fontWeight: '400',
                  }}
                >
                  {blog?.imageDescription}
                </span>
              </div>
              <div
                style={{
                  width: '90%',
                  paddingTop:
                    sizes.width && sizes.width < 768 ? '20px' : '40px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    borderBottom: ' 1px solid rgba(5, 5, 5, 0.3)',
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    paddingBottom:
                      sizes.width && sizes.width < 768 ? '5px' : '10px',
                  }}
                >
                  <img
                    src="/icon-amoro.png"
                    alt="logo"
                    style={{ marginBottom: '10px' }}
                  />
                  <span
                    className="customFont"
                    style={{
                      color: '#12239a',
                      lineHeight: '19px',
                      fontWeight:
                        sizes.width && sizes.width < 768 ? '700' : '800',
                    }}
                  >
                    {`${blog?.author ? blog?.author : 'amoro.ai'}`}
                  </span>
                </div>
                <div style={{ paddingTop: '5px' }}>
                  <span
                    style={{
                      fontFamily:
                        'Curator, Helvetica Neue, Helvetica, Arial, sans-serif',
                      textTransform: 'uppercase',
                      fontSize: '12px',
                      color: '#616161',
                    }}
                  >
                    update {convertDateFormat(blog?.updatedAt)}
                  </span>
                  <div
                    style={{
                      paddingTop:
                        sizes.width && sizes.width < 768 ? '20px' : '0px',
                    }}
                  >
                    <InlineShareButtons
                      config={{
                        alignment: 'right',
                        color: 'social',
                        enabled: true,
                        font_size: 16,
                        labels: null,
                        networks: [
                          'whatsapp',
                          'linkedin',
                          'messenger',
                          'facebook',
                          'twitter',
                        ],
                        padding: 4,
                        radius: 4,
                        show_total: false,
                        size: 40,
                        language: 'en',
                        title: convertHtmlToString(blog?.title || ''),
                        image: blog?.bannerImage,
                        description: extractTwoSentences(
                          blog?.description || ''
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                margin: '24px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                className="customFont"
                style={{
                  color: '#000000',
                  width: sizes.width && sizes.width < 768 ? '100%' : '90%',
                  fontSize: sizes.width && sizes.width < 768 ? '18px' : '20px',
                  fontStyle: 'normal',
                  paddingBottom: '16px',
                  fontWeight: 'normal',
                  lineHeight: '30px',
                }}
                dangerouslySetInnerHTML={{ __html: blog?.description || '' }}
              />
            </div>
          </div>
          <div
            style={{
              maxWidth: '1280px',
              width: '90%',
              padding: '30px 0px',
              textAlign: 'center',
              borderTop: ' 1px solid rgba(5, 5, 5, 0.3)',
            }}
          >
            <span
              className="customFont"
              style={{
                fontSize: sizes.width && sizes.width < 768 ? '22px' : '26px',
                fontWeight: 'normal',
                color: 'black',
                letterSpacing: '1.3px',
                textTransform: 'uppercase',
              }}
            >
              Related blogs
            </span>
          </div>

          <div
            style={{
              display: sizes.width && sizes.width < 768 ? 'none' : 'flex',
              justifyContent: 'center',
              gap: sizes.width && sizes.width < 768 ? '10px' : '30px',
              maxWidth: '1280px',
              width: '90%',
            }}
          >
            {relateBlog.map((blog: any) => (
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
          <div
            style={{
              display: sizes.width && sizes.width < 768 ? 'block' : 'none',
              justifyContent: 'center',
              gap: sizes.width && sizes.width < 768 ? '10px' : '30px',
              maxWidth: '1280px',
              width: '90%',
            }}
          >
            <Slider {...sliderSettings}>
              {relateBlog.map((blog: any) => (
                <div
                  key={blog.id}
                  onClick={() => hanldeClickBlog(blog.slug)}
                  // href={`/blog/${blog.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: '#111928',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{ backgroundColor: 'white', paddingRight: '20px' }}
                  >
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
            </Slider>
          </div>
        </div>
      </Box>
    </>
  );
};

export default BlogDetailPage;

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const slug = context.query.id;
//   const dataBlog = await axios.get(`/api/blog/${slug}`);
//   const blog = dataBlog.data;
//   const dataBlogs = await axios.get('/api/blog');
//   const blogs = dataBlogs.data;
//   // const blogs = await Blog.findAll({ raw: true, order: [['id', 'ASC']] });

//   return {
//     props: {
//       blog: blog,
//       blogs: blogs,
//     },
//   };
// };
