import { WorkStatementType } from '@/common/types';
import WorkStatementDetail from '@/components/workStatement/WorkStatementDetail';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

export default function QuotationDetailPage() {
  const router = useRouter();
  const [workStatement, setWorkStatement] = useState<WorkStatementType>();
  const { id } = router.query;

  useEffect(() => {
    hanldeGetWorkStatement();
  }, []);
  const hanldeGetWorkStatement = async () => {
    if (id) {
      await axios
        .get(`/api/workStatement/${id}`)
        .then((res) => {
          setWorkStatement(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return <WorkStatementDetail workStatement={workStatement} />;
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
