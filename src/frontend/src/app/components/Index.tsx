'use client';

import { useEffect, useState } from 'react';

import { User } from '@/types/data';
import SignInPage from '@/app/signin/page';
import getMyAccount from '@/api/auth/getMyAccount';
import useAuth from '@/hooks/useAuth';

import ListMovieDaily from './ui/list/ListMovieDaily';
import ListMoviePopularitySection from './ui/list/ListMoviePopularitySection';
import ListMovieBPR from './ui/list/ListMovieBPR';

/**
 * インデックスコンポーネント
 *
 * JWT の有効期限を監視し、タイムアウト時にメイン画面をログアウト状態へ切り替える。
 */
const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await getMyAccount();
        setUser(user);
        // setStatus('authenticated');
      } catch {
        setUser(null);
        // setStatus('unauthenticated');
      }
    };
    load();
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : !isAuthenticated ? (
        <SignInPage />
      ) : (
        <>
          <div>ようこそ {user?.user_email} さん！</div>
          <ListMovieDaily />
          <ListMovieBPR />
          <ListMoviePopularitySection />
        </>
      )}
    </>
  );
};

export default Index;
