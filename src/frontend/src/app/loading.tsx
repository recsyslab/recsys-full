import { STYLES } from '@/constants';

import Loading from './components/ui/Loading';

const LoadingPage = () => {
  return (
    <div className={`${STYLES.LOADING_PAGE}`}>
      <Loading />
    </div>
  );
};

export default LoadingPage;
