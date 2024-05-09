import { QuotationType } from '@/common/types';
import QuotationDetail from '@/components/quotation/QuotationDetail';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function QuotationDetailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  const [quotation, setQuotation] = useState<QuotationType>();
  useEffect(() => {
    if (session) {
    }
  }, [session]);
  useEffect(() => {
    if (id && typeof id === 'string') {
      hanldeGetQuotation(id);
    }
  }, [id]);
  const hanldeGetQuotation = async (id: string) => {
    await axios
      .get(`/api/quotation/${id}`)
      .then((res) => {
        setQuotation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return <>{quotation && <QuotationDetail quotation={quotation} />}</>;
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
      email: '',
    },
  };
};
