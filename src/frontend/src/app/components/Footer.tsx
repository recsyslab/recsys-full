import { STYLES, SETTINGS } from '@/constants';

const Footer = () => {
  return (
    <footer className={`${STYLES.FOOTER}`}>
      <small>{SETTINGS.COPYRIGHT}</small>
    </footer>
  );
};

export default Footer;
