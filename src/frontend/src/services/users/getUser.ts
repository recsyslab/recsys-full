import { ApiContext, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * ユーザ取得API
 * @param email - emailアドレス
 * @returns ユーザ
 */
const getUser = async (email: string): Promise<User> => {
  const res = await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/users/?email=${email}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  return await res.users.at(0);
};

export default getUser;
