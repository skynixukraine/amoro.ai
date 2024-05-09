import AdminSidebar from '@/components/layouts/DesktopAdminLayout';
import React, { useEffect, useState } from 'react';
import axios from '@/common/config';
import AdminDashboardComponent from '@/components/AdminDashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>();
  const { start, end } = router.query;
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (session) {
      hanldeGetData();
      hanldeGetUser(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role)) {
        router.push('/admin/login');
      }
    }
  }, [user]);

  const hanldeGetData = async () => {
    if (start && end) {
      await axios(`/api/admin?start=${start}&end=${end}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios('/api/admin')
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const hanldeGetUser = async (email: any) => {
    await axios
      .get(`/api/user/get-by-email?email=${email}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AdminSidebar>
      <>{data && <AdminDashboardComponent {...data} />}</>
    </AdminSidebar>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  const redirectObject = {
    redirect: {
      destination: '/admin/login',
      permanent: false,
    },
  };

  if (!session) return redirectObject;
  const userData = await axios.get(
    `/api/user/get-by-email?email=${session.user?.email}`
  );

  const user: any = userData.data;
  if (!['MainOwner', 'Owner', 'Admin', 'Writer'].includes(user?.role))
    return redirectObject;

  return {
    props: { user },
  };
};
