'use client';

import { STYLES } from '@/constants';

import signOut from '@/api/auth/signOut';

export function ButtonSignOut() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/signin';
  };

  return (
    <button onClick={handleSignOut} className={`${STYLES.MENU_BUTTON}`}>
      Sign Out
    </button>
  );
}
