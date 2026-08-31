import Link from 'next/link';
import { STYLES } from '@/constants';

const About = () => {
  return (
    <div className={`${STYLES.ABOUT_PAGE}`}>
      <div className={`${STYLES.ABOUT_PAGE_CARD}`}>
        <h1 className={`${STYLES.ABOUT_PAGE_TITLE}`}>Acknowledgments & Credits</h1>
        <article className={`${STYLES.ABOUT_CREDIT_CARD}`}>
          This site uses&nbsp;
          <Link
            className={`${STYLES.LINK}`}
            href="https://grouplens.org/datasets/movielens/latest/"
          >
            the MovieLens Latest Datasets
          </Link>
          &nbsp;with permission from GroupLens but is not endorsed or certified by them.
          <div className={`${STYLES.ABOUT_REFERENCE}`}>
            F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets: History and
            Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4: 19:1–19:19.
            <div>
              <Link className={`${STYLES.LINK}`} href="https://doi.org/10.1145/2827872">
                https://doi.org/10.1145/2827872
              </Link>
            </div>
          </div>
        </article>
        <article className={`${STYLES.ABOUT_CREDIT_CARD}`}>
          This site uses&nbsp;
          <Link className={`${STYLES.LINK}`} href="https://www.omdbapi.com/">
            the OMDb API
          </Link>
          &nbsp; but is not endorsed or certified by OMDb API.
        </article>
      </div>
    </div>
  );
};

export default About;
