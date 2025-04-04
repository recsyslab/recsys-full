import Link from 'next/link';
import React from 'react';
import AccountMenu from './ui/AccountMenu';
import { ButtonSignIn } from './auth/ButtonSignIn';
import { auth } from '@/auth';

const Header = async () => {
  const session = await auth();

  return (
    <header className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">
      <div>
        <h1 className="text-2xl font-extrabold">
          <Link href="/">recsys-full</Link>
        </h1>
      </div>
      <div>
        <nav className="flex items-center justify-between text-sm font-medium">
          <div className="p-2">
            <Link href="/about/">About</Link>
          </div>
          {!session?.user ? (
            <div className="p-2">
              <ButtonSignIn provider="Google" />
            </div>
          ) : (
            <AccountMenu />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
