/**
 * スタイル関連の定数
 */
export const STYLES = {
  // HTML、BODY、MAIN関連
  HTML: `h-full antialiased`,
  BODY: `flex min-h-screen flex-col bg-gray-100 text-gray-700 antialiased`,
  MAIN: `grow`,
  LINK: `font-semibold text-indigo-600 hover:text-indigo-400 hover:underline`,

  // ヘッダ、フッタ関連
  HEADER: `flex items-center justify-between bg-sky-600 px-8 py-4 text-white`,
  HEADER_APP_NAME: `text-2xl font-extrabold`,
  HEADER_MENU: `flex items-center justify-between gap-4 text-sm font-medium`,
  FOOTER: `border-t px-4 py-2`,
  MENU_BUTTON: `cursor-pointer`,

  // エラーページ関連
  ERROR_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  ERROR_PAGE_CARD: `flex w-full max-w-md flex-col items-center rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  ERROR_PAGE_TITLE: `mb-6 text-center text-2xl font-bold text-rose-600`,
  ERROR_BUTTON: `cursor-pointer rounded bg-indigo-400 px-2 py-1 font-semibold text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-gray-300`,

  // ローディング関連
  LOADING_SPINNER: `h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-600`,
  LOADING_PAGE: `flex min-h-screen items-center justify-center`,
  LOADING_INLINE: `flex items-center justify-center py-8`,

  // Aboutページ関連
  ABOUT_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  ABOUT_PAGE_CARD: `w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  ABOUT_PAGE_TITLE: `mb-6 text-center text-2xl font-bold`,
  ABOUT_CREDIT_CARD: `m-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg`,
  ABOUT_REFERENCE: `m-2 text-sm`,

  // 認証関連
  SIGN_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  SIGN_PAGE_CARD: `w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  SIGN_PAGE_TITLE: `mb-6 text-center text-2xl font-bold`,
  SIGN_FORM: `flex flex-col gap-4`,
  SIGN_FORM_LABEL_INPUT: `flex flex-col gap-1`,
  SIGN_FORM_LABEL: `text-sm font-medium`,
  SIGN_FORM_INPUT: `rounded border border-gray-500 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-indigo-400`,
  SIGN_FORM_BUTTON: `cursor-pointer rounded bg-indigo-400 px-2 py-1 font-semibold text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-gray-300`,
  SIGN_FORM_ERROR: `text-rose-600`,
  SIGN_FORM_HINT: `mt-2 text-xs text-gray-500`,

  // マイアカウントページ関連
  MY_ACCOUNT_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  MY_ACCOUNT_PAGE_CARD: `w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  MY_ACCOUNT_PAGE_TITLE: `mb-6 text-center text-2xl font-bold`,
  MY_ACCOUNT_LABEL: `text-sm font-medium`,

  // 映画リスト関連
  LIST_MOVIE: 'mx-4 my-4 flex justify-between',
  LIST_MOVIE_LABEL_PHRASE: 'text-lg font-bold',
  LIST_MOVIE_INSIDE: 'flex flex-1 flex-wrap justify-center gap-2',
  LIST_MOVIE_BUTTON_PREV: `cursor-pointer rounded-l-lg bg-indigo-400 px-2 py-1 font-semibold text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-gray-300`,
  LIST_MOVIE_BUTTON_NEXT: `cursor-pointer rounded-r-lg bg-indigo-400 px-2 py-1 font-semibold text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-gray-300`,
  LIST_MOVIE_PER_PAGE_DEFAULT: 5,
  LIST_MOVIE_CARD_WIDTH: 128,
  LIST_MOVIE_CARD_GAP: 8,

  // 本日のおすすめ映画リスト関連
  LIST_MOVIE_DAILY_PHRASE: '本日のおすすめ',

  // 人気ベース映画推薦リスト関連
  LIST_MOVIE_POPULARITY_PHRASE: '人気の映画',
  LIST_MOVIE_POPULARITY_COUNT: 3,

  // 映画類似度ベース映画推薦リスト関連
  LIST_MOVIE_MOVIE_SIMILARITY_PHRASE: 'この映画が好きな人はこんな映画も好んでいます',

  // BPRベース映画推薦リスト関連
  LIST_MOVIE_BPR_PHRASE: 'あなたにおすすめの映画',

  // 評価済み映画リスト関連
  LIST_MOVIE_RATED_PHRASE: 'あなたが評価した映画',

  // 映画カード関連
  MOVIE_CARD: `relative flex h-56 w-32 flex-col rounded-lg border border-gray-300 bg-white shadow-lg`,
  MOVIE_IMAGE: `relative flex cursor-pointer justify-center overflow-hidden`,
  MOVIE_POSTER_PATH_DUMMY: '/img/dummy_poster.png',
  MOVIE_POSTER_WIDTH: 120,
  MOVIE_POSTER_HEIGHT: 180,
  MOVIE_INFO: 'flex items-start',
  MOVIE_LABEL_TITLE: `line-clamp-2 text-sm font-bold break-words`,
  MOVIE_STAR_WIDTH: 24,
  MOVIE_ICON_DELETE: `absolute! top-1! right-1! bg-gray-100! hover:bg-white!`,

  // 映画（詳細）カード関連
  MOVIE_DETAIL_PAGE: `flex min-h-screen items-center justify-center bg-gray-100`,
  MOVIE_DETAIL_CARD: `w-full max-w-3xl rounded-lg border border-gray-300 bg-white p-8 shadow-lg`,
  MOVIE_DETAIL_TITLE: `mb-8 text-4xl font-bold`,
  MOVIE_DETAIL_BODY: `flex flex-col gap-8 md:flex-row`,
  MOVIE_DETAIL_IMAGE: `relative flex shrink-0 cursor-pointer overflow-hidden rounded-lg`,
  MOVIE_DETAIL_POSTER_WIDTH: 150,
  MOVIE_DETAIL_POSTER_HEIGHT: 224,
  MOVIE_DETAIL_INFO: `flex flex-col gap-4`,
  MOVIE_DETAIL_LABEL_YEAR: `text-lg text-gray-500`,
  MOVIE_DETAIL_TAG_GENRES: `flex flex-wrap gap-2`,
  MOVIE_DETAIL_TAG_GENRE: `rounded bg-gray-100 px-3 py-1 text-sm`,
  MOVIE_DETAIL_PLOT: `mt-4 text-sm leading-relaxed text-gray-700`,
  MOVIE_DETAIL_STAR_WIDTH: 48,

  // 評価値関連
  STAR_BUTTON: `cursor-pointer rounded-lg bg-white hover:bg-indigo-100`,
  STAR_IMAGE: `opacity-75 hover:opacity-100 active:scale-125 active:opacity-100`,
  STAR_RATING: `flex`,
} as const;
