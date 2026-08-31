import { ApiContext, User } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export type SignUpResponse = {
  user: User;
  access: string;
  refresh: string;
};

/**
 * サインアップAPI
 * @param email - emailアドレス
 * @param password - パスワード
 * @returns ユーザ + JWTトークン
 */
const signUp = async (email: string, password: string): Promise<SignUpResponse> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/accounts/signup/`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({ email, password });

  return await fetcher(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });
};

export default signUp;
