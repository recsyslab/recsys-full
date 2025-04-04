import React from 'react';
import { auth } from '@/auth';
import connectUser from '@/services/users/connectUser';

const MyAccountPage = async () => {
  await connectUser();
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <>
      <h1>Server Side</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  );
};

export default MyAccountPage;
