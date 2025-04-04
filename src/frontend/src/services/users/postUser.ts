import { ApiContext, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * ユーザ登録API
 * @param email - emailアドレス
 * @returns ユーザ
 */
const postUser = async (email: string): Promise<User> => {
  const body = {
    email: email,
  };
  return await fetcher(`${context.apiRootUrl?.replace(/\/$/g, '')}/users/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export default postUser;
