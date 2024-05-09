import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState, useLayoutEffect } from 'react';
// import axios from 'axios';
import axios from '@/common/config';
import classes from '../../components/Home.module.css';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import Cookie from 'js-cookie';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from '@mui/material';

import moment from 'moment';
import ModalConfirm from '@/components/ModalConfirm';
import ProgressBar from '@/components/ProgressBar';
import { sanitizeAndTruncateText } from '@/lib/utils';
import useWindowSize from '@/hooks/useWindowSize';
import { useSaveContent } from '@/hooks/useSaveContent';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface postType {
  createdAt: string;
  id: number;
  userId: number;
}

const Home = () => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const lastLogin = Cookie.get('lastLogin');
  const router = useRouter();
  const { data: session } = useSession();
  const { userId } = router.query;
  const [posts, setPosts] = useState([]);
  const [openCardModal, setOpenCardModal] = React.useState<number>();
  const [isOpening, setIsOpening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>();
  const { saveContent } = useSaveContent();

  useEffect(() => {
    if (session) {
      if (userId) {
        hanldeGetUser();
      } else {
        hanldeGetUser(session?.user?.email);
      }
    }
  }, [session]);
  useEffect(() => {
    getData();
  }, [user, router.pathname, openCardModal]);
  // useEffect(() => {
  //   if (user) {
  //     hanldeLastLogin(user);
  //   }
  // }, [user]);

  const hanldeGetUser = async (email?: any) => {
    if (userId) {
      await axios
        .get(`/api/user/${userId}`, {
          headers: {
            'x-api-key': API_KEY,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .get(`/api/user/get-by-email?email=${email}`, {
          headers: {
            'x-api-key': API_KEY,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // const hanldeLastLogin = async (user: any) => {
  //   if (!lastLogin) {
  //     await axios
  //       .put(`/api/user/${user.id}`, { lastLogin: new Date() })
  //       .then((res) => {
  //         console.log('res', res);

  //         Cookie.set('lastLogin', 'login');
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  const handleButtonClick = (post: string) => {
    setIsOpening(true);
    router.push(post);
  };

  function getData() {
    setIsLoading(true);
    axios
      .get(`/api/content?userId=${user?.id}`, {
        headers: {
          'x-api-key': API_KEY,
        },
      })
      .then((response) => {
        setPosts(response.data);
        console.log(getName(response.data[0]));

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      });
  }

  // useLayoutEffect(() => {
  //   getData();
  // }, []);

  // Fetch data when the component mounts

  const getLink = ({ id, standardLayout, videoLayout }: any) => {
    if (standardLayout[0]?.formData) {
      return `/copy-generator?id=${id}`;
    } else if (videoLayout[0]?.formData) {
      return `/video-email-generator?id=${id}`;
    } else {
      return `/speaker-email-generator?id=${id}`;
    }
  };

  const sizes = useWindowSize();

  const getName = ({ standardLayout, videoLayout, invitationLayout }: any) => {
    if (standardLayout[0]?.formData) {
      return (
        [
          standardLayout[0]?.formData?.emailType,
          standardLayout[0]?.optimizer?.formData[0] &&
            standardLayout[0]?.optimizer?.formData[0].value,
        ] || ['Untitled[Standard]', '']
      );
    } else if (videoLayout[0]?.formData) {
      return (
        [
          videoLayout[0]?.formData?.aboutVideo,
          videoLayout[0]?.optimizer.formData[0] &&
            videoLayout[0]?.optimizer?.formData[0].value,
        ] || ['Untitled[Video]', '']
      );
    } else {
      return (
        [
          invitationLayout[0]?.formData?.eventType,
          invitationLayout[0]?.optimizer?.formData[0] &&
          invitationLayout[0]?.optimizer.formData[0].type === 'subject'
            ? invitationLayout[0]?.optimizer?.formData[0].value
            : invitationLayout[0]?.formData?.bodyText1,
        ] || ['Untitled[Event]', '']
      );
    }
  };

  const getImage = ({ standardLayout, videoLayout, invitationLayout }: any) => {
    let standardData = standardLayout[0]?.formData;
    let videoData = videoLayout[0]?.formData;
    let eventData = invitationLayout[0]?.formData;
    if (standardData) {
      return (
        (standardData?.contents &&
          standardData?.contents[0] &&
          standardData?.contents[0]?.image) ||
        'amoro-logo-cover.png'
      );
    } else if (videoData) {
      return videoData?.videoThumbnail || 'amoro-logo-cover.png';
    } else {
      return eventData?.attachment || 'amoro-logo-cover.png';
    }
  };

  const deleteDraft = (id: number) => {
    axios
      .delete(`/api/content/${id}`)
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
        setOpenCardModal(undefined);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setOpenCardModal(undefined);
      });
  };

  const onSaveButtonClick = async (post: any) => {
    const newId = await saveContent({
      userId: post.userId,
      status: post.status,
      currentId: null,
      standardLayout:
        post.standardLayout && post.standardLayout.length > 0
          ? { ...post.standardLayout[0] }
          : null,
      videoLayout:
        post.videoLayout && post.videoLayout.length > 0
          ? { ...post.videoLayout[0] }
          : null,
      invitationLayout:
        post.invitationLayout && post.invitationLayout.length > 0
          ? { ...post.invitationLayout[0] }
          : null,
    });

    if (newId) {
      getData();
    }
    // setIsLoading(true);
    // const formData = getValues();
    // let { layout, optimizer } = templateData;

    // const newId = await saveContent({
    //   userId,
    //   status: 'Generator',
    //   currentId: templateData.currentId,
    //   standardLayout: {
    //     formData,
    //     optimizer,
    //     layout,
    //     pi,
    //     veevaApprovalFlag,
    //   },
    // });
  };

  return (
    <div className={classes.main}>
      <div className={classes.content_container}>
        {isOpening && (
          <ProgressBar
            message="Opening your masterpiece"
            open={isOpening}
            handleClose={() => {}}
          />
        )}
        {isLoading && (
          <ProgressBar
            message="Loading ..."
            open={isLoading}
            handleClose={() => {}}
          />
        )}
        <div className={classes.hero}>
          <h1>Welcome to Amoro</h1>
          <Link href="/templates" onClick={() => setIsLoading(true)}>
            <Button
              disabled={isLoading || isOpening}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create new email
            </Button>
          </Link>
        </div>
        <Grid container spacing={2}>
          {posts &&
            posts.map((post: any, key: number) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card
                  key={post.id}
                  style={{
                    marginBottom: '16px',
                    backgroundColor: '#fff',
                    height: sizes.width && sizes.width > 768 ? '480px' : 'auto',
                    paddingBottom:
                      sizes.width && sizes.width > 768 ? '50px' : '20px',
                  }}
                  className="cardHome"
                >
                  <Box>
                    <div
                      style={{
                        display: 'flex',
                        height: 300,
                        overflow: 'hidden',
                        backgroundColor: '#0F6937',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt={post.name}
                        height="auto"
                        width={'100%'}
                        image={getImage(post)}
                      />
                    </div>
                    <CardContent>
                      <Box sx={{ height: '100%' }} className="cardContentHome">
                        <Typography
                          // variant="p"
                          component="div"
                          style={{ textTransform: 'capitalize' }}
                          className={classes.cardContentTitle}
                        >
                          {Array.isArray(getName(post))
                            ? getName(post).join(' ').length > 50
                              ? `${getName(post)
                                  .join(' ')
                                  .split(' ')
                                  .slice(0, 6)
                                  .join(' ')}...`
                              : getName(post).join(' ')
                            : getName(post)}
                        </Typography>
                        {/* <Typography component="p">
                        {sanitizeAndTruncateText(getName(post)[1], 8, true)}
                      </Typography> */}
                      </Box>
                    </CardContent>
                  </Box>
                  <Box>
                    <Typography
                      style={{ marginLeft: '16px' }}
                      variant="body2"
                      component="div"
                      className="cardContentDate"
                    >
                      {`Last opened: ${moment(post.updatedAt).format(
                        'DD MMM YYYY'
                      )}`}
                    </Typography>
                    <Box
                      mt={2}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        textDecoration: 'none',
                        padding: '0 16px',
                      }}
                    >
                      <div style={{ width: '100%' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            handleButtonClick(getLink(post));
                          }}
                        >
                          Open
                        </Button>
                      </div>
                      <div
                        style={{ width: '100%', display: 'flex', gap: '5px' }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          style={{ textDecoration: 'none', color: 'white' }}
                          onClick={() => {
                            onSaveButtonClick(post);
                          }}
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="outlined"
                          style={{ textDecoration: 'none' }}
                          onClick={() => {
                            setOpenCardModal(post.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
        <ModalConfirm
          open={openCardModal}
          setOpen={setOpenCardModal}
          deleteDraft={deleteDraft}
        />
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: session?.user.email,
    },
  };
};
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   // @ts-expect-error
//   const session = await getServerSession(context.req, context.res);
//   const { query } = context;
//   const { userId } = query;
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }
//   let user: any;
//   let userDatas = await axios.get('/api/user');
//   if (userId) {
//     user = await userDatas.data.find(
//       (item: any) => item.id === context.query.userId
//       // where: { id: context.query.userId },
//       // attributes: { exclude: ['password'] },
//       // raw: true,
//     );
//   } else {
//     user = await userDatas.data.find(
//       (item: any) => item.email === session.user?.email
//       // where: { email: session.user?.email },
//       // attributes: { exclude: ['password'] },
//       // raw: true,
//       // }
//     );
//   }

//   // const user = await User.findOne({
//   //   where: { email: session.user?.email },
//   //   attributes: { exclude: ['password'] },
//   //   raw: true,
//   // });

//   return {
//     props: {
//       user: user,
//     },
//   };
// };
