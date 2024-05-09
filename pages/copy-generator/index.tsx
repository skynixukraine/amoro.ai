import CopyOptimizerFormFields from '@/components/standard-template/CopyOptimizerFormFields';
import {
  Box,
  Grid, // Import Grid from Material-UI
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import CopyGeneratorFormFields from '@/components/standard-template/CopyGeneratorFormFields';
import CopyToLayout from '@/components/standard-template/CopyToLayout';
import { CallToAction } from '@/components/CallToAction';
import ExportToHTML from '@/components/standard-template/ExportToHTML';
import { ContentItem } from '@/components/ContentItem';
import StepperComponent from '@/components/Stepper';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSubscriptionType } from '@/services/stripe.service';
import { FooterContentType, StepType, EmailContent } from '@/common/types';
import { PageContextProvider } from '@/context';
import StepperLayout from '@/components/layouts/StepperLayout';
import { standardFormDefaultValues, layoutValues } from '@/common/constants';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import useWindowSize from '@/hooks/useWindowSize';
import axios from '@/common/config';
import { getQuotationType } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CopyGenerator = () => {
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
  const router = useRouter();
  let currentId: number | undefined = undefined;
  if (typeof router.query.id === 'string') {
    currentId = parseInt(router.query.id, 10);
  }
  const { id } = router.query;
  const { data: session } = useSession();
  // Add the new steps to the steps array
  const [pi, setPi] = useState(initSaveDraft?.pi ?? '');
  const [veevaApprovalFlag, setVeevaApprovalFlag] = useState(
    initSaveDraft?.veevaApprovalFlag ?? 'no'
  );
  const [veevaApproval, setVeevaApproval] = useState('');
  const [imageWidth, setImageWidth] = useState(300);
  const [veevaZipFile, setVeevaZipFile] = useState<Blob>(new Blob());
  const [user, setUser] = useState<any>();
  const [saveDraft, setSaveDraft] = useState<any>(initSaveDraft);
  const [status, setStatus] = useState<any>();
  const [subscriptionType, setSubscriptionType] = useState<any>('free');
  const sizes = useWindowSize();
  const isMobile = sizes.width && sizes.width <= 767;

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
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeGetContent = async () => {
    await axios.get(`/api/content/${id}`).then((res) => {
      let content = res.data.standardLayout[0];
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
  const steps: Array<StepType> = [
    {
      title: 'Generator',
      description: 'Create a first draft',
      component: (
        <CopyGeneratorFormFields
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          setPi={setPi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          setVeevaApprovalFlag={setVeevaApprovalFlag}
          user={user}
        />
      ),
    },
    {
      title: 'Optimisation',
      description: 'Enhance and paraphrase copy',
      component: (
        <CopyOptimizerFormFields
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          setPi={setPi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          veevaApproval={veevaApproval}
          setVeevaApproval={setVeevaApproval}
          imageWidth={imageWidth}
          setImageWidth={setImageWidth}
        />
      ),
    },
    {
      title: 'Preview the emailer',
      description: 'Prepare copy for design',
      component: (
        <CopyToLayout
          handleNext={() => {}}
          handleBack={() => {}}
          pi={pi}
          userId={user?.id}
          veevaApprovalFlag={veevaApprovalFlag}
          veevaApproval={veevaApproval}
          imageWidth={imageWidth}
          setVeevaZipFile={setVeevaZipFile}
        />
      ),
    },
    {
      title: 'Export to HTML/PDF',
      description: 'Export for MLR approval or deployment',
      component: (
        <ExportToHTML
          pi={pi}
          veevaApproval={veevaApproval}
          veevaApprovalFlag={veevaApprovalFlag}
          handleNext={() => {}}
          handleBack={() => {}}
          veevaZipFile={veevaZipFile}
          userId={user?.id}
          subscriptionType={subscriptionType}
          user={user}
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
      formData={saveDraft?.formData || standardFormDefaultValues}
      optimizer={saveDraft?.optimizer}
      layout={saveDraft?.layout || layoutValues}
      currentId={currentId}
    >
      {isMobile && <BackButton url="/home" text="Back to home" />}
      <StepperLayout steps={steps} stepIndex={stepIndex} />
    </PageContextProvider>
  );
};

export default CopyGenerator;
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
//   let saveDraft = {
//     formData: '',
//     optimizer: {
//       formData: [],
//       emailContent: '',
//     },
//     layout: '',
//     pi: '',
//     veevaApprovalFlag: 'no',
//   };
//   let status = '';
//   const { query } = context;
//   if (query.id) {
//     const dataContent = await axios.get(`/api/content/${query.id}`);
//     const content = dataContent.data;
//     // await Content.findOne({ where: { id: query.id } });
//     if (content) {
//       saveDraft = content.standardLayout[0];
//       status = content.status;
//     }
//   }
//   // @ts-expect-error
//   const session = await getServerSession(context.req, context.res);

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   const email = session.user?.email;
//   if (!email)
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   const dataUsers = await axios.get(`/api/user`);
//   const user = dataUsers.data.find((item: any) => item.email === email);
//   // await User.findOne({ where: { email } });

//   if (!user)
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };

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
//       saveDraft,
//       status,
//       user: user,
//     },
//   };
// };
