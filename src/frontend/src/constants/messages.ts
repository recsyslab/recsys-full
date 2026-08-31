/**
 * メッセージの定数
 */
export const MESSAGES = {
  SIGN_UP_SUCCESS: 'ユーザ登録が完了しました。サインインしてください。',
  DUMMY_IMAGE_LOADED: 'ダミー画像が読み込まれました',
} as const;

/**
 * エラーメッセージの定数
 */
export const ERROR_MESSAGES = {
  // 汎用エラーメッセージ生成関数
  ERROR_IN_METHOD: (methodName: string) => `Error in ${methodName}:`,

  // API関連
  API_REQUEST_ERROR: 'APIリクエスト中にエラーが発生しました',
  MOVIE_GET_FAILED: '映画リストの取得に失敗しました。時間をおいて再度お試しください。',

  // 認証関連
  EMAIL_AND_PASSWORD_REQUIRED: 'メールアドレスとパスワードを入力してください。',
  SIGN_UP_FAILED: 'サインアップに失敗しました。時間をおいて再度お試しください。',
  SIGN_IN_FAILED: 'サインインに失敗しました。メールアドレスとパスワードを確認してください。',
  USER_NOT_AUTHENTICATED: 'ユーザが認証されていません',
} as const;
