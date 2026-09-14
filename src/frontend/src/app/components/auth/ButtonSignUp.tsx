'use client';

import { useRouter } from 'next/navigation';
import { STYLES } from '@/constants';

export function ButtonSignUp() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/signup');
  };

  return (
    <button type="button" onClick={handleClick} className={`${STYLES.MENU_BUTTON}`}>
      Sign Up
    </button>
  );
}
