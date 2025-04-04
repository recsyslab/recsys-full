'use client';
import { signIn } from 'next-auth/react';

type Props = {
  provider: string;
};

export function ButtonSignIn(props: Props) {
  return (
    <button className="cursor-pointer" onClick={() => signIn(props.provider)}>
      Sign In
    </button>
  );
}
