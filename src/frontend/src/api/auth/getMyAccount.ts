import { ApiContext, User } from '@/types/data';
import { ERROR_MESSAGES } from '@/constants';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * アカウント情報取得API
 * @returns ユーザオブジェクト
 */
const getMyAccount = async (): Promise<User> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  if (!access) throw new Error(ERROR_MESSAGES.USER_NOT_AUTHENTICATED);

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/accounts/me/`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${access}`,
  };

  return await fetcher(url, {
    method: 'GET',
    headers: headers,
    cache: 'no-store',
  });
};

export default getMyAccount;
