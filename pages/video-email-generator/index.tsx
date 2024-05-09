import { FooterContentType, StepType } from '@/common/types';
import StepperLayout from '@/components/layouts/StepperLayout';
import CopyGeneratorVideoFormFields from '@/components/video-template/FormFields';
import { PageContextProvider } from '@/context';
import OptimizerForm from '@/components/video-template/OptimizerForm';
import Layout from '@/components/video-template/Layout';
import ExportTemplate from '@/components/video-template/ExportTemplate';
import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSubscriptionType } from '@/services/stripe.service';
import { videoFormDefaultValues, layoutValues } from '@/common/constants';
import BackButton from '@/components/BackButton';
import useWindowSize from '@/hooks/useWindowSize';
import axios from '@/common/config';
import { getQuotationType } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProgressBar from '@/components/ProgressBar';

const VideoTemplateGenerator = () => {
  let initSaveDraft: any = {
    formData: '',
    optimizer: {
      formData: [],
      emailContent: '',
    },
    layout: '',
    pi: '',
    veevaApprovalFlag: 'no',
  };

  const [pi, setPi] = useState(initSaveDraft?.pi ?? '');
  const [veevaApprovalFlag, setVeevaApprovalFlag] = useState(
    initSaveDraft?.veevaApprovalFlag ?? 'no'
  );
  const router = useRouter();
  let currentId: number | undefined = undefined;
  if (typeof router.query.id === 'string') {
    currentId = parseInt(router.query.id, 10);
  }

  const [veevaApproval, setVeevaApproval] = useState('');
  const [veevaZipFile, setVeevaZipFile] = useState<Blob>(new Blob());
  const sizes = useWindowSize();
  const { id } = router.query;
  const isMobile = sizes.width && sizes.width <= 767;
  const { data: session } = useSession();
  const [user, setUser] = useState<any>();
  const [saveDraft, setSaveDraft] = useState<any>(initSaveDraft);
  const [status, setStatus] = useState<any>();

  const [subscriptionType, setSubscriptionType] = useState<any>('free');
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (id) {
      hanldeGetContent();
    }
  }, [id]);
  useEffect(() => {
    if (user) {
      handleGetSubscriptionType(user.id);
      handleGetQuotationType(user.id);
    }
  }, [user]);
  const hanldeGetUser = async (email?: any) => {
    await axios
      .get(`/api/user/get-by-email?email=${email}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hanldeGetContent = async () => {
    await axios.get(`/api/content/${id}`).then((res) => {
      let content = res.data.videoLayout[0];
      setSaveDraft(content);
      setStatus(res.data.status);
      setPi(content?.pi ?? '');
      if (content?.veevaApprovalFlag) {
        setVeevaApprovalFlag(content?.veevaApprovalFlag);
      }
    });
  };
  const handleGetSubscriptionType = async (stripeId: string) => {
    await axios
      .get(`/api/subscription?stripeId=${stripeId}`)
      .then((res) => {
        setSubscriptionType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGetQuotationType = async (id: any) => {
    await axios
      .get(`/api/quotation/type?userId=${id}`)
      .then((res) => {
        setSubscriptionType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Add the new steps to the steps array
  const steps: Array<StepType> = [
    {
      title: 'Generator',
      description: 'Create a first draft',
      component: (
        <CopyGeneratorVideoFormFields
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          setPi={setPi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          setVeevaApprovalFlag={setVeevaApprovalFlag}
        />
      ),
    },
    {
      title: 'Optimisation',
      description: 'Enhance and paraphrase copy',
      component: (
        <OptimizerForm
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          setPi={setPi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          veevaApproval={veevaApproval}
          setVeevaApproval={setVeevaApproval}
        />
      ),
    },
    {
      title: 'Preview the emailer',
      description: 'Prepare copy for design',
      component: (
        <Layout
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          veevaApproval={veevaApproval}
          setVeevaZipFile={setVeevaZipFile}
        />
      ),
    },
    {
      title: 'Export to HTML/PDF',
      description: 'Export for MLR approval or deployment',
      component: (
        <ExportTemplate
          veevaZipFile={veevaZipFile}
          handleNext={() => {}}
          handleBack={() => {}}
          userId={user?.id}
          subscriptionType={subscriptionType}
          veevaApproval={veevaApproval}
          veevaApprovalFlag={veevaApprovalFlag}
          user={user}
          pi={pi}
        />
      ),
    },
  ];
  let stepIndex = 0;
  if (status === 'Optimisation') {
    stepIndex = 1;
  } else if (status === 'Preview') {
    stepIndex = 2;
  } else if (status === 'Export') {
    stepIndex = 3;
  }

  if (id && !saveDraft.formData)
    return (
      <ProgressBar message="Loading ..." open={true} handleClose={() => {}} />
    );

  return (
    <PageContextProvider
      formData={saveDraft?.formData || videoFormDefaultValues}
      optimizer={saveDraft?.optimizer}
      layout={saveDraft?.layout || layoutValues}
      currentId={currentId}
    >
      {isMobile && <BackButton url="/home" text="Back to home" />}
      <StepperLayout steps={steps} stepIndex={stepIndex} />
    </PageContextProvider>
  );
};

export default VideoTemplateGenerator;
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
//   // let saveDraft = {
//   //   formData: '',
//   //   optimizer: {
//   //     formData: [],
//   //     emailContent: '',
//   //   },
//   //   layout: '',
//   //   pi: '',
//   //   veevaApprovalFlag: 'no',
//   // };
//   // let status = '';
//   // const { query } = context;
//   // if (query.id) {
//   //   const contentData = await axios.get(`/api/content/${query.id}`);
//   //   const content = contentData.data;
//   //   // await Content.findOne({ where: { id: query.id } });
//   //   if (content) {
//   //     saveDraft = content.videoLayout[0];
//   //     status = content.status;
//   //   }
//   // }

//   // @ts-expect-error
//   const session = await getServerSession(context.req, context.res);

//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: '/',
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   // const email = session.user?.email;
//   // if (!email)
//   //   return {
//   //     redirect: {
//   //       destination: '/',
//   //       permanent: false,
//   //     },
//   //   };
//   // const userData = await axios.get('/api/user');
//   // const user = userData.data.find((item: any) => item.email === email);
//   // // await User.findOne({ where: { email } });

//   // if (!user)
//   //   return {
//   //     redirect: {
//   //       destination: '/',
//   //       permanent: false,
//   //     },
//   //   };

//   const userId = parseInt(user.id);

//   const stripeId = user.stripeCustomerId;
//   const stripeSubscriptionType = await getSubscriptionType(stripeId);

//   const quotationSubscriptionType = await getQuotationType(userId);

//   let subType = 'free';
//   if (
//     stripeSubscriptionType === 'smart' ||
//     quotationSubscriptionType === 'smart'
//   )
//     subType = 'smart';
//   if (
//     stripeSubscriptionType === 'premium' ||
//     quotationSubscriptionType === 'premium'
//   )
//     subType = 'premium';

//   return {
//     props: {
//       userId,
//       currentId: query.id ?? NaN,
//       subscriptionType: subType,
//       // saveDraft,
//       // status,
//       user: user,
//     },
//   };
// };