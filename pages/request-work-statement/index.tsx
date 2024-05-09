import { PriceType, WorkStatementType } from '@/common/types';
import RequestWorkStatement from '@/components/workStatement/RequestWorkStatementForm';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
export default function ExportQuotationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [prices, setPrices] = useState<PriceType[]>([]);
  const [workStatements, setWorkStatements] = useState<WorkStatementType[]>([]);
  const [user, setUser] = useState<any>();
  useEffect(() => {
    hanldeGetPricing();
  }, []);
  useEffect(() => {
    if (session) {
      hanldeGetUser(session.user.email);
      hanldeGetWorkStatement();
    }
  }, [session]);
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
  const hanldeGetPricing = async () => {
    await axios
      .get('/api/pricing')
      .then((res) => {
        setPrices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const hanldeGetWorkStatement = async () => {
    await axios
      .get('api/workStatement')
      .then((res) => {
        const data = res.data.filter(
          (work: any) => work.user_id === Number(user.id) && !work.paidDate
        );
        setWorkStatements(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <RequestWorkStatement prices={prices} workStatements={workStatements} />
  );
}
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

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }
//   const priceDatas = await axios.get('/api/pricing');
//   const prices = priceDatas.data;

//   const userDatas = await axios.get('/api/user');
//   const user: any = userDatas?.data?.find(
//     (item: any) => item.email === session.user?.email
//   );
//   //    await User.findOne({
//   //     where: { email: session.user?.email },
//   //   });
//   let workStatements: any = [];
//   let workStatementData = await axios.get('api/workStatement');
//   if (user && user?.id) {
//     // workStatements = await workStatementData.data.findAll({
//     //   raw: true,
//     //   order: [['id', 'ASC']],
//     //   include: Pricing,
//     //   where: { user_id: Number(user?.id), paidDate: null },
//     // });
//     workStatements = workStatementData.data.filter(
//       (work: any) => work.user_id === Number(user.id) && !work.paidDate
//     );
//   }

//   return {
//     props: {
//       prices: prices,
//       workStatements: workStatements,
//     },
//   };
// };
