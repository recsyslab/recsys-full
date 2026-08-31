'use client';

import React, { useState } from 'react';

import { MESSAGES, ERROR_MESSAGES, STYLES } from '@/constants';
import { getFunctionName } from '@/utils';

import signUp from '@/api/auth/signUp';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      alert(MESSAGES.SIGN_UP_SUCCESS);
      window.location.href = '/signin';
    } catch (error: any) {
      console.error(ERROR_MESSAGES.ERROR_IN_METHOD(getFunctionName()), error);
      setError(ERROR_MESSAGES.SIGN_UP_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${STYLES.SIGN_PAGE}`}>
      <div className={`${STYLES.SIGN_PAGE_CARD}`}>
        <h1 className={`${STYLES.SIGN_PAGE_TITLE}`}>Sign Up</h1>
        <form onSubmit={handleSignUp} className={`${STYLES.SIGN_FORM}`}>
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
              autoComplete="new-password"
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
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        <p className={`${STYLES.SIGN_FORM_HINT}`}>
          既にアカウントをお持ちの方は{' '}
          <a href="/signin" className={`${STYLES.LINK}`}>
            Sign In
          </a>{' '}
          してください。
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
