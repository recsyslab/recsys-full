'use client';

import { STYLES } from '@/constants/styles';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={`${STYLES.ERROR_PAGE}`}>
      <div className={`${STYLES.ERROR_PAGE_CARD}`}>
        <h1 className={`${STYLES.ERROR_PAGE_TITLE}`}>Something went wrong!</h1>
        <button className={`${STYLES.ERROR_BUTTON}`} onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
