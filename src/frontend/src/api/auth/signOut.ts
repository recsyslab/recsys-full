import { ApiContext } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * サインアウトAPI
 */
const signOut = async (): Promise<void> => {
  const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;

  // 即 localStorage を削除（成功失敗関係なく）
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  if (!access) return;

  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/accounts/signout/`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access}`,
  };
  const body = JSON.stringify({ refresh });

  return await fetcher(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });
};

export default signOut;
