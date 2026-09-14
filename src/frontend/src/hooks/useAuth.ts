'use client';

import { useEffect, useState } from 'react';

/**
 * JWT の有効期限を監視し、認証状態を返すカスタムフック。
 *
 * - ローカルストレージの access トークンを読み取り、exp クレームを検証する。
 * - 有効期限が切れたタイミングで自動的にトークンを削除し、未認証状態へ遷移する。
 * - isLoading が true の間は判定中なので、UI はローディング表示にすること。
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const access = localStorage.getItem('access');
    if (!access) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const clearAuth = () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setIsAuthenticated(false);
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const payload = JSON.parse(atob(access.split('.')[1]));
      const msUntilExpiry = payload.exp * 1000 - Date.now();
      if (msUntilExpiry <= 0) {
        clearAuth();
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
      // 有効期限ちょうどに未認証状態へ切り替える
      timer = setTimeout(clearAuth, msUntilExpiry);
    } catch {
      clearAuth();
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuth;
