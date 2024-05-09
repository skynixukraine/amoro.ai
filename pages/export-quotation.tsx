import { PriceType } from '@/common/types';
import ExportQuotation from '@/components/quotation/ExportQuotationForm';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import axios from '@/common/config';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ExportQuotationPage() {
  const router = useRouter();
  const [prices, setPrices] = useState<any>([]);

  useEffect(() => {
    hanldeGetPricing();
  }, []);

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
  return <ExportQuotation prices={prices} />;
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
