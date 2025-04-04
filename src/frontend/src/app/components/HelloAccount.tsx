'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

const HelloAccount = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : !session?.user ? (
        <div>ようこそ ゲスト さん！</div>
      ) : (
        <div>ようこそ {session.user.name} さん！</div>
      )}
    </>
  );
};

export default HelloAccount;
