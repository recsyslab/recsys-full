'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/useAuth';

import ListMovieRated from '../components/ui/list/ListMovieRated';
import ListMovieBPR from '../components/ui/list/ListMovieBPR';
import { STYLES } from '@/constants';

const MyPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    router.replace('/signin');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className={`${STYLES.LOADING_PAGE}`}>
        <div className={`${STYLES.LOADING_SPINNER}`}></div>
      </div>
    );
  }

  return (
    <>
      <ListMovieRated />
      <ListMovieBPR />
    </>
  );
};

export default MyPage;
