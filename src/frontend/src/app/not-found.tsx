import Link from 'next/link';

import { STYLES } from '@/constants/styles';

export default function NotFound() {
  return (
    <div className={`${STYLES.ERROR_PAGE}`}>
      <div className={`${STYLES.ERROR_PAGE_CARD}`}>
        <h1 className={`${STYLES.ERROR_PAGE_TITLE}`}>Not Found</h1>
        <Link className={`${STYLES.LINK}`} href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
