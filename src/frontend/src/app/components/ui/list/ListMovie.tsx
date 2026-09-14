'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { Movie, User } from '@/types/data';
import { STYLES } from '@/constants';
import deleteRating from '@/api/ratings/deleteRating';
import getOMDbMovie from '@/api/omdb/getOMDbMovie';

import CardMovie from '../card/CardMovie';
import Loading from '../Loading';

interface Props {
  phrase: string;
  user?: User | null;
  movies: Movie[];
  isMyList?: boolean;
}

/**
 * 映画リストコンポーネント
 */
const ListMovie = (props: Props) => {
  const [movies, setMovies] = useState<Movie[]>(props.movies);
  const [perPage, setPerPage] = useState<number>(STYLES.LIST_MOVIE_PER_PAGE_DEFAULT);
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingOmdb, setLoadingOmdb] = useState(false);

  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    setMovies(props.movies);
  }, [props.movies]);

  useEffect(() => {
    if (movies.length === 0 || perPage <= 0) {
      setCurrentMovies([]);
      return;
    }

    const start = perPage * currentPage;
    const end = start + perPage;
    const currentMovies_ = movies.slice(start, end);

    if (currentMovies_.length <= 0) {
      let currentPage_ = currentPage <= 0 ? 0 : currentPage - 1;
      setCurrentPage(currentPage_);
    } else {
      setCurrentMovies(currentMovies_);
    }
  }, [movies, perPage, currentPage]);

  useEffect(() => {
    const loadOmdbMovies = async () => {
      if (!props.movies || props.movies.length === 0) {
        setMovies(props.movies);
        return;
      }

      setLoadingOmdb(true);
      try {
        const omdbMovies = await Promise.all(
          props.movies.map(async (movie) => {
            // すでに OMDb 情報があればそのまま
            if (movie.omdbMovie) return movie;

            const res = await getOMDbMovie(movie.movie_id);
            return {
              ...movie,
              omdbMovie: res ? res.omdbMovie : undefined,
            };
          })
        );
        setMovies(omdbMovies);
      } catch (e) {
        console.error('Failed to load OMDb movies:', e);
        // 失敗した場合でも最低限の表示のため props.movies を入れておく
        setMovies(props.movies);
      } finally {
        setLoadingOmdb(false);
      }
    };

    loadOmdbMovies();
  }, [props.movies]);

  // 総ページ数の計算
  const totalPages = movies.length === 0 || perPage <= 0 ? 0 : Math.ceil(movies.length / perPage);

  /**
   * ページ変更ハンドラ
   * @param page - 移動先のページ番号
   */
  const handlePageChange = useCallback(
    (page: number) => {
      if (totalPages === 0) return;

      let newPage = page;

      // 負の値の場合は最後のページに
      if (newPage < 0) {
        newPage = Math.max(totalPages - 1, 0);
      }

      // 最大ページ数を超える場合は最初のページに
      if (newPage >= totalPages) {
        newPage = 0;
      }

      setCurrentPage(newPage);
    },
    [totalPages]
  );

  const handleRatingClick = useCallback((movie: Movie) => {
    setMovies((prev) => prev.map((m) => (m.movie_id === movie.movie_id ? movie : m)));
  }, []);

  const handleDelete = async (movie: Movie) => {
    try {
      await deleteRating(movie.movie_id);
      const movies_ = movies.filter((movie_) => movie_.movie_id != movie.movie_id);
      setMovies(movies_);
    } catch (e) {
      console.error('Failed to delete rating:', e);
    }
  };

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const count = Math.max(
        1,
        Math.floor(
          (width + STYLES.LIST_MOVIE_CARD_GAP) /
            (STYLES.LIST_MOVIE_CARD_WIDTH + STYLES.LIST_MOVIE_CARD_GAP)
        )
      );
      setPerPage(count);
    });
    observer.observe(el);
    observerRef.current = observer;
  }, []);

  // 空の状態の表示
  if (movies.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className={`${STYLES.LIST_MOVIE_LABEL_PHRASE}`}>{props.phrase}</div>
      <div className={`${STYLES.LIST_MOVIE}`}>
        <div className={`${STYLES.LIST_MOVIE_INSIDE}`} ref={containerRef}>
          <button
            className={`${STYLES.LIST_MOVIE_BUTTON_PREV}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={totalPages <= 1}
            type="button"
          >
            <ArrowBackIosIcon />
          </button>
          {loadingOmdb ? (
            <div className={`${STYLES.LOADING_INLINE}`}>
              <Loading />
            </div>
          ) : (
            <div ref={containerRef} className={`${STYLES.LIST_MOVIE_INSIDE}`}>
              {currentMovies.map((movie, index) => (
                <CardMovie
                  movie={movie}
                  user={props.user}
                  isMyList={props.isMyList}
                  handleRatingClick={handleRatingClick}
                  handleDelete={handleDelete}
                  key={movie.movie_id}
                />
              ))}
            </div>
          )}
          <button
            className={`${STYLES.LIST_MOVIE_BUTTON_NEXT}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={totalPages <= 1}
            type="button"
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default ListMovie;
