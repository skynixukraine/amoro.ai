import { Button, Divider, useTheme } from '@mui/material';
import classes from './Homepage.module.css';
import BlogCard from './BlogCard';
import LoginButtonGroup from './login/LoginButtonGroup';
import useWindowSize from '@/hooks/useWindowSize';
import Link from 'next/link';
import { TestimonialData } from '@/utils/data';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import { Box, Modal, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import TermsofUseComponent from './login/TermsofUseComponent';

type Blog = {
  bannerImage: string;
  title: string;
  description: string;
  author?: string;
};

const Homepage: React.FC<{ blogs: Array<Blog> }> = ({ blogs }) => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowSize();
  const sizes = useWindowSize();
  const isDesktop = sizes.width && sizes.width >= 900;
  const [openTermsofUseModal, setTermsofUseModal] = useState(false);
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1024,
    bgcolor: '#fff',
    boxShadow: 24,
    p: 4,
    borderRadius: '24px',
    minHeight: '70vh',
  };

  const hanldeClickBlog = (
    slug: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    router.push(`/blog/${slug}`);
  };
  const TermsofUseModal = () => (
    <>
      <Modal
        open={openTermsofUseModal}
        onClose={() => setTermsofUseModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TermsofUseComponent setTermsofUseModal={setTermsofUseModal} />
        </Box>
      </Modal>
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.content_container}>
        <div className={classes.roundedBackgroundContainer}>
          <div className={classes.roundedBackground}>
            <span
              className={classes.roundedBackground}
              style={{ backgroundColor: theme.palette.primary.main }}
            >
              New
            </span>
            Amoro is launched! No more frustrating agencies!
          </div>
        </div>

        <div className={classes.headerContainer}>
          <h1>
            Break free and create instantly:
            <br /> Generate Pharma Emailers <br />
            Instantly With A Few Clicks.
          </h1>
          <h2 className={classes.secondaryTitle}>
            Are you a pharma product manager who is frustrated with long
            timelines and high cost from content agencies? Amoro is for you!
          </h2>
        </div>

        <div className={classes.buttonContainer}>
          <LoginButtonGroup />
        </div>

        <div className={classes.videoContainer}>
          <video src="/homepage/amorovideo.mp4" controls />
        </div>

        <div className={classes.testimonialContainer}>
          <Slider {...settings}>
            {TestimonialData.map((testimonial) => (
              <div key={testimonial.id} className={classes.slickItem}>
                <div className={classes.testimonial}>
                  <div className={classes.test}>
                    <span className={classes.testimonialTitle}>
                      {testimonial.title}
                    </span>
                    <p
                      className={classes.testimonialContent}
                      dangerouslySetInnerHTML={{ __html: testimonial.content }}
                    />
                  </div>
                  <div className={classes.testicontainer}>
                    <img
                      src={testimonial.image}
                      alt="logo"
                      width={32}
                      height={32}
                    />
                    <div className={classes.testi}>
                      <span className={classes.testimonialName}>
                        {testimonial.name}
                      </span>
                      <span className={classes.testimonialAdd}>
                        {testimonial.company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className={classes.aboutUsOverlay}>
          <div className={classes.aboutUsContainer}>
            <h2 style={{ margin: '16px 0' }} id="NoMoreReliance">
              <strong>No More Reliance</strong> on content agencies for your rep
              triggered emailers
            </h2>
            <h3>
              Amoro is inspired by complaints from marketers in the
              pharmaceutical industry on the high costs and inefficiencies of
              content development. Amoro creates your draft, format your
              emailers and allows you to export the email template into PDF for
              MLR approval and HTML for deployment. All you need to do is answer
              a few simple questions and the rest is magic
            </h3>
            <div className={classes.aboutUsImageContainer}>
              <img src="/homepage/about-us-1.png" alt="about-us-picture-1" />
              <img src="/homepage/about-us-2.png" alt="about-us-picture-2" />
            </div>
          </div>
        </div>
        <div
          className={classes.aboutUsContainer}
          style={{ paddingTop: '32px', paddingBottom: '32px' }}
        >
          <h2 id="NoDigitalSkillsNeeded" className={classes.itemSpace}>
            <strong>Just a Few Clicks.</strong> No digital skills needed. Anyone
            can do!
          </h2>
          <div className={classes.image_container}>
            <img
              className={classes.productImage}
              src={
                width && width < 768
                  ? '/homepage/Amoro AI - Mobile.gif'
                  : '/homepage/Amoro AI - Desktop.gif'
              }
              alt="email-template-image"
            />
          </div>
        </div>
        <div className={classes.featuresContainer}>
          <h2>How it works</h2>
          <h3>Effortlessly create pharma emailers in less than 2 minutes</h3>
          <div className={classes.featuresRow}>
            <div className={classes.feature}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 8C0 3.58172 3.58172 0 8 0H40C44.4183 0 48 3.58172 48 8V40C48 44.4183 44.4183 48 40 48H8C3.58172 48 0 44.4183 0 40V8Z"
                  fill="#0F6937"
                  fillOpacity="0.1"
                />
                <path
                  d="M24 40C20.8355 40 17.7421 39.0616 15.1109 37.3035C12.4797 35.5454 10.4289 33.0466 9.21793 30.1229C8.00693 27.1993 7.69008 23.9823 8.30744 20.8786C8.92481 17.7749 10.4487 14.9239 12.6863 12.6863C14.9239 10.4487 17.7749 8.92481 20.8786 8.30744C23.9823 7.69008 27.1993 8.00693 30.1229 9.21793C33.0466 10.4289 35.5454 12.4797 37.3035 15.1109C39.0616 17.7421 40 20.8355 40 24C39.9953 28.242 38.3081 32.309 35.3086 35.3086C32.309 38.3081 28.242 39.9953 24 40ZM24 11.2C21.4684 11.2 18.9937 11.9507 16.8887 13.3572C14.7838 14.7637 13.1431 16.7628 12.1743 19.1017C11.2055 21.4406 10.9521 24.0142 11.446 26.4972C11.9398 28.9801 13.1589 31.2609 14.949 33.051C16.7392 34.8411 19.0199 36.0602 21.5028 36.5541C23.9858 37.0479 26.5595 36.7945 28.8984 35.8257C31.2372 34.8569 33.2363 33.2162 34.6428 31.1113C36.0493 29.0064 36.8 26.5316 36.8 24C36.7962 20.6064 35.4464 17.3529 33.0468 14.9532C30.6471 12.5536 27.3936 11.2038 24 11.2Z"
                  fill="#0F6937"
                />
                <path
                  d="M24 28.8C23.5757 28.8 23.1687 28.6314 22.8686 28.3314C22.5686 28.0313 22.4 27.6243 22.4 27.2V24.9312C22.4 24.7157 22.4435 24.5025 22.5279 24.3043C22.6123 24.1061 22.7359 23.9269 22.8912 23.7776C23.0453 23.6274 23.2287 23.5104 23.4299 23.4339C23.631 23.3574 23.8458 23.323 24.0608 23.3328C24.3701 23.344 24.6785 23.2926 24.9675 23.1817C25.2565 23.0707 25.52 22.9025 25.7424 22.6872C25.9647 22.4719 26.1413 22.2138 26.2615 21.9286C26.3816 21.6433 26.4429 21.3367 26.4416 21.0272C26.4662 20.3907 26.237 19.7705 25.8043 19.303C25.3716 18.8355 24.7709 18.559 24.1344 18.5344C23.4979 18.5098 22.8777 18.739 22.4102 19.1717C21.9427 19.6044 21.6662 20.2051 21.6416 20.8416C21.6365 21.0524 21.5893 21.2601 21.5026 21.4524C21.4158 21.6446 21.2915 21.8175 21.1368 21.9609C20.9821 22.1042 20.8002 22.2151 20.602 22.2869C20.4037 22.3588 20.193 22.3902 19.9824 22.3792C19.5588 22.3625 19.1591 22.1785 18.8711 21.8674C18.5832 21.5563 18.4304 21.1436 18.4464 20.72C18.4918 19.6911 18.8201 18.6947 19.3951 17.8403C19.9702 16.9859 20.7697 16.3066 21.7058 15.8771C22.6418 15.4477 23.6782 15.2847 24.7009 15.406C25.7236 15.5274 26.6931 15.9285 27.5026 16.5651C28.3122 17.2017 28.9305 18.0493 29.2896 19.0145C29.6486 19.9798 29.7346 21.0254 29.5379 22.0363C29.3412 23.0473 28.8696 23.9844 28.1749 24.7447C27.4801 25.5049 26.5892 26.0589 25.6 26.3456V27.2C25.6 27.6243 25.4314 28.0313 25.1314 28.3314C24.8313 28.6314 24.4243 28.8 24 28.8Z"
                  fill="#0F6937"
                />
                <path
                  d="M24 33.6C24.8837 33.6 25.6 32.8837 25.6 32C25.6 31.1163 24.8837 30.4 24 30.4C23.1163 30.4 22.4 31.1163 22.4 32C22.4 32.8837 23.1163 33.6 24 33.6Z"
                  fill="#0F6937"
                />
              </svg>

              <h4>Answer a few Questions</h4>
              <h5>
                We have cleverly crafted a short list of questions as prompts to
                the AI. You just need to answer them. All you need is 2 minutes
              </h5>
            </div>
            <Divider flexItem orientation="vertical" />
            <div className={classes.feature}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 40C0 44.4183 3.58172 48 8 48H40C44.4183 48 48 44.4183 48 40V8C48 3.58172 44.4183 0 40 0H8C3.58172 0 0 3.58172 0 8V40Z"
                  fill="#0F6937"
                  fillOpacity="0.1"
                />
                <path
                  d="M39.8944 21.888C39.8816 21.9568 39.872 22.024 39.8576 22.0912C39.784 22.448 39.6832 22.7968 39.5504 23.1328C39.5424 23.1536 39.5312 23.1728 39.5232 23.1936C39.2272 23.9216 38.8 24.5904 38.2592 25.168C38.352 25.5744 38.4 25.9856 38.4 26.4C38.4 26.7808 38.3616 27.1568 38.2864 27.52C38.2496 27.704 38.1776 27.8736 38.1216 28.0512C38.0672 28.224 38.0304 28.4032 37.96 28.5696C37.672 29.2512 37.2528 29.8624 36.7344 30.3744C36.7776 30.6512 36.8 30.9264 36.8 31.2C36.8 33.5456 35.344 35.6 33.2176 36.4192C32.4 38.544 30.3456 40 28 40C26.432 40 25.0176 39.3488 24 38.3072C22.9824 39.3488 21.568 40 20 40C17.6544 40 15.6 38.544 14.7824 36.4192C12.656 35.6 11.2 33.5456 11.2 31.2C11.2 30.9264 11.2224 30.6512 11.264 30.376C10.7456 29.864 10.3264 29.2512 10.0384 28.5712C9.9712 28.4112 9.936 28.2368 9.8832 28.0704C9.8256 27.888 9.752 27.7104 9.7136 27.52C9.6384 27.1552 9.6 26.7808 9.6 26.4C9.6 25.9856 9.648 25.576 9.7408 25.1712L9.736 25.1648C9.1968 24.5872 8.7696 23.92 8.4752 23.192C8.4672 23.1728 8.4576 23.1552 8.4496 23.136C8.3168 22.7984 8.216 22.448 8.1408 22.0912C8.1264 22.024 8.1168 21.9568 8.104 21.8896C8.0432 21.5312 8 21.168 8 20.8C8 20.408 8.048 20.0288 8.1152 19.6544C8.1328 19.5616 8.1504 19.4704 8.1712 19.3776C8.2544 19.016 8.3568 18.6608 8.4992 18.3232C8.5088 18.3008 8.5232 18.28 8.5328 18.256C8.6672 17.9472 8.832 17.6544 9.0144 17.3712C9.0752 17.2768 9.1376 17.184 9.2016 17.0928C9.3696 16.8592 9.5504 16.6384 9.7488 16.4288C9.864 16.3072 9.984 16.1952 10.1088 16.0832C10.2704 15.9376 10.4368 15.7968 10.6128 15.6672C10.7712 15.5504 10.9344 15.4432 11.104 15.3408C11.1376 15.3216 11.1664 15.296 11.2 15.2768C11.2 15.2496 11.2 15.2256 11.2 15.1984C11.2 12.3648 13.3136 10.0176 16.048 9.648C17.0944 8.5936 18.4976 8 20 8C21.568 8 22.9824 8.6512 24 9.6928C25.0176 8.6512 26.432 8 28 8C29.5024 8 30.9056 8.5936 31.952 9.6496C34.6864 10.0192 36.8 12.3664 36.8 15.2C36.8 15.2272 36.8 15.2512 36.8 15.2784C36.8336 15.2976 36.8624 15.3216 36.896 15.3424C37.0656 15.4448 37.2288 15.552 37.3872 15.6688C37.5648 15.7984 37.7296 15.9392 37.8912 16.0848C38.0144 16.1968 38.136 16.3088 38.2512 16.4304C38.4496 16.6384 38.6304 16.8608 38.7984 17.0944C38.864 17.1856 38.9264 17.2784 38.9856 17.3728C39.1664 17.656 39.3312 17.9488 39.4672 18.2576C39.4768 18.28 39.4912 18.3008 39.5008 18.3248C39.6432 18.6624 39.7456 19.0176 39.8288 19.3792C39.8496 19.4704 39.8672 19.5616 39.8848 19.656C39.952 20.0288 40 20.408 40 20.8C40 21.168 39.9568 21.5312 39.8944 21.888ZM22.4 13.6C22.4 12.2768 21.3232 11.2 20 11.2C19.2512 11.2 18.5568 11.552 18.0928 12.1664C17.7904 12.5664 17.3184 12.8016 16.816 12.8016C16.7968 12.8016 16.7776 12.8016 16.7568 12.8C15.728 12.8192 14.864 13.4912 14.5424 14.4144C15.3792 14.4336 16.192 14.5984 16.9584 14.9312C17.768 15.2848 18.1376 16.2288 17.7856 17.0368C17.432 17.848 16.4896 18.2192 15.68 17.8656C15.2752 17.6896 14.8448 17.6 14.4 17.6C14.0736 17.6 13.7648 17.664 13.4688 17.7536C13.4576 17.7568 13.4512 17.7664 13.44 17.7696C12.776 17.9808 12.2224 18.3872 11.8304 18.9104C11.8256 18.9168 11.8192 18.9232 11.8144 18.9312C11.6352 19.1744 11.5008 19.4464 11.3968 19.7328C11.3776 19.7856 11.3632 19.84 11.3472 19.8944C11.2592 20.184 11.2 20.4864 11.2 20.8C11.2 21.2336 11.3072 21.6512 11.472 22.0416C11.6976 22.5664 12.048 23.0336 12.5376 23.3872C12.7168 23.5168 12.8512 23.6816 12.9584 23.8608C12.9616 23.8656 12.9616 23.8704 12.9648 23.8752C13.0624 24.04 13.1248 24.2176 13.1584 24.4032C13.1664 24.4448 13.1632 24.4864 13.168 24.5296C13.1824 24.6768 13.1808 24.8208 13.1536 24.9696C13.1424 25.0368 13.12 25.0992 13.1008 25.1632C13.0784 25.232 13.0752 25.304 13.0432 25.3712C12.8816 25.712 12.8 26.0592 12.8 26.4C12.8 26.5904 12.8272 26.7744 12.872 26.9552C12.8832 27.0016 12.8992 27.0448 12.9136 27.0896C12.9552 27.2272 13.008 27.3616 13.0736 27.4896C13.0928 27.5264 13.112 27.5632 13.1328 27.5984C13.3248 27.9248 13.592 28.2112 13.928 28.424C13.928 28.424 13.9312 28.4272 13.9344 28.4288C14.3024 28.6608 14.7344 28.8 15.2 28.8C15.528 28.8 15.8432 28.736 16.1392 28.6096C16.9504 28.2576 17.8912 28.6384 18.24 29.4496C18.5872 30.2624 18.2112 31.2032 17.3984 31.5504C16.7024 31.848 15.9632 32 15.2 32C14.9712 32 14.752 31.9584 14.5296 31.9328C14.7952 32.7504 15.4768 33.3904 16.3616 33.5536C17.0144 33.6736 17.5264 34.1856 17.6464 34.8384C17.856 35.9744 18.8464 36.8 20 36.8C21.3232 36.8 22.4 35.7232 22.4 34.4V13.6ZM36.6544 19.8944C36.6384 19.84 36.6224 19.7856 36.6048 19.7328C36.5008 19.4464 36.3664 19.1744 36.1872 18.9312C36.1824 18.9248 36.176 18.9184 36.1712 18.9104C35.7792 18.3872 35.2256 17.9792 34.5616 17.7696C34.5504 17.7664 34.544 17.7568 34.5328 17.7536C34.2352 17.664 33.9264 17.6 33.6 17.6C33.1552 17.6 32.7248 17.6896 32.3216 17.8656C31.5088 18.2224 30.568 17.8464 30.216 17.0368C29.8624 16.2272 30.232 15.2832 31.0432 14.9312C31.808 14.5984 32.6224 14.4336 33.4592 14.4144C33.136 13.4896 32.2736 12.8176 31.2448 12.8C30.7072 12.8464 30.2224 12.5808 29.9088 12.1664C29.4432 11.552 28.7488 11.2 28 11.2C26.6768 11.2 25.6 12.2768 25.6 13.6V34.4C25.6 35.7232 26.6768 36.8 28 36.8C29.1536 36.8 30.144 35.9744 30.3536 34.8368C30.4736 34.184 30.9856 33.672 31.6384 33.552C32.5232 33.3888 33.2048 32.7488 33.4704 31.9312C33.248 31.9584 33.0288 32 32.8 32C32.0368 32 31.2976 31.848 30.6 31.5504C29.7872 31.2032 29.4112 30.2624 29.7584 29.4496C30.1056 28.6384 31.0448 28.256 31.8592 28.6096C32.1568 28.736 32.472 28.8 32.8 28.8C33.2656 28.8 33.6976 28.6608 34.0656 28.4304C34.0656 28.4304 34.0688 28.4272 34.072 28.4256C34.408 28.2128 34.6752 27.9264 34.8672 27.6C34.888 27.5648 34.9072 27.528 34.9264 27.4912C34.9936 27.3632 35.0448 27.2288 35.088 27.0896C35.1008 27.0448 35.1184 27.0016 35.1296 26.9552C35.1728 26.7744 35.2 26.5904 35.2 26.4C35.2 26.0576 35.1184 25.712 34.9568 25.3728C34.9248 25.3056 34.9216 25.2336 34.8992 25.1648C34.8784 25.0992 34.8576 25.0368 34.8448 24.9696C34.8176 24.8224 34.816 24.6768 34.8304 24.5296C34.8352 24.4864 34.832 24.4448 34.84 24.4032C34.8736 24.216 34.9376 24.0384 35.0352 23.8736C35.0384 23.8704 35.0384 23.8656 35.04 23.8608C35.1488 23.6816 35.2832 23.5152 35.4624 23.3872C35.9504 23.0352 36.3024 22.5664 36.528 22.0416C36.6928 21.6512 36.8 21.2336 36.8 20.8C36.8 20.4864 36.7408 20.184 36.6544 19.8944Z"
                  fill="#0F6937"
                />
              </svg>

              <h4>Watch us perform our Magic</h4>
              <h5 style={{ marginBottom: '32px' }}>
                Sit back and witness the marvel of AI technology. Amoro
                transforms your responses into well-crafted email content
              </h5>
            </div>
          </div>
        </div>
        <div className={classes.blogContainer} id="blog">
          <div className={classes.blogHeaderContainer}>
            <h2>Articles</h2>
            {/* <h3>
              explore the groundbreaking world of pharmaceutical communication as
              we delve into the capabilities of our cutting-edge SaaS platform
            </h3> */}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div className={`${classes.blogRow} home-blog-card`}>
              {blogs.slice(0, 3).map((blog: any) => (
                <div
                  key={blog.id}
                  // href={`/blog/${blog.slug}`}
                  onClick={(e) => hanldeClickBlog(blog.slug, e)}
                  style={{
                    textDecoration: 'none',
                    color: '#111928',
                    //marginBottom: '10px',
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
        </div>
        <div className={classes.CTA}>
          <div className={classes.CTAContainer}>
            <div className={classes.CTAHeaderContainer}>
              <h2>Get started with Amoro today</h2>
              <h3>
                Free trial available. No obligations, 100% refund guarantee
              </h3>
            </div>

            <div className={classes.buttonContainer}>
              <LoginButtonGroup />
            </div>
          </div>
          {/* <div className={classes.footer}>
            <div className={classes.footerRow}>
              <p style={{ fontSize: '1rem', fontWeight: 500, color: '#000' }}>
                SINGAPORE
              </p>
            </div>
            <div className={classes.footerRow}>
              <span> APAC Headquarters</span>
            </div>
            <div
              className={classes.footerRow}
              style={{ justifyContent: 'space-between' }}
            >
              <p>205 Balestier Road #02-06 The Mezzo Singapore 329682</p>
              <Link
                href="https://www.linkedin.com/company/95053578/admin/feed/posts/"
                target="_blank"
              >
                <img
                  className={classes.linkedInLogoDesktop}
                  src="/homepage/linkedin.svg"
                  alt="LinkedIn logo"
                />
              </Link>
            </div>
            <div className={classes.footerRow} style={{ alignItems: 'center' }}>
              <img src="/homepage/mailbox.svg" alt="LinkedIn logo" />
              <a href="mailto:contactreiainow@gmail.com">hello@amoro.ai</a>
            </div>
            <div style={{ width: '100%' }}>
              <img
                className={classes.linkedInLogoMobile}
                src="/homepage/linkedin.svg"
                alt="LinkedIn logo"
              />
            </div>
            <div className={classes.hr}></div>
            <div className={classes.footerCopyright}>
              <img src="/amoro-logo.png" alt="logo" />
              <p>
                <Link
                  onClick={() => setTermsofUseModal(true)}
                  href={isDesktop ? '#' : '/privacy-policy'}
                >
                  <span
                    style={{
                      color: '#0f6937',
                      paddingRight: '10px',
                      textDecoration: 'underline',
                    }}
                  >
                    Privacy Policy
                  </span>
                </Link>
                © 2023 amoro.ai, Inc. All rights reserved.
              </p>
            </div>
            <TermsofUseModal />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
