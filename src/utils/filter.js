import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite ),
  [FilterType.ADDED_TO_WATCHLIST]: (films) => films.filter((film) => film.isAddedToWatchlist),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter((film) => film.isAlreadyWatched),
};
