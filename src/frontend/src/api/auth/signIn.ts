import { ApiContext } from '@/types/data';
import { fetcher } from '@/utils';

const context: ApiContext = {
  apiRootUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export type SignInResponse = {
  access: string;
  refresh: string;
};

/**
 * サインインAPI
 * @param email - emailアドレス
 * @param password - パスワード
 * @returns JWTトークン(access, refresh)
 */
const signIn = async (email: string, password: string): Promise<SignInResponse> => {
  const url = `${context.apiRootUrl?.replace(/\/$/g, '')}/accounts/signin/`;
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

export default signIn;
