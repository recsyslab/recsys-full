'use client';

import React, { useState } from 'react';

import { ERROR_MESSAGES, STYLES } from '@/constants';
import { getFunctionName } from '@/utils';

import signIn from '@/api/auth/signIn';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      const { access, refresh } = await signIn(email, password);

      if (typeof window !== 'undefined') {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      }

      window.location.href = '/';
    } catch (error: any) {
      console.error(ERROR_MESSAGES.ERROR_IN_METHOD(getFunctionName()), error);
      setError(ERROR_MESSAGES.SIGN_IN_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${STYLES.SIGN_PAGE}`}>
      <div className={`${STYLES.SIGN_PAGE_CARD}`}>
        <h1 className={`${STYLES.SIGN_PAGE_TITLE}`}>Sign In</h1>
        <form onSubmit={handleSignIn} className={`${STYLES.SIGN_FORM}`}>
          <div className={`${STYLES.SIGN_FORM_LABEL_INPUT}`}>
            <label className={`${STYLES.SIGN_FORM_LABEL}`} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`${STYLES.SIGN_FORM_INPUT}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={`${STYLES.SIGN_FORM_LABEL_INPUT}`}>
            <label className={`${STYLES.SIGN_FORM_LABEL}`} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`${STYLES.SIGN_FORM_INPUT}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <p className={`${STYLES.SIGN_FORM_ERROR}`}>{error}</p>}

          <button type="submit" className={`${STYLES.SIGN_FORM_BUTTON}`} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={`${STYLES.SIGN_FORM_HINT}`}>
          アカウントをお持ちでない場合は{' '}
          <a href="/signup" className={`${STYLES.LINK}`}>
            Sign Up
          </a>{' '}
          してください。
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
