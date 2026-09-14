'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '@/types/data';
import { STYLES } from '@/constants';
import getMyAccount from '@/api/auth/getMyAccount';
import useAuth from '@/hooks/useAuth';

const MyAccountPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    router.replace('/signin');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const user = await getMyAccount();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    load();
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className={`${STYLES.LOADING_PAGE}`}>
        <div className={`${STYLES.LOADING_SPINNER}`}></div>
      </div>
    );
  }

  return (
    <>
      <div className={`${STYLES.MY_ACCOUNT_PAGE}`}>
        <div className={`${STYLES.MY_ACCOUNT_PAGE_CARD}`}>
          <h1 className={`${STYLES.MY_ACCOUNT_PAGE_TITLE}`}>マイアカウント</h1>
          <div className={`${STYLES.MY_ACCOUNT_LABEL}`}>ユーザID: {user?.user_id}</div>
          <div className={`${STYLES.MY_ACCOUNT_LABEL}`}>メールアドレス: {user?.user_email}</div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
