'use client';

import Link from 'next/link';

import { STYLES, SETTINGS } from '@/constants';
import useAuth from '@/hooks/useAuth';

import AccountMenu from './ui/header/AccountMenu';
import { ButtonSignUp } from './auth/ButtonSignUp';
import { ButtonSignIn } from './auth/ButtonSignIn';

const Header = () => {
  // JWT の有効期限を監視し、タイムアウト時に自動で未認証状態へ切り替える
  const { isAuthenticated } = useAuth();

  return (
    <header className={`${STYLES.HEADER}`}>
      <div>
        <h1 className={`${STYLES.HEADER_APP_NAME}`}>
          <Link href="/">{SETTINGS.APP_NAME}</Link>
        </h1>
      </div>
      <div>
        <nav className={`${STYLES.HEADER_MENU}`}>
          <Link href="/about/">About</Link>
          {!isAuthenticated ? (
            <>
              <ButtonSignUp />
              <ButtonSignIn />
            </>
          ) : (
            <AccountMenu />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
